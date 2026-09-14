import { NavLink } from "react-router-dom";

const NAV_LINK_CLASS = ({ isActive }: { isActive: boolean }): string =>
  `rounded-full px-3 py-1 text-xs font-medium transition ${
    isActive ? "bg-secondary text-white" : "text-secondary hover:bg-secondary-50"
  }`;

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
      <nav className="flex items-center gap-2">
        <NavLink to="/" end className={NAV_LINK_CLASS}>
          ນ້ຳມັນໃສ
        </NavLink>
        <NavLink to="/lubricant" className={NAV_LINK_CLASS}>
          ນ້ຳມັນເຄື່ອງ
        </NavLink>
      </nav>
    </div>
  </header>
);
