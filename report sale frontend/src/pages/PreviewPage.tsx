import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { SummaryStats } from "../components/SummaryStats";
import { PreviewTable } from "../components/PreviewTable";
import { ProcessReportResponse } from "../types/report.types";

interface PreviewPageProps {
  result: ProcessReportResponse;
  onDownload: () => void;
  onStartOver: () => void;
}

export const PreviewPage = ({ result, onDownload, onStartOver }: PreviewPageProps) => (
  <div className="mx-auto max-w-6xl px-6 py-10">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-secondary">ຜົນການປະມວນຜົນ</h1>
        <p className="mt-1 text-sm text-slate-500">ກວດສອບຂໍ້ມູນກ່ອນດາວໂຫຼດ Report ສະບັບເຕັມ</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onStartOver}>
          ອັບໂຫຼດໄຟລ໌ໃໝ່
        </Button>
        <Button variant="primary" onClick={onDownload}>
          ⬇ ດາວໂຫຼດ Report (.xlsx)
        </Button>
      </div>
    </div>

    {result.warnings.length > 0 && (
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {result.warnings.map((w) => (
          <p key={w}>⚠ {w}</p>
        ))}
      </div>
    )}

    <div className="mb-6">
      <SummaryStats summary={result.summary} />
    </div>

    <Card>
      <PreviewTable rows={result.rows} />
    </Card>
  </div>
);
