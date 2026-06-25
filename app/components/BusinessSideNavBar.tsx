import Link from "next/link";
import React from "react";
import {
  Home,
  ShoppingBag,
  Bell,
  ShoppingCart,
  User,
  Store,
  LayoutDashboard,
  Package,
  ClipboardList,
  CreditCard,
} from "lucide-react";

const BusinessSideNavBar = () => {
  return (
    <aside className="flex h-screen w-50 flex-col border-r border-white/50 bg-white/80 backdrop-blur-md shadow-lg">
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
        {/* Resident */}
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

              <span className="rounded-full bg-lime-100 px-2 py-0.5 text-sm font-semibold text-lime-700">
                2
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
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-100"></div>

        {/* Business */}
        <div>
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            My Business
          </p>

          <div className="space-y-1">
            <Link
              href="/business/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-lime-50 hover:text-lime-700"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              href="/business/products"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-lime-50 hover:text-lime-700"
            >
              <Package size={18} />
              Products
            </Link>

            <Link
              href="/business/orders"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-lime-50 hover:text-lime-700"
            >
              <ClipboardList size={18} />
              Orders
            </Link>

            <Link
              href="/my_business/profile"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-lime-50 hover:text-lime-700"
            >
              <Store size={18} />
              Business Profile
            </Link>

            <Link
              href="/business/billing"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-lime-50 hover:text-lime-700"
            >
              <CreditCard size={18} />
              Billing & Plans
            </Link>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-50 to-lime-50 p-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
            JK
          </div>

          <div>
            <p className="font-semibold text-gray-800">
              James Kamau
            </p>

            <p className="text-xs text-gray-500">
              House 14B, Block C
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BusinessSideNavBar;