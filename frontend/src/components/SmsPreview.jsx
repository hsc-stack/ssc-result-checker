import toast from "react-hot-toast";

export default function SmsPreview({ form, smsMessage, smsHref }) {
  return (
    <div className="bg-surfaceElevated/40 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-amber-400" />
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
          মেসেজের মাধ্যমে রেজাল্ট চেক করুন (Alternative)
        </h3>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">
        সার্ভার ডাউন থাকলে সরাসরি আপনার সিম থেকে মেসেজ পাঠিয়ে রেজাল্ট জানতে
        পারবেন (চার্জ প্রযোজ্য)। উপরে আপনার বোর্ড এবং রোল পূরণ করুন, তারপর
        নিচের সেন্ড মেসেজ বাটনে ক্লিক করুন এবং আপনার ফোন থেকে মেসেজ পাঠান
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
  );
}
