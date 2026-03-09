import { Link } from "react-router-dom";
import { useTheme } from "../theme";
import { useLaborStandard } from "../../hooks/useLaborStandard";

interface NavbarProps {
    onOpenSidenav?: () => void;
    pageTitle: string;
};

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

const Navbar: React.FC<NavbarProps> = ({ onOpenSidenav, pageTitle }) => {
  const { theme, toggleTheme } = useTheme();
  const laborStandard = useLaborStandard();

  return (
    <nav className="sticky top-0 z-40 flex flex-row items-center justify-between bg-gray-50 pt-12 pb-4 dark:bg-navy-900">
      {/* Mobile menu button */}
      <button
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors dark:bg-navy-800 dark:text-white dark:border-navy-700 dark:hover:bg-navy-700 xl:hidden"
        onClick={onOpenSidenav}
      >
        <span className="text-xl">☰</span>
      </button>

      {/* Page Title */}
      <h1 className="text-xl font-bold text-navy-700 dark:text-white hidden xl:block">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer dark:bg-navy-800 dark:border-navy-700 dark:hover:bg-navy-700 text-gray-600 dark:text-gray-400"
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* Labor standard + Profile icon */}
        <Link to="/admin/profile" className="relative group">
          <div className="flex h-10 items-center gap-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer dark:bg-navy-800 dark:border-navy-700 dark:hover:bg-navy-700 pl-3 pr-1.5">
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
    </nav>
  );
};

export default Navbar;
