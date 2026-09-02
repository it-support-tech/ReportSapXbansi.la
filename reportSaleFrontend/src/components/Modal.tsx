import { ReactNode } from "react";

type ModalSize = "md" | "xl";

const SIZE_CLASSES: Record<ModalSize, string> = {
  md: "max-w-md",
  xl: "max-w-6xl",
};

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: ModalSize;
}

export const Modal = ({ open, title, children, onClose, size = "md" }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full ${SIZE_CLASSES[size]} rounded-2xl bg-white p-6 shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-secondary">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
