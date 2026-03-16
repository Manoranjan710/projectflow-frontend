"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const isActive = (href) => pathname === href;

  return (
    <aside className="w-72 bg-slate-950 text-slate-100">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10 ring-1 ring-white/10" />
          <div>
            <div className="text-lg font-semibold leading-tight">
              ProjectFlow
            </div>
            <div className="text-xs text-slate-300">Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="px-3">
        <button
          type="button"
          className={
            isActive("/dashboard")
              ? "w-full rounded-lg bg-white/10 px-3 py-2 text-left text-sm font-medium text-white ring-1 ring-white/10"
              : "w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/5 hover:text-white"
          }
          onClick={() => router.push("/dashboard")}
        >
          Projects
        </button>
      </nav>

      <div className="mt-6 px-3">
        <div className="h-px bg-white/10" />
        <button
          type="button"
          className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/5 hover:text-white"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
