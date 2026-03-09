"use client";

import Sidebar from "./sidebar";
import Navbar from "./navbar";
import type { Session } from "@/lib/auth/session";

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  session: Session;
}

export default function AdminLayout({ children, pageTitle, session }: AdminLayoutProps) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      {/* Main Content */}
      <main
        className="mx-3 flex-1 min-h-0 h-full overflow-y-auto bg-gray-50 dark:!bg-navy-900 md:pr-2"
        style={{ marginLeft: "280px" }}
      >
        <Navbar
          pageTitle={pageTitle}
          session={session}
        />

        <div className="p-2 md:pr-2" style={{ marginTop: "24px" }}>
          {children}
        </div>

        {/* Footer */}
        <div className="p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>© {new Date().getFullYear()} SPM</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </main>
    </div>
  );
}
