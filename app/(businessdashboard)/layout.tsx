"use client";

import React, { useState } from "react";
import TopNavBar from "../components/TopNavBar";
import BusinessSideNavBar from "../components/BusinessSideNavBar";
import SmallBusinessSideNav from "../components/SmallBusinessSideNav";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-linear-to-br from-gray-100 to-white">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-60 lg:block">
        <BusinessSideNavBar />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed left-0 top-0 z-50 lg:hidden">
            <SmallBusinessSideNav
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main Area */}
      <div className="lg:ml-60">
        {/* Top Navbar */}
        <div className="fixed left-0 right-0 top-0 z-40 lg:left-60">
          <TopNavBar
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>

        {/* Content */}
        <main className="h-screen w-full overflow-x-hidden overflow-y-auto pb-0 pt-28 text-gray-700 sm:pt-32 sm:pb-8">
          <div className="flex w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
