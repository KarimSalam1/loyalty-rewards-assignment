import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname === "/") return "Accounts";
    if (location.pathname.startsWith("/transactions")) return "Transactions";
    if (location.pathname.startsWith("/tiers")) return "Tiers";
    return "Accounts";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/80 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-lg font-semibold tracking-tight">
            Loyalty<span className="text-emerald-400">Rewards</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm">
          {[
            { to: "/", label: "Accounts", icon: "👤" },
            { to: "/transactions", label: "Transactions", icon: "🔁" },
            { to: "/tiers", label: "Tiers", icon: "🏆" },
            { to: "/batch", label: "Batch", icon: "⚙️" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `
        flex items-center gap-3 px-3 py-2 rounded-md transition mb-2
        ${
          isActive
            ? "bg-slate-800 text-white border-l-4 border-emerald-400"
            : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
        }
        `
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
          Karim Salam's Technical Assessment
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 bg-slate-900/70 flex items-center justify-end px-6 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl font-semibold">{getTitle()}</h1>
          </div>

          <div className="flex items-center gap-3 right-0">
            <span className="hidden sm:inline text-xs text-slate-400">
              Admin
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/80 flex items-center justify-center text-xs font-bold">
              KS
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 bg-slate-950 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
