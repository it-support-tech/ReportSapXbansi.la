import { SAP_DEBUG_COLUMNS } from "../constants/tableHeaders";
import { SapDebugResponse } from "../types/report.types";

const ALIGN_CLASSES: Record<"left" | "center" | "right", string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

interface SapDebugTableProps {
  result: SapDebugResponse;
  maxRows?: number;
}

export const SapDebugTable = ({ result, maxRows = 50 }: SapDebugTableProps) => {
  const visibleRows = result.rows.slice(0, maxRows);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-4 text-sm text-slate-600">
        <span>ອ່ານໄດ້ທັງໝົດ: <strong>{result.totalRowsRead}</strong> ແຖວ</span>
        <span>ຂ້າມ (ບໍ່ມີ Invoice No): <strong className="text-primary">{result.skippedRows}</strong> ແຖວ</span>
        <span>ດຶງອອກມາໄດ້: <strong className="text-secondary">{result.rows.length}</strong> ແຖວ</span>
      </div>

      {result.warnings.length > 0 && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {result.warnings.map((w) => (
            <p key={w}>⚠ {w}</p>
          ))}
        </div>
      )}

      <div className="scrollbar-thin max-h-[60vh] overflow-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[1400px] text-left text-xs">
          <thead className="sticky top-0 bg-secondary text-white">
            <tr>
              <th className="px-2 py-2 text-center font-semibold">#</th>
              {SAP_DEBUG_COLUMNS.map((col) => (
                <th key={col.key} className={`whitespace-nowrap px-2 py-2 font-semibold ${ALIGN_CLASSES[col.align ?? "left"]}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr key={i} className={`${i % 2 === 1 ? "bg-slate-50" : "bg-white"} border-t border-slate-100`}>
                <td className="px-2 py-1.5 text-center text-slate-400">{i + 1}</td>
                {SAP_DEBUG_COLUMNS.map((col) => {
                  const value = row[col.key];
                  return (
                    <td
                      key={col.key}
                      className={`whitespace-nowrap px-2 py-1.5 ${ALIGN_CLASSES[col.align ?? "left"]} ${
                        value === null || value === undefined ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {value === null || value === undefined ? "-" : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {result.rows.length > maxRows && (
          <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
            ສະແດງ {maxRows} ຈາກທັງໝົດ {result.rows.length} ແຖວ
          </p>
        )}
      </div>
    </div>
  );
};
