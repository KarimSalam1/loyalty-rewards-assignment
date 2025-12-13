import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Loading from "../components/Loading/Loading";

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getTitle = () => {
    if (location.pathname === "/") return "Accounts";
    if (location.pathname.startsWith("/transactions")) return "Transactions";
    if (location.pathname.startsWith("/tiers")) return "Tiers";
    return "Dashboard";
  };

  const navItems = [
    { to: "/", label: "Dashboard", icon: "📊" },
    { to: "/accounts", label: "Accounts", icon: "👤" },
    { to: "/transactions", label: "Transactions", icon: "🔁" },
    { to: "/tiers", label: "Tiers", icon: "🏆" },
    { to: "/batch", label: "Batch", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/80 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-lg font-semibold tracking-tight">
            Loyalty<span className="text-emerald-400">Rewards</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm">
          {navItems.map((item) => (
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

      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity md:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      ></div>

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50
          transform transition-transform md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <span className="text-lg font-semibold tracking-tight">
            Loyalty<span className="text-emerald-400">Rewards</span>
          </span>

          <button
            className="text-slate-200 text-2xl"
            onClick={() => setMobileOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <nav className="p-4 space-y-1 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
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
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 bg-slate-900/70 flex items-center justify-end px-6 relative">
          <button
            className="md:hidden text-slate-200 text-2xl absolute left-4"
            onClick={() => setMobileOpen(true)}
          >
            <FiMenu />
          </button>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl font-semibold">{getTitle()}</h1>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 bg-slate-950 overflow-y-auto">
          {children}
        </main>

        <Loading />
      </div>
    </div>
  );
}
