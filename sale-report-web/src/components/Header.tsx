import logoUrl from "../assets/logo (1).png";

export const Header = () => (
  <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div className="flex items-center gap-3 px-6 py-3">
      <img src={logoUrl} alt="NTP Trading Petroleum" className="h-10 w-10 shrink-0 rounded-lg object-contain" />
        <p className="text-sm font-semibold leading-tight text-secondary">Report Generator</p>
    </div>
  </header>
);
