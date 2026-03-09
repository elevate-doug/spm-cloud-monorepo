import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/main-logo.png";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

type TabType = "Processes" | "Management";

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("Processes");

  const processesRoutes = [
    { name: "Assemble", path: "/admin/assembly", icon: "📦" },
  ];

  const managementRoutes: typeof processesRoutes = [];

  const routes = activeTab === "Processes" ? processesRoutes : managementRoutes;

  return (
    <div
      className={`sm:none duration-175 fixed !z-50 flex min-h-full w-[280px] flex-col bg-white pb-10 shadow-sm border-r border-gray-200 transition-all dark:!bg-navy-900 dark:text-white dark:border-navy-700 md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-6 right-4 block cursor-pointer text-gray-400 hover:text-gray-600 xl:hidden"
        onClick={onClose}
      >
        ✕
      </span>

      {/* Logo Container - aligned with main content area */}
      <div className="mx-4 mt-12 mb-8 flex items-center justify-center">
        <img 
          src={logo} 
          alt="SPM" 
          className="h-auto w-full max-w-[200px]"
        />
      </div>
      <div className="mb-6 h-px bg-gray-200 dark:bg-white/10 mx-4" />

      {/* Tab Navigation */}
      <div className="mx-6 mb-4 flex gap-1 rounded-lg bg-gray-100 dark:bg-navy-800 p-1">
        <button
          onClick={() => setActiveTab("Processes")}
          className={`flex-1 rounded-md px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === "Processes"
              ? "bg-white text-brand-600 shadow-sm dark:bg-navy-700 dark:text-brand-400"
              : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Processes
        </button>
        <button
          onClick={() => setActiveTab("Management")}
          className={`flex-1 rounded-md px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === "Management"
              ? "bg-white text-brand-600 shadow-sm dark:bg-navy-700 dark:text-brand-400"
              : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Management
        </button>
      </div>

      <ul className="mb-auto pt-1">
        {routes.length > 0 ? (
          routes.map((route, index) => {
            const isActive = location.pathname === route.path;
            return (
              <li key={index}>
                <Link to={route.path}>
                  <div className="relative mb-3 flex hover:cursor-pointer group">
                    <div
                      className={`my-[3px] flex cursor-pointer items-center px-6 py-3 w-full rounded-lg mx-3 transition-all ${
                        isActive
                          ? "bg-gray-100 dark:bg-brand-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-navy-800"
                      }`}
                    >
                      <span
                        className={`flex items-center text-sm ${
                          isActive
                            ? "font-semibold text-brand-600 dark:text-brand-400"
                            : "font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200"
                        }`}
                      >
                        <span className="mr-3 text-lg">{route.icon}</span>
                        {route.name}
                      </span>
                    </div>
                    {isActive && (
                      <div className="absolute left-0 top-[50%] translate-y-[-50%] h-8 w-1 rounded-r-lg bg-brand-600 dark:bg-brand-400" />
                    )}
                  </div>
                </Link>
              </li>
            );
          })
        ) : (
          <li className="px-6 py-8 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              No items available
            </p>
          </li>
        )}
      </ul>

      <div className="flex justify-center px-6">
        <div className="mt-7 mb-6 h-px w-full bg-gray-200 dark:bg-white/10" />
      </div>
    </div>
  );
};

export default Sidebar;
