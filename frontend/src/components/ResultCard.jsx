import { gradeBadgeClass } from "../utils/grade";
import { generateResultPdf } from "../utils/generateResultPdf";

export default function ResultCard({ data }) {
  const isPassed = (data.result || "").toUpperCase() === "PASSED";

  const exportPDF = () => generateResultPdf(data);

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
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
          <div className="flex gap-2 items-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                isPassed
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >
              {data.result}
            </span>
            <button
              onClick={exportPDF}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-wider rounded-lg hover:bg-emerald-500 hover:text-black transition-all duration-200 shrink-0"
              title="Download PDF"
            >
              ⬇ PDF
            </button>
          </div>
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
