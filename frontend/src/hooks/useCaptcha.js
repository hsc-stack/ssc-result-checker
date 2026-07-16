import { useEffect, useState } from "react";
import { API_URL } from "../constants";

export function useCaptcha() {
  const [captchaImg, setCaptchaImg] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [captchaError, setCaptchaError] = useState("");

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

  return { captchaImg, captchaLoading, captchaError, loadCaptcha };
}
