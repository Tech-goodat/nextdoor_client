import React from "react";
import TopNavBar from "../components/TopNavBar";
import BusinessSideNavBar from "../components/BusinessSideNavBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-white">

      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-60 lg:block">
        <BusinessSideNavBar/>
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