import { useState } from "react";
import { useFileUpload } from "../hooks/useFileUpload";
import { useReportGenerate } from "../hooks/useReportGenerate";
import { FileUploader } from "../components/FileUploader";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Modal } from "../components/Modal";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { SapDebugTable } from "../components/SapDebugTable";
import { PreviewPage } from "./PreviewPage";
import { debugParseSapFile } from "../services/reportService";
import { getErrorMessage } from "../utils/getErrorMessage";
import { SapDebugResponse } from "../types/report.types";

export const UploadPage = () => {
  const sap = useFileUpload();
  const banchi = useFileUpload();
  const { stage, progress, result, errorMessage, generateReport, downloadReport, reset } = useReportGenerate();

  const [sapDebugResult, setSapDebugResult] = useState<SapDebugResponse | null>(null);
  const [sapDebugError, setSapDebugError] = useState<string | null>(null);
  const [isDebugLoading, setIsDebugLoading] = useState(false);

  const canSubmit = Boolean(sap.file && banchi.file) && stage !== "uploading" && stage !== "processing";

  const handleSubmit = () => {
    if (!sap.file || !banchi.file) return;
    void generateReport(sap.file, banchi.file);
  };

  const handleDebugSap = async () => {
    if (!sap.file) return;
    setIsDebugLoading(true);
    setSapDebugError(null);
    try {
      const response = await debugParseSapFile(sap.file);
      setSapDebugResult(response);
    } catch (error) {
      setSapDebugError(getErrorMessage(error, "ກວດສອບໄຟລ໌ SAP ບໍ່ສຳເລັດ"));
    } finally {
      setIsDebugLoading(false);
    }
  };

  if (stage === "done" && result) {
    return (
      <PreviewPage
        result={result}
        onDownload={downloadReport}
        onStartOver={() => {
          reset();
          sap.setFile(null);
          banchi.setFile(null);
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-secondary">ສ້າງ Report </h1>
        <p className="mt-2 text-sm text-slate-500">
          ອັບໂຫຼດໄຟລ໌ Export ຈາກ SAP B1 ແລະ ໄຟລ໌ຈາກ ບັນຊີ.la ລະບົບຈະ Match ຂໍ້ມູນຕາມເລກ Invoice ໃຫ້ອັດໂນມັດ
        </p>
      </div>

      <Card>
        <div className="grid gap-6 sm:grid-cols-2">
          <FileUploader
            label="1. ໄຟລ໌ Export ຈາກ SAP B1"
            description="ໄຟລ໌ Excel Export ລາຍການຂາຍທີ່ມີ Column Invoice Number"
            file={sap.file}
            error={sap.error}
            onFilesSelected={sap.handleFiles}
            onClear={() => sap.setFile(null)}
            accentClassName="border-secondary-200 hover:border-secondary bg-secondary-50/40"
          />
          <FileUploader
            label="2. ໄຟລ໌ ດຶງຈາກ ບັນຊີ.la"
            description="ໄຟລ໌ Excel ໃບກຳກັບພາສີ / Tax Invoice ຈາກ ບັນຊີ.la"
            file={banchi.file}
            error={banchi.error}
            onFilesSelected={banchi.handleFiles}
            onClear={() => banchi.setFile(null)}
            accentClassName="border-primary-200 hover:border-primary bg-primary-50/40"
          />
        </div>

        {(stage === "uploading" || stage === "processing") && (
          <div className="mt-6">
            <ProgressIndicator stage={stage} progress={progress} />
          </div>
        )}

        {stage === "error" && errorMessage && (
          <div className="mt-6 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-700">
            {errorMessage}
          </div>
        )}

        {sapDebugError && (
          <div className="mt-6 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-700">
            {sapDebugError}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            variant="primary"
            className="px-8"
            disabled={!canSubmit}
            isLoading={stage === "uploading" || stage === "processing"}
            onClick={handleSubmit}
          >
            {stage === "uploading" ? "ກຳລັງອັບໂຫຼດ..." : stage === "processing" ? "ກຳລັງປະມວນຜົນ..." : "Generate Report"}
          </Button>
          <Button
            variant="ghost"
            className="text-xs"
            disabled={!sap.file}
            isLoading={isDebugLoading}
            onClick={handleDebugSap}
          >
            ຂັ້ນຕອນການກວດສອບໄຟລ໌ SAP Business One 
          </Button>
        </div>
      </Card>

      <Modal
        open={sapDebugResult !== null}
        title="ຂໍ້ມູນທີ່ດຶງໄດ້ຈາກ SAP B1 (ບໍ່ໄດ້ match ກັບ ບັນຊີ.la)"
        onClose={() => setSapDebugResult(null)}
        size="xl"
      >
        {sapDebugResult && <SapDebugTable result={sapDebugResult} />}
      </Modal>
    </div>
  );
};
