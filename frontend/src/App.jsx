import { useRef, useState } from "react";
import { API_URL, SMS_BOARD_CODES } from "./constants";
import { useCaptcha } from "./hooks/useCaptcha";
import AmbientBackground from "./components/AmbientBackground";
import Hero from "./components/Hero";
import ResultForm from "./components/ResultForm";
import ResultPanel from "./components/ResultPanel";
import SmsPreview from "./components/SmsPreview";
import Footer from "./components/Footer";
import Countdown from "./components/Countdown";

export default function App() {
  const [form, setForm] = useState({
    year: "2026",
    board: "",
    roll: "",
    reg: "",
    captcha: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const captchaInputRef = useRef(null);

  const { captchaImg, captchaLoading, captchaError, loadCaptcha } =
    useCaptcha();

  // Build the SMS code structures dynamically
  const activeBoardCode = SMS_BOARD_CODES[form.board] || "BOARD";
  const smsMessage =
    `SSC ${activeBoardCode} ${form.roll || "ROLL"} ${form.year}`.toUpperCase();

  // Cross-browser compatible SMS URI parser helper
  const smsHref = `sms:16222?body=${encodeURIComponent(smsMessage)}`;

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

  return (
    <>
      <AmbientBackground />

      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 z-10 w-full max-w-2xl mx-auto">
        <main className="w-full mt-6 sm:mt-10 mb-10 sm:mb-12 flex flex-col gap-6 sm:gap-8">
          <Hero />
          <Countdown />

          <ResultForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            captchaImg={captchaImg}
            captchaLoading={captchaLoading}
            captchaError={captchaError}
            captchaInputRef={captchaInputRef}
            onReloadCaptcha={loadCaptcha}
          />

          {showResult && <ResultPanel error={error} result={result} />}

          <SmsPreview form={form} smsMessage={smsMessage} smsHref={smsHref} />
        </main>

        <Footer />
      </div>
    </>
  );
}
