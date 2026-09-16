import { ComponentType } from "react";
import { NavLink } from "react-router-dom";
import { Droplets, Fuel, Receipt, LucideProps } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
  icon: ComponentType<LucideProps>;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "ນ້ຳມັນໃສ", end: true, icon: Fuel },
  { to: "/lubricant", label: "ນ້ຳມັນເຄື່ອງ", icon: Droplets },
  { to: "/summary-invoice", label: "Summary Invoice", icon: Receipt },
];

const NAV_LINK_CLASS = ({ isActive }: { isActive: boolean }): string =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive ? "bg-secondary text-white shadow-sm" : "text-slate-600 hover:bg-secondary-50 hover:text-secondary"
  }`;

export const Sidebar = () => (
  <aside className="flex w-16 shrink-0 flex-col border-r border-slate-200 bg-white sm:w-60">
    <nav className="flex-1 space-y-1 px-2 py-6 sm:px-3">
      <p className="hidden px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:block">
        Reports
      </p>
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={NAV_LINK_CLASS} title={item.label}>
          <item.icon size={20} strokeWidth={1.8} className="shrink-0" />
          <span className="hidden truncate sm:inline">{item.label}</span>
        </NavLink>
      ))}
    </nav>
    <div className="hidden border-t border-slate-100 px-6 py-4 text-xs text-slate-400 sm:block">
      © {new Date().getFullYear()} NTP Trading Petroleum
    </div>
  </aside>
);
