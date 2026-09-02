export const Navbar = () => (
  <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-white">
          SR
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-secondary">saleReport</p>
          <p className="text-xs leading-tight text-slate-500">Automated Excel Report Generator</p>
        </div>
      </div>
      <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">
        SAP B1 × ບັນຊີ.la
      </span>
    </div>
  </header>
);
