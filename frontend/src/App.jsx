import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

const BOARDS = [
  "dhaka",
  "rajshahi",
  "comilla",
  "chittagong",
  "jessore",
  "sylhet",
  "dinajpur",
  "barisal",
  "mymensingh",
  "madrasah",
  "technical",
];

// Mapping for SMS Board Codes
const SMS_BOARD_CODES = {
  dhaka: "DHA",
  rajshahi: "RAJ",
  comilla: "COM",
  chittagong: "CHI",
  jessore: "JES",
  sylhet: "SYL",
  dinajpur: "DIN",
  barisal: "BAR",
  mymensingh: "MYM",
  madrasah: "MAD",
  technical: "TEC",
};

const GRADE_COLORS = {
  "A+": "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
  A: "text-lime-400 bg-lime-400/10 border-lime-400/20",
  "A-": "text-yellow-400 bg-yellow-400/10 border-yellow-500/20",
  B: "text-amber-400 bg-amber-400/10 border-amber-500/20",
  C: "text-orange-400 bg-orange-400/10 border-orange-500/20",
  D: "text-rose-400 bg-rose-400/10 border-rose-500/20",
  F: "text-red-500 bg-red-500/10 border-red-500/25",
};

function gradeBadgeClass(grade) {
  return (
    GRADE_COLORS[grade.trim().toUpperCase()] ||
    "text-zinc-300 bg-zinc-800 border-zinc-750"
  );
}

function Spinner({ className = "h-5 w-5 text-emerald-400" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function App() {
  const [form, setForm] = useState({
    year: "2026",
    board: "",
    roll: "",
    reg: "",
    captcha: "",
  });
  const [captchaImg, setCaptchaImg] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const captchaInputRef = useRef(null);
  const [captchaError, setCaptchaError] = useState("");

  // Build the SMS code structures dynamically
  const activeBoardCode = SMS_BOARD_CODES[form.board] || "BOARD";
  const smsMessage =
    `SSC ${activeBoardCode} ${form.roll || "ROLL"} ${form.year}`.toUpperCase();

  // Cross-browser compatible SMS URI parser helper
  const smsHref = `sms:16222?body=${encodeURIComponent(smsMessage)}`;

  async function loadCaptcha() {
    setCaptchaLoading(true);
    setCaptchaImg("");
    setCaptchaError("");

    try {
      const r = await fetch(`${API_URL}/api/captcha`, {
        credentials: "include",
      });

      const d = await r.json();

      if (d.success === false) {
        setCaptchaError(d.data?.message || "Security validation failed.");
        return;
      }

      setCaptchaImg(d.image);
    } catch (e) {
      setCaptchaError("Network timeout. Check your internet connection.");
    } finally {
      setCaptchaLoading(false);
    }
  }

  useEffect(() => {
    loadCaptcha();
  }, []);

  function showError(msg) {
    setResult(null);
    setError(msg);
    setShowResult(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setShowResult(false);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    try {
      const r = await fetch(`${API_URL}/api/fetch`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const d = await r.json();

      if (d.success === false) {
        showError(
          d.data?.message ||
            d.error ||
            "Server rejected the transaction parameters.",
        );
      } else {
        setError("");
        setResult(d.data.data);
        setShowResult(true);
      }
    } catch (err) {
      showError("Network timeout. Check your internet connection.");
    } finally {
      setSubmitting(false);
      setForm((f) => ({ ...f, captcha: "" }));
      loadCaptcha();
    }
  }

  function translateError(msg) {
    const errors = {
      "Result not found. Please check your details.":
        "ফলাফল পাওয়া যায়নি। তথ্যগুলো সঠিক আছে কিনা যাচাই করুন।",

      "Wrong captcha. Please refresh and try again.":
        "ক্যাপচা কোড ভুল হয়েছে। ছবিতে দেখানো কোডটি নির্ভুলভাবে লিখুন।",

      "Network timeout. Check your internet connection.":
        "এই মুহূর্তে সার্ভার ডাউন রয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন অথবা মেসেজের মাধ্যমে রেজাল্ট চেক করুন ",

      "Security validation failed.":
        "নিরাপত্তা যাচাই ব্যর্থ হয়েছে। পেজটি রিফ্রেশ করুন। ",
    };

    return errors[msg] || msg;
  }

  return (
    <>
      {/* Ambient background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-emerald-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
        <div
          className="absolute top-[30%] right-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 z-10 w-full max-w-2xl mx-auto">
        <main className="w-full mt-6 sm:mt-10 mb-10 sm:mb-12 flex flex-col gap-6 sm:gap-8">
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white px-2">
                SSC Result <span className="text-emerald-400">Checker</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed px-4">
                Powered by{" "}
                <a
                  href="https://hscstack.tajimz.xyz"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
                >
                  HSC Stack
                </a>{" "}
                — HSC শিক্ষার্থীদের জন্য বেস্ট ক্লাস, নোট, সাজেশন, প্রাকটিকাল ও
                অন্যান্য শিক্ষাসামগ্রী সহজে খুঁজে পাওয়ার একটি কমিউনিটি-ভিত্তিক
                <span className="font-semibold"> Open Source</span> ওয়েবসাইট
              </p>
            </div>
            <a
              href="https://hscstack.tajimz.xyz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface border border-zinc-800/80 rounded-full hover:bg-zinc-800/45 transition-all duration-300 group"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-zinc-300 tracking-wide">
                HSC Stack ভিজিট করুন
              </span>
            </a>
          </div>

          {/* Form */}
          <div className="bg-surfaceElevated/40 border border-zinc-800 rounded-2xl overflow-hidden">
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5">
              <div className="border-b border-zinc-800/60 pb-3 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                  অনলাইনে রেজাল্ট চেক করুন
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                    Passing Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    className="w-full bg-surfaceElevated border border-zinc-800 rounded-xl px-4 py-3 outline-none font-medium text-white text-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                    Education Board
                  </label>
                  <select
                    name="board"
                    value={form.board}
                    onChange={handleChange}
                    required
                    className="w-full bg-surfaceElevated border border-zinc-800 rounded-xl px-4 py-3 outline-none font-medium text-white"
                  >
                    <option value="" disabled>
                      Select Board
                    </option>
                    {BOARDS.map((b) => (
                      <option key={b} value={b}>
                        {b[0].toUpperCase() + b.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="roll"
                    value={form.roll}
                    onChange={handleChange}
                    placeholder="6 Digits"
                    required
                    className="w-full bg-surfaceElevated border border-zinc-800 rounded-xl px-4 py-3 outline-none font-medium placeholder-zinc-600 text-white text-center tracking-[0.2em]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                    Registration No
                  </label>
                  <input
                    type="text"
                    name="reg"
                    value={form.reg}
                    onChange={handleChange}
                    placeholder="Required"
                    required
                    className="w-full bg-surfaceElevated border border-zinc-800 rounded-xl px-4 py-3 outline-none font-medium placeholder-zinc-600 text-white text-center tracking-[0.2em]"
                  />
                </div>
              </div>

              {/* Captcha */}
              <div className="bg-surfaceElevated p-4 sm:p-5 rounded-xl border border-zinc-800 space-y-4">
                <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-widest">
                  Security Challenge
                </label>
                <p className="mt-1 text-xs text-zinc-400">
                  নিচের কোডটি লিখুন। যদি এটি বুঝতে অসুবিধা হয়, তাহলে রিফ্রেশ
                  বাটনে ক্লিক করুন।
                </p>

                <div className="relative flex justify-center items-center bg-white rounded-lg h-[70px] overflow-hidden border border-zinc-700">
                  {captchaLoading && (
                    <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center z-10">
                      <Spinner />
                    </div>
                  )}

                  {captchaError && !captchaLoading && (
                    <p className="text-xs text-red-500 text-center px-3">
                      {translateError(captchaError)}
                    </p>
                  )}

                  {captchaImg && !captchaLoading && (
                    <img
                      src={captchaImg}
                      alt="Captcha"
                      className="h-14 max-w-full object-contain"
                    />
                  )}
                </div>

                <div className="flex gap-3">
                  <input
                    ref={captchaInputRef}
                    name="captcha"
                    value={form.captcha}
                    onChange={handleChange}
                    placeholder="Code"
                    required
                    autoComplete="off"
                    className="flex-1 min-w-0 bg-surface border border-zinc-800 rounded-xl px-4 py-3 outline-none font-mono tracking-[0.3em] text-center text-lg uppercase text-emerald-400 placeholder-zinc-700"
                  />
                  <button
                    type="button"
                    title="Reload Captcha"
                    onClick={loadCaptcha}
                    className="shrink-0 px-4 sm:px-5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-xl transition-colors duration-200"
                  >
                    ↻
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-emerald-500 text-black font-bold text-base py-3.5 transition-all duration-300 active:scale-[0.98] hover:bg-emerald-400 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Spinner className="h-4 w-4 text-black" />
                    <span>অপেক্ষা করুন ...</span>
                  </>
                ) : (
                  <span>রেজাল্ট চেক করুন</span>
                )}
              </button>
            </form>
          </div>

          {/* Live SMS Preview Section */}
          <div className="bg-surfaceElevated/40 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-400" />
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                মেসেজের মাধ্যমে রেজাল্ট চেক করুন (Alternative)
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              সার্ভার ডাউন থাকলে সরাসরি আপনার সিম থেকে মেসেজ পাঠিয়ে রেজাল্ট
              জানতে পারবেন (চার্জ প্রযোজ্য)। উপরে আপনার বোর্ড এবং রোল পূরণ করুন,
              তারপর নিচের সেন্ড মেসেজ বাটনে ক্লিক করুন এবং আপনার ফোন থেকে মেসেজ
              পাঠান
            </p>

            {/* Chat bubble UI style configuration */}
            <div className="bg-zinc-900/60 rounded-xl p-4 border border-zinc-800/80 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-zinc-500 text-[10px] uppercase tracking-wider pb-1.5 border-b border-zinc-800/40">
                <span>
                  To: <span className="text-emerald-400 font-bold">16222</span>
                </span>
                <span>Live Preview</span>
              </div>
              <div className="flex justify-end">
                <div className="bg-emerald-500 text-black px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[85%] font-bold text-sm tracking-wide shadow-md">
                  {smsMessage}
                </div>
              </div>
            </div>

            <a
              href={smsHref}
              onClick={(e) => {
                if (!form.roll.trim() || !form.board || !form.year) {
                  e.preventDefault();
                  toast.error("তথ্য পূরণ করুন");
                }
              }}
              className="w-full text-center rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold text-sm py-3 px-4 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>✉</span>
              <span>মেসেজ পাঠান</span>
            </a>
          </div>

          {/* Result / error */}
          {showResult && (
            <div className="bg-surfaceElevated/40 border border-zinc-800 rounded-2xl p-5 sm:p-8 transition-all duration-500">
              {error ? (
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg shrink-0 border border-rose-500/20">
                    !
                  </div>
                  <div>
                    <h4 className="text-rose-400 font-bold text-sm tracking-wide uppercase">
                      রিকোয়েস্ট সফল হয়নি
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
                      {translateError(error)}
                    </p>
                  </div>
                </div>
              ) : result ? (
                <ResultCard data={result} />
              ) : null}
            </div>
          )}
        </main>

        {/* Footer / disclaimer */}
        <footer className="w-full border-t border-zinc-800/50 pt-6 pb-4">
          <div className="bg-surfaceElevated border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/60">
              <h5 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                Disclaimer & Official Source
              </h5>
              <a
                href="https://www.educationboardresults.gov.bd/v2/home"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-500 hover:text-amber-400 font-semibold"
              >
                Visit Official Website
              </a>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              This is <strong>NOT</strong> an official government website and is
              not affiliated with the Ministry of Education or any Bangladesh
              Education Board. We operate purely as an independent community
              utility to fetch public academic data. For official services,
              please visit the{" "}
              <a
                href="https://www.educationboardresults.gov.bd/v2/home"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-300 underline hover:text-amber-500"
              >
                Official Education Board Results Website
              </a>
              .
            </p>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[13px] text-zinc-500">
            <span>
              Made with <span className="text-red-400">♥</span> by{" "}
              <a
                href="https://hscstack.tajimz.xyz"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-400 underline decoration-2 underline-offset-4 hover:text-emerald-300 transition-colors"
              >
                HSC Stack
              </a>
            </span>

            <span className="text-zinc-700">•</span>

            <a
              href="/privacy.html"
              className="hover:text-zinc-300 transition-colors"
            >
              Privacy Policy
            </a>

            <span className="text-zinc-700">•</span>

            <a
              href="/terms.html"
              className="hover:text-zinc-300 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}

function ResultCard({ data }) {
  const isPassed = (data.result || "").toUpperCase() === "PASSED";
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {data.name}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Roll:{" "}
            <span className="text-zinc-200 font-mono font-medium">
              {data.roll}
            </span>{" "}
            &nbsp;&bull;&nbsp; Reg:{" "}
            <span className="text-zinc-200 font-mono font-medium">
              {data.reg}
            </span>
          </p>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
              isPassed
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {data.result}
          </span>
          <div className="text-base sm:text-xl font-display font-bold text-white">
            GPA <span className="text-emerald-400">{data.gpa || "0.00"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] leading-relaxed">
        <InfoBox label="Institution Name" value={data.institute} />
        <InfoBox
          label="Board & Curriculum"
          value={`${data.board} • ${data.group}`}
        />
        <InfoBox label="Father's Name" value={data.father_name} />
        <InfoBox label="Mother's Name" value={data.mother_name} />
      </div>

      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-surfaceElevated">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-500 uppercase text-[9px] tracking-widest font-bold">
              <tr>
                <th className="px-4 py-3.5 text-center w-16">Code</th>
                <th className="px-4 py-3.5">Subject Description</th>
                <th className="px-4 py-3.5 text-center w-20">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850/50 text-zinc-300 font-medium">
              {(data.grades || []).map((g, i) => (
                <tr key={i} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-4 py-3 text-center text-zinc-500 font-mono text-[11px]">
                    {g.code}
                  </td>
                  <td className="px-4 py-3 truncate max-w-[200px] sm:max-w-none">
                    {g.subject}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${gradeBadgeClass(g.grade)}`}
                    >
                      {g.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="space-y-1.5 p-3.5 bg-surfaceElevated border border-zinc-800/60 rounded-xl">
      <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest block">
        {label}
      </span>
      <span className="text-zinc-200 font-medium leading-normal">{value}</span>
    </div>
  );
}
