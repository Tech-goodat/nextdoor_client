"use client";

import React, { useState } from "react";
import SideNavBar from "../components/ClientSideNavBar";
import SmallClientSideNav from "../components/SmallClientSideNav";
import TopNavBar from "../components/TopNavBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-white via-orange-50 to-lime-50">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-60 lg:block">
        <SideNavBar />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Dark Backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}
          <div className="fixed left-0 top-0 z-50 lg:hidden">
            <SmallClientSideNav
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main Area */}
      <div className="lg:ml-60">
        {/* Top Navbar */}
        <div className="fixed top-0 right-0 left-0 z-40 lg:left-60">
          <TopNavBar
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>

        {/* Page Content */}
        <main className="h-screen w-full overflow-x-hidden overflow-y-auto pt-28 pb-0 sm:pt-32 sm:pb-8">
          <div className="mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
