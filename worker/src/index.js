/**
 * Cloudflare Worker replacing api.php + actions/*.php + inc/*.php.
 *
 * Routes:
 *   GET  /api/captcha  -> fetch nonce + captcha image from upstream
 *   POST /api/fetch    -> submit result lookup
 *
 * Session/cookie handling:
 *   PHP used $_SESSION + a per-session cookie-jar file on disk.
 *   Workers have no disk, so we use a signed-less random session id
 *   ("sid") stored as an httpOnly cookie on our own domain, and keep
 *   the upstream cookie jar + nonce + site_session_id in KV, keyed by sid.
 */

const BDRC_BASE_URL = "SERVER_BASE_URL";
const SESSION_TTL_SECONDS = 600; // 10 min, plenty for a captcha+submit flow

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(payload, origin, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
      ...extraHeaders,
    },
  });
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? match[1] : null;
}

function sessionCookieHeader(sid) {
  // SameSite=None + Secure required since the frontend (Vercel) and the
  // API (Workers) live on different origins.
  return `sid=${sid}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${SESSION_TTL_SECONDS}`;
}

/** Merge existing "k=v; k2=v2" cookie string with new Set-Cookie response headers. */
function mergeCookies(existingCookieHeader, response) {
  const jar = {};
  if (existingCookieHeader) {
    existingCookieHeader.split(";").forEach((pair) => {
      const idx = pair.indexOf("=");
      if (idx === -1) return;
      const k = pair.slice(0, idx).trim();
      const v = pair.slice(idx + 1).trim();
      if (k) jar[k] = v;
    });
  }
  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() !== "set-cookie") continue;
    const first = value.split(";")[0];
    const idx = first.indexOf("=");
    if (idx === -1) continue;
    const k = first.slice(0, idx).trim();
    const v = first.slice(idx + 1).trim();
    if (k) jar[k] = v;
  }
  return Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

/** POST to the upstream AJAX endpoint, forwarding/collecting cookies. */
async function bdrcPost(data, cookieHeader) {
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  if (cookieHeader) headers["Cookie"] = cookieHeader;

  const res = await fetch(BDRC_BASE_URL, {
    method: "POST",
    headers,
    body: new URLSearchParams(data).toString(),
  });

  const newCookieHeader = mergeCookies(cookieHeader, res);

  let json;
  try {
    json = await res.json();
  } catch (e) {
    json = { success: false, error: "non-json response" };
  }

  return { json, cookieHeader: newCookieHeader };
}

async function handleCaptcha(request, env, origin) {
  let sid = getCookie(request, "sid");
  if (!sid) sid = crypto.randomUUID();

  const existing = sid ? await env.SESSIONS.get(sid, "json") : null;
  let cookieHeader = existing?.cookie || "";

  const nonceStep = await bdrcPost({ action: "bdrc_nonce" }, cookieHeader);
  if (!nonceStep.json.success) {
    return jsonResponse(
      { success: false, data: { message: "Failed to initialize security key." } },
      origin
    );
  }
  const nonce = nonceStep.json.data.nonce;
  cookieHeader = nonceStep.cookieHeader;

  const captchaStep = await bdrcPost(
    { action: "bdrc_captcha", nonce },
    cookieHeader
  );
  if (!captchaStep.json.success) {
    return jsonResponse(
      { success: false, data: { message: "Failed to retrieve verification image." } },
      origin
    );
  }
  cookieHeader = captchaStep.cookieHeader;

  const siteSessionId =
    captchaStep.json.data.session_id || crypto.randomUUID().replace(/-/g, "").slice(0, 22);

  await env.SESSIONS.put(
    sid,
    JSON.stringify({ cookie: cookieHeader, nonce, siteSessionId }),
    { expirationTtl: SESSION_TTL_SECONDS }
  );

  return jsonResponse(
    { success: true, image: captchaStep.json.data.image },
    origin,
    { "Set-Cookie": sessionCookieHeader(sid) }
  );
}

async function handleFetch(request, env, origin) {
  const sid = getCookie(request, "sid");
  const session = sid ? await env.SESSIONS.get(sid, "json") : null;

  if (!session || !session.nonce) {
    return jsonResponse(
      { success: false, data: { message: "No active session found. Please refresh the page." } },
      origin
    );
  }

  const form = await request.formData();

  const payload = {
    action: "bdrc_fetch",
    exam: "ssc",
    year: form.get("year") || "2026",
    board: form.get("board") || "",
    result_type: form.get("result_type") || "1",
    roll: form.get("roll") || "",
    reg: form.get("reg") || "",
    eiin: form.get("eiin") || "",
    dcode: form.get("dcode") || "",
    district_label: form.get("district_label") || "",
    captcha: form.get("captcha") || "",
    session_id: session.siteSessionId,
    nonce: session.nonce,
  };

  const { json } = await bdrcPost(payload, session.cookie);

  // Nonce is single-use, mirroring the PHP behavior of unset($_SESSION['nonce']).
  await env.SESSIONS.put(
    sid,
    JSON.stringify({ cookie: session.cookie, nonce: null, siteSessionId: session.siteSessionId }),
    { expirationTtl: SESSION_TTL_SECONDS }
  );

  return jsonResponse(json, origin);
}

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (url.pathname === "/api/captcha" && request.method === "GET") {
      return handleCaptcha(request, env, origin);
    }

    if (url.pathname === "/api/fetch" && request.method === "POST") {
      return handleFetch(request, env, origin);
    }

    return jsonResponse({ success: false, data: { message: "Unknown action." } }, origin);
  },
};
