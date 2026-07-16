import { useEffect, useState } from "react";

export default function Countdown() {
  // Target Date: July 20, 2026, 12:00 PM
  const targetDate = new Date("2026-07-20T12:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = targetDate - Date.now();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className="text-center py-3 px-6 bg-emerald-500/20 border border-emerald-400 rounded-xl max-w-sm mx-auto shadow-lg shadow-emerald-500/10 animate-pulse">
        <span className="text-base font-bold text-emerald-300">
          SSC রেজাল্ট প্রকাশিত হয়েছে! 🎉
        </span>
      </div>
    );
  }

  return (
    <div className="text-center space-y-3 max-w-md mx-auto">
      <p className="text-xs sm:text-sm text-zinc-300 font-semibold tracking-wide uppercase">
        SSC রেজাল্ট প্রকাশের বাকি আর মাত্র
      </p>

      <div className="flex justify-center gap-3 sm:gap-4">
        {[
          { label: "দিন", value: timeLeft.days },
          { label: "ঘণ্টা", value: timeLeft.hours },
          { label: "মিনিট", value: timeLeft.minutes },
          { label: "সেকেন্ড", value: timeLeft.seconds },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center bg-zinc-800/80 border-2 border-emerald-500/30 rounded-xl p-3 w-16 sm:w-20 shadow-md shadow-emerald-950/50 hover:border-emerald-400 transition-colors"
          >
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-300 font-bold mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
