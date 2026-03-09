"use client";

import Link from "next/link";
import type { Session } from "@/lib/auth/session";
import { useTheme } from "./theme-provider";
import { useLaborStandard } from "@/hooks/useLaborStandard";

// Theme toggle icons
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.95l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

interface NavbarProps {
  pageTitle: string;
  session: Session;
}

export default function Navbar({ pageTitle, session }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const laborStandard = useLaborStandard();

  return (
    <nav className="sticky top-0 z-40 flex flex-row items-center justify-between bg-gray-50 pb-4 dark:bg-navy-900" style={{ paddingTop: "32px" }}>
      {/* Left section: title */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-navy-700 dark:text-white" style={{ marginTop: "10px" }}>
          {pageTitle}
        </h1>
      </div>

      {/* Right section: unified theme toggle + profile */}
      <div className="flex items-center">
        <div className="flex h-10 items-center rounded-xl bg-white border border-gray-200 dark:bg-navy-800 dark:border-navy-700 overflow-hidden">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="flex h-full px-4 items-center justify-center rounded-l-xl hover:bg-gray-50 transition-colors cursor-pointer dark:hover:bg-navy-700 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-navy-700"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* Profile section with labor standard */}
          <Link href="/profile" className="relative group flex items-center">
            <div className="flex h-full items-center gap-2 rounded-r-xl hover:bg-gray-50 transition-colors cursor-pointer dark:hover:bg-navy-700 pl-3 pr-1.5">
              <span className="text-sm font-medium text-navy-700 dark:text-white">
                {laborStandard.toFixed(1)}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/30">
                <span className="text-sm">👤</span>
              </div>
            </div>
            <span className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-lg bg-navy-800 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-navy-600">
              Accumulated Labor Standard
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
