import React from "react";
import SideNavBar from "../components/ClientSideNavBar";
import TopNavBar from "../components/TopNavBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-white via-orange-50 to-lime-50">

      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-60 lg:block">
        <SideNavBar />
      </aside>

      {/* Main Area */}
      <div className="lg:ml-60">

        {/* Fixed Top Navbar */}
        <div className="fixed top-0 right-0 left-0 z-40 lg:left-60">
          <TopNavBar />
        </div>

        {/* Scrollable Content */}
        <main className="h-screen overflow-y-auto pt-32 px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;