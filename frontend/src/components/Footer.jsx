export default function Footer() {
  return (
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

        <a href="/privacy.html" className="hover:text-zinc-300 transition-colors">
          Privacy Policy
        </a>

        <span className="text-zinc-700">•</span>

        <a href="/terms.html" className="hover:text-zinc-300 transition-colors">
          Terms of Service
        </a>
      </div>
    </footer>
  );
}
