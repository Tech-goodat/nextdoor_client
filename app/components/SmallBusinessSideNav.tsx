"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Home,
  ShoppingBag,
  Bell,
  ShoppingCart,
  Store,
  LayoutDashboard,
  Package,
  ClipboardList,
  CreditCard,
  X,
} from "lucide-react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  house_number: string;
  email: string;
}

interface SmallBusinessSideNavProps {
  onClose: () => void;
}

const SmallBusinessSideNav = ({
  onClose,
}: SmallBusinessSideNavProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "https://nextdoor-server.onrender.com/users/client/me/",
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

  return (
    <aside className="flex h-screen w-72 flex-col bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Next
            <span className="text-orange-500">Door</span>
            <span className="text-lime-600">.</span>
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Tsavo Estate
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 transition hover:bg-gray-100"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
          Resident
        </p>

        <div className="space-y-1">
          <Link
            href="/my_business/home"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-600"
          >
            <Home size={18} />
            Home
          </Link>

          <Link
            href="/my_business/my_orders"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <ShoppingBag size={18} />
            My Orders
          </Link>

          <Link
            href="/my_business/notifications"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <Bell size={18} />
            Notifications
          </Link>

          <Link
            href="/my_business/cart"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <ShoppingCart size={18} />
            Cart
          </Link>
        </div>

        <div className="my-6 border-t border-gray-100"></div>

        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
          My Business
        </p>

        <div className="space-y-1">
          <Link
            href="/my_business/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-lime-50 hover:text-lime-700"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/my_business/products"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-lime-50 hover:text-lime-700"
          >
            <Package size={18} />
            Products
          </Link>

          <Link
            href="/my_business/orders"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-lime-50 hover:text-lime-700"
          >
            <ClipboardList size={18} />
            Orders
          </Link>

          <Link
            href="/my_business/profile"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-lime-50 hover:text-lime-700"
          >
            <Store size={18} />
            Business Profile
          </Link>

          <Link
            href="/my_business/billing"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-lime-50 hover:text-lime-700"
          >
            <CreditCard size={18} />
            Billing & Plans
          </Link>
        </div>
      </div>

      {/* User */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-50 to-lime-50 p-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
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

export default SmallBusinessSideNav;