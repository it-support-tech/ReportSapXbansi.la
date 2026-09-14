import { useCallback, useState } from "react";
import { downloadReportFile, processReportFiles } from "../services/reportService";
import { getErrorMessage } from "../utils/getErrorMessage";
import { ProcessReportResponse, UploadStage } from "../types/report.types";
import { ReportEndpoints } from "../constants/api";

interface UseReportGenerateResult {
  stage: UploadStage;
  progress: number;
  result: ProcessReportResponse | null;
  errorMessage: string | null;
  generateReport: (sapFile: File, banchiFile: File) => Promise<void>;
  downloadReport: () => Promise<void>;
  reset: () => void;
}

export const useReportGenerate = (endpoints: ReportEndpoints): UseReportGenerateResult => {
  const [stage, setStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessReportResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateReport = useCallback(async (sapFile: File, banchiFile: File) => {
    setStage("uploading");
    setErrorMessage(null);
    setProgress(0);

    try {
      const response = await processReportFiles(endpoints, sapFile, banchiFile, (percent) => {
        setProgress(percent);
        if (percent >= 100) setStage("processing");
      });
      setResult(response);
      setStage("done");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "ເກີດຂໍ້ຜິດພາດໃນການປະມວນຜົນ, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ"));
      setStage("error");
    }
  }, [endpoints]);

  const downloadReport = useCallback(async () => {
    if (!result) return;
    try {
      await downloadReportFile(endpoints, result.reportId, result.reportFileName);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "ດາວໂຫຼດໄຟລ໌ບໍ່ສຳເລັດ"));
    }
  }, [endpoints, result]);

  const reset = useCallback(() => {
    setStage("idle");
    setProgress(0);
    setResult(null);
    setErrorMessage(null);
  }, []);

  return { stage, progress, result, errorMessage, generateReport, downloadReport, reset };
};
