interface LoaderProps {
  label?: string;
}

export const Loader = ({ label }: LoaderProps) => (
  <div className="flex flex-col items-center gap-3 py-6">
    <span className="h-8 w-8 animate-spin rounded-full border-4 border-secondary-100 border-t-secondary" aria-hidden />
    {label && <p className="text-sm text-slate-500">{label}</p>}
  </div>
);
