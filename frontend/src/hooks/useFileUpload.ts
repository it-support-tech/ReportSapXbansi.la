import { useCallback, useState } from "react";

const ALLOWED_EXTENSIONS = [".xlsx", ".xls"];

const isValidExcelFile = (file: File): boolean =>
  ALLOWED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

interface UseFileUploadResult {
  file: File | null;
  error: string | null;
  setFile: (file: File | null) => void;
  handleFiles: (fileList: FileList | null) => void;
}

/** Holds a single selected/dropped file for one FileUploader slot, validating its extension. */
export const useFileUpload = (): UseFileUploadResult => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((fileList: FileList | null) => {
    const picked = fileList?.[0] ?? null;
    if (!picked) return;

    if (!isValidExcelFile(picked)) {
      setError("ຮອງຮັບສະເພາະໄຟລ໌ .xlsx ຫຼື .xls ເທົ່ານັ້ນ");
      setFile(null);
      return;
    }

    setError(null);
    setFile(picked);
  }, []);

  return { file, error, setFile, handleFiles };
};
