import { PREVIEW_TABLE_COLUMNS } from "../constants/tableHeaders";
import { MergedRow } from "../types/report.types";

interface PreviewTableProps {
  rows: MergedRow[];
  maxRows?: number;
}

const ALIGN_CLASSES: Record<"left" | "center" | "right", string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const getCellValue = (row: MergedRow, key: string, source: "sap" | "banchi" | "root"): string => {
  if (key === "matched") return row.matched ? "✔ Matched" : "✘ Unmatched";
  if (source === "root") return String((row as unknown as Record<string, unknown>)[key] ?? "-");
  const bag = source === "sap" ? row.sap : row.banchi;
  const value = bag?.[key];
  return value === null || value === undefined ? "-" : String(value);
};

export const PreviewTable = ({ rows, maxRows = 50 }: PreviewTableProps) => {
  const visibleRows = rows.slice(0, maxRows);

  return (
    <div className="scrollbar-thin overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-secondary text-white">
          <tr>
            {PREVIEW_TABLE_COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap ${ALIGN_CLASSES[col.align ?? "left"]}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, i) => (
            <tr key={`${row.invoiceNumber}-${i}`} className={`${i % 2 === 1 ? "bg-slate-50" : "bg-white"} border-t border-slate-100`}>
              {PREVIEW_TABLE_COLUMNS.map((col) => (
                <td
                  key={col.key}
                  className={`px-3 py-2 whitespace-nowrap ${ALIGN_CLASSES[col.align ?? "left"]} ${
                    col.key === "matched" ? (row.matched ? "text-secondary font-medium" : "text-primary font-medium") : "text-slate-700"
                  }`}
                >
                  {getCellValue(row, col.key, col.source)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > maxRows && (
        <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
          ສະແດງ {maxRows} ຈາກທັງໝົດ {rows.length} ລາຍການ — ໄຟລ໌ Excel ທີ່ດາວໂຫຼດຈະມີຂໍ້ມູນຄົບຖ້ວນ
        </p>
      )}
    </div>
  );
};
