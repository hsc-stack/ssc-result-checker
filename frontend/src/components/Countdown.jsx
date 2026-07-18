import { useState } from "react";

export default function Countdown() {
  return (
    <div className="text-center space-y-6 max-w-md mx-auto p-4 select-none">
      {/* Mega Postponed Badge */}
      <div className="inline-block bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-extrabold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full animate-pulse shadow-lg shadow-amber-500/5">
        ⚠️ ব্রেকিং নিউজ: ডেট চেঞ্জ!
      </div>

      {/* Main Punchline Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          ডিয়ার স্টুডেন্টস , <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            "পিকচার আভি বাকি হ্যায়!"
          </span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 px-4 font-medium leading-relaxed">
          রেজাল্টের ডেট পিছিয়ে গেছে! হার্টবিট নরমাল করো। আম্মুর হাতের ঝাঁটা
          কিংবা মিষ্টির প্যাকেট—দুইটাই আপাতত হোল্ডে থাক।
        </p>
      </div>

      {/* High-Humor Content Area */}
      <div className="bg-zinc-900/90 border-2 border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-emerald-950/20 space-y-4">
        <div className="text-left space-y-3 text-sm text-zinc-400">
          <div className="flex items-center gap-3 bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-700/50">
            <span className="text-xl">⏳</span>
            <span>
              <strong>নতুন টাইম:</strong> এখনও অজানা , নতুন আপডেট আসলে জানানো
              হবে।
            </span>
          </div>
          <div className="flex items-center gap-3 bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-700/50">
            <span className="text-xl">🏃‍♂️</span>
            <span>
              <strong>বাসা থেকে পালানোর প্রিপারেশন :</strong> আরও কিছুদিন
              এক্সটেন্ড করা হলো।
            </span>
          </div>
          <div className="flex items-center gap-3 bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-700/50">
            <span className="text-xl">📞</span>
            <span>
              <strong>পাশের বাসার আন্টিও</strong> হোল্ড করছেন। ডেট হলে তখন কল
              দিয়ে রেজাল্ট জিজ্ঞাসা করবেন।
            </span>
          </div>
        </div>
      </div>

      {/* Footer Teaser */}
      <p className="text-[11px] font-bold text-zinc-500 tracking-wider uppercase">
        স্টে টিউনড • আসল কাউন্টডাউন খুব শীঘ্রই ফিরছে...
      </p>
    </div>
  );
}
