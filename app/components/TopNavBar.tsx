"use client";

import React, { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  business_name: string;
  email: string;
}

interface TopNavBarProps {
  onMenuClick?: () => void;
}

const TopNavBar = ({ onMenuClick }: TopNavBarProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "https://nextdoor-server.onrender.com/user/me/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data: User = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden"
          >
            <Menu size={24} />
          </button>

          <h1 className="text-lg font-bold text-gray-800 sm:text-2xl">
            What's Good{" "}
            <span className="text-2xl text-orange-400">
              {user?.first_name}
            </span>
            <span className="ml-1 text-4xl font-bold text-lime-600">
              ...
            </span>
          </h1>
        </div>

        {/* Profile Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => {
            if (window.innerWidth >= 1024) setOpen(true);
          }}
          onMouseLeave={() => {
            if (window.innerWidth >= 1024) setOpen(false);
          }}
        >
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-gray-400 text-xl font-semibold text-white shadow-md transition-all duration-300 hover:scale-105"
          >
            {user?.first_name?.charAt(0).toUpperCase()}
          </button>

          {open && (
            <>
              {/* Mobile Backdrop */}
              <div
                className="fixed inset-0 z-40 lg:hidden"
                onClick={() => setOpen(false)}
              />

              {/* Dropdown */}
              <div className="absolute right-0 top-12 z-50 min-w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                <div className="bg-gradient-to-r from-orange-50 to-lime-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 font-semibold text-white">
                      {user?.first_name?.charAt(0).toUpperCase()}
                      {user?.last_name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        {user?.first_name} {user?.last_name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-4 sm:px-6">
        <div className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 transition-all duration-300 focus-within:border-orange-400 focus-within:shadow-md">
          <Search
            size={18}
            className="text-gray-400 transition-colors group-focus-within:text-orange-500"
          />

          <input
            type="text"
            placeholder="Search businesses, products..."
            className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>
    </header>
  );
};
export default TopNavBar;