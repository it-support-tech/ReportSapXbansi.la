import { useRef, useState } from "react";

interface FileUploaderProps {
  label: string;
  description: string;
  file: File | null;
  error: string | null;
  onFilesSelected: (files: FileList | null) => void;
  onClear: () => void;
  accentClassName?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const FileUploader = ({
  label,
  description,
  file,
  error,
  onFilesSelected,
  onClear,
  accentClassName = "border-secondary-200 hover:border-secondary bg-secondary-50/40",
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
      <p className="mb-3 text-xs text-slate-500">{description}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          onFilesSelected(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed
          px-4 py-6 text-center transition-colors duration-150
          ${isDragging ? "border-primary bg-primary-50" : accentClassName}
          ${error ? "border-primary-300 bg-primary-50/40" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => onFilesSelected(e.target.files)}
        />

        {file ? (
          <div className="flex w-full max-w-full flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-white">📄</div>
            <p className="max-w-full truncate text-sm font-medium text-slate-800">{file.name}</p>
            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="mt-1 text-xs font-medium text-primary hover:underline"
            >
              ລຶບ / ເລືອກໄຟລ໌ໃໝ່
            </button>
          </div>
        ) : (
          <>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
              ⬆
            </div>
            <p className="text-sm font-medium text-slate-700">ລາກ ແລະ ວາງໄຟລ໌ ຫຼື ກົດເພື່ອເລືອກ</p>
            <p className="mt-1 text-xs text-slate-400">ຮອງຮັບ .xlsx, .xls</p>
          </>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs font-medium text-primary">{error}</p>}
    </div>
  );
};
