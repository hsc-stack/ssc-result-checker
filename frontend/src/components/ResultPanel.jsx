import { translateError } from "../utils/errors";
import ResultCard from "./ResultCard";

export default function ResultPanel({ error, result }) {
  return (
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
  );
}
