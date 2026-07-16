export default function Hero() {
  return (
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
          অন্যান্য শিক্ষাসামগ্রী সহজে খুঁজে পাওয়ার একটি কমিউনিটি-ভিত্তিক
          <span className="font-semibold"> Open Source</span> ওয়েবসাইট
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
  );
}
