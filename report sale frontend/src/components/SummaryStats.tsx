import { MatchSummary } from "../types/report.types";

interface SummaryStatsProps {
  summary: MatchSummary;
}

export const SummaryStats = ({ summary }: SummaryStatsProps) => {
  const stats = [
    { label: "SAP B1 ທັງໝົດ", value: summary.totalSap },
    { label: "ບັນຊີ.la ທັງໝົດ", value: summary.totalBanchi },
    { label: "Match ສຳເລັດ", value: summary.matched, accent: "text-secondary" },
    { label: "ບໍ່ Match (SAP)", value: summary.unmatchedSap, accent: "text-primary" },
    { label: "ບໍ່ Match (ບັນຊີ.la)", value: summary.unmatchedBanchi, accent: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-card">
          <p className={`text-2xl font-bold ${s.accent ?? "text-slate-800"}`}>{s.value.toLocaleString()}</p>
          <p className="mt-1 text-xs text-slate-500">{s.label}</p>
        </div>
      ))}
    </div>
  );
};
