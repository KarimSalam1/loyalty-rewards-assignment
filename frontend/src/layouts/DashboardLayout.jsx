import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname === "/") return "Accounts";
    if (location.pathname.startsWith("/transactions")) return "Transactions";
    if (location.pathname.startsWith("/tiers")) return "Tiers";
    if (location.pathname.startsWith("/dashboard")) return "Dashboard";
    return "Dashboard";
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
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `w-full block px-3 py-2 rounded-md ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/70"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-full block px-3 py-2 rounded-md ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/70"
              }`
            }
          >
            Accounts
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `w-full block px-3 py-2 rounded-md ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/70"
              }`
            }
          >
            Transactions
          </NavLink>

          <NavLink
            to="/tiers"
            className={({ isActive }) =>
              `w-full block px-3 py-2 rounded-md ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/70"
              }`
            }
          >
            Tiers
          </NavLink>

          <NavLink
            to="/batch"
            className={({ isActive }) =>
              `w-full block px-3 py-2 rounded-md ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/70"
              }`
            }
          >
            Batch
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
          Technical Assignment • v1.0
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 bg-slate-900/70 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">{getTitle()}</h1>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-400">
              Admin
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/80 flex items-center justify-center text-xs font-bold">
              LR
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
