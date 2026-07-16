import { BOARDS } from "../constants";
import { translateError } from "../utils/errors";
import Spinner from "./Spinner";

export default function ResultForm({
  form,
  onChange,
  onSubmit,
  submitting,
  captchaImg,
  captchaLoading,
  captchaError,
  captchaInputRef,
  onReloadCaptcha,
}) {
  return (
    <div className="bg-surfaceElevated/40 border border-zinc-800 rounded-2xl overflow-hidden">
      <form onSubmit={onSubmit} className="p-5 sm:p-8 space-y-5">
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
            নিচের কোডটি লিখুন। যদি এটি বুঝতে অসুবিধা হয়, তাহলে রিফ্রেশ বাটনে
            ক্লিক করুন।
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
              onChange={onChange}
              placeholder="Code"
              required
              autoComplete="off"
              className="flex-1 min-w-0 bg-surface border border-zinc-800 rounded-xl px-4 py-3 outline-none font-mono tracking-[0.3em] text-center text-lg uppercase text-emerald-400 placeholder-zinc-700"
            />
            <button
              type="button"
              title="Reload Captcha"
              onClick={onReloadCaptcha}
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
  );
}
