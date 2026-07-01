'use client'
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Home,
  ShoppingBag,
  Bell,
  ShoppingCart,
  User,
} from "lucide-react";
import { data } from "framer-motion/client";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  house_number:string
  email: string;
}
interface Announcement {
  id: number;
  title: string;
  message: string;
  announcement_type: string;
  business_name: string;
  product_name: string | null;
  created_at: string;
}


const SideNavBar = () => {
  const [user, setUser] = useState<User | null>(null);
   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
      const [loading, setLoading] = useState(true);

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
      console.log('user.............................', data)
    } catch (error) {
      console.error(error);
    }
  };

  fetchUser();
}, []);
  useEffect(() => {
      const fetchAnnouncements = async () => {
        try {
          const token = localStorage.getItem("token");
  
          const response = await fetch(
            "https://nextdoor-server.onrender.com/announcement/",
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
  
          if (!response.ok) {
            throw new Error("Failed to fetch announcements");
          }
  
          const data = await response.json();
          setAnnouncements(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAnnouncements();
    }, []);

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-white/50 bg-white/80 backdrop-blur-md shadow-lg">
      {/* Logo */}
      <div className="border-b border-gray-100 px-6 py-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Next
          <span className="text-orange-500">Door</span>
          <span className="text-lime-600">.</span>
        </h1>

        <p className="mt-2 text-sm font-medium text-gray-500">
          Tsavo Estate
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6">
        <div>
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Resident
          </p>

          <div className="space-y-1">
            <Link
              href="/client/home"
              className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-600 transition-all duration-200"
            >
              <Home size={18} />
              Home
            </Link>

            <Link
              href="/client/orders"
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} />
                My Orders
              </div>

              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-sm font-semibold text-orange-600">
                4
              </span>
            </Link>

            <Link
              href="/client/notifications"
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600"
            >
              <div className="flex items-center gap-3">
                <Bell size={18} />
                Notifications
              </div>

              <span className="rounded-full bg-lime-100  px-2 py-0.5 text-sm font-semibold text-lime-700">
                {announcements.length}
              </span>
            </Link>

            <Link
              href="/client/cart"
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} />
                Cart
              </div>

              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-sm font-semibold text-orange-600">
                3
              </span>
            </Link>

            <Link
              href="/client/profile"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600"
            >
              <User size={18} />
              Profile
            </Link>

            <Link
              href="/client/convert"
              className="flex w-full items-center gap-3 rounded-xl bg-orange-500 p-3 text-sm font-medium text-white transition-all duration-200 hover:bg-orange-600"
            >
              <User size={18} />
              Become a Seller
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-100"></div>
      </div>

      {/* User Card */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-50 to-lime-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-lg font-semibold text-white">
            {user?.first_name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-gray-800">
              {user?.first_name}
            </p>

            <p className="text-xs text-gray-500">
              {user?.house_number}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideNavBar;