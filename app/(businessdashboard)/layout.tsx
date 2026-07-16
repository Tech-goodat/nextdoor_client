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
    <div className="h-screen overflow-hidden w-full flex ">
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
      <div className="items-center justify-center  min-h-screen flex flex-col lg:ml-20 w-full">
        {/* Top Navbar */}
        <div className="left-0 right-0 top-0 z-40 ">
          <TopNavBar
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>

        {/* Content */}
        <main className="h-screen w-full flex overflow-y-auto pb-8 pt-1 text-gray-700 sm:px-6 lg:px">
          <div className="w-full  flex">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;