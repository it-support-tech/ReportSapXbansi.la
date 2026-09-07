import { UploadStage } from "../types/report.types";

const STEPS: { stage: UploadStage; label: string }[] = [
  { stage: "uploading", label: "ອັບໂຫຼດໄຟລ໌" },
  { stage: "processing", label: "ປະມວນຜົນຂໍ້ມູນ" },
  { stage: "done", label: "ສຳເລັດ" },
];

const stageOrder: Record<UploadStage, number> = {
  idle: -1,
  uploading: 0,
  processing: 1,
  done: 2,
  error: -1,
};

interface ProgressIndicatorProps {
  stage: UploadStage;
  progress: number;
}

export const ProgressIndicator = ({ stage, progress }: ProgressIndicatorProps) => {
  const currentIndex = stageOrder[stage];

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
        {STEPS.map((step, i) => (
          <span key={step.stage} className={i <= currentIndex ? "text-secondary" : ""}>
            {step.label}
          </span>
        ))}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
          style={{ width: `${stage === "uploading" ? progress : currentIndex >= 0 ? 100 : 0}%` }}
        />
      </div>
    </div>
  );
};
