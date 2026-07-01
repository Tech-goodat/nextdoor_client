"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  Store,
  Package,
  Megaphone,
  TrendingUp,
  Plus,
  ChevronRight,
  Clock3,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Business {
  id: number;
  business_type: string;
  business_name: string;
  description: string;
  shop_number: string;
  opens: string;
  closes: string;
  phone_number: string;
}

interface Product {
  id: number;
  product_name: string;
  description: string;
  price: string;
  discount?: string;
  is_available: boolean;
}

interface Announcement {
  id: number;
  business_name: string;
  product_name: string;
  title: string;
  message: string;
  announcement_type: string;
  created_at: string;
}

// Single stat card. Kept generic so new stats can be dropped in later
// without touching layout — just push another object into `stats`.
const StatCard = ({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent: "lime" | "orange" | "slate";
}) => {
  const accentMap = {
    lime: "bg-lime-50 text-lime-600",
    orange: "bg-orange-50 text-orange-500",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-gray-200 bg-white px-5 py-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accentMap[accent]}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-700">{value}</p>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>
      </div>
    </div>
  );
};

const QuickAction = ({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) => (
  <Link
    href={href}
    className="flex items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-lime-400 hover:bg-lime-50 hover:text-lime-700"
  >
    <Icon size={16} />
    {label}
  </Link>
);

const BusinessDashboard = () => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Token ${token}` };

      try {
        // These three routes are the ones already proven to work in
        // your Home component. I'm not guessing new query params
        // (like a "mine=true" filter) since I can't verify they
        // exist on your backend — if you have a real endpoint that
        // scopes results to the logged-in owner, swap these for it.
        // The limited route stays for the "Your products" preview list.
        // The unlimited route feeds the stat cards so counts reflect
        // every product, not just the limited preview.
        const [businessRes, productsRes, allProductsRes, announcementsRes] =
          await Promise.all([
            fetch("https://nextdoor-server.onrender.com/business/?limit=3", {
              headers,
            }),
            fetch("https://nextdoor-server.onrender.com/product/my_products/?limit=3", {
              headers,
            }),
            fetch("https://nextdoor-server.onrender.com/product/my_products/", {
              headers,
            }),
            fetch("https://nextdoor-server.onrender.com/announcement/", {
              headers,
            }),
          ]);

        const businessData = await businessRes.json();
        const productsData = await productsRes.json();
        const allProductsData = await allProductsRes.json();
        const announcementsData = await announcementsRes.json();

        if (businessRes.ok) {
          const list = Array.isArray(businessData) ? businessData : [];
          setBusiness(list[0] ?? null);
        } else {
          console.error("Business fetch error:", businessData);
          setBusiness(null);
        }

        if (productsRes.ok) {
          setProducts(Array.isArray(productsData) ? productsData : []);
        } else {
          console.error("Product fetch error:", productsData);
          setProducts([]);
        }

        if (allProductsRes.ok) {
          setAllProducts(
            Array.isArray(allProductsData) ? allProductsData : []
          );
        } else {
          console.error("All products fetch error:", allProductsData);
          setAllProducts([]);
        }

        if (announcementsRes.ok) {
          setAnnouncements(
            Array.isArray(announcementsData) ? announcementsData : []
          );
        } else {
          console.error("Announcement fetch error:", announcementsData);
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setBusiness(null);
        setProducts([]);
        setAllProducts([]);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const availableProducts = allProducts.filter(
      (p) => p.is_available
    ).length;
    const outOfStock = allProducts.length - availableProducts;

    return {
      totalProducts: allProducts.length,
      availableProducts,
      outOfStock,
      totalAnnouncements: announcements.length,
    };
  }, [allProducts, announcements]);

  const recentProducts = products.slice(0, 4);
  const recentAnnouncements = announcements.slice(0, 3);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-4 text-gray-600 shadow-sm">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Dashboard
        </p>
        <h1 className="text-xl font-semibold text-gray-800">
          {business?.business_name ?? "Your business"}
        </h1>
      </div>

      {/* Quick actions */}
      <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
        <QuickAction
          href="/my_business/add_product"
          label="Add product"
          icon={Plus}
        />
        <QuickAction
          href="/my_business/add_announcement"
          label="New announcement"
          icon={Megaphone}
        />
        <QuickAction
          href="/my_business/edit"
          label="Edit business profile"
          icon={Store}
        />
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Products listed"
          value={stats.totalProducts}
          icon={Package}
          accent="lime"
        />
        <StatCard
          label="Available now"
          value={stats.availableProducts}
          icon={TrendingUp}
          accent="lime"
        />
        <StatCard
          label="Out of stock"
          value={stats.outOfStock}
          icon={AlertCircle}
          accent="orange"
        />
        <StatCard
          label="Announcements sent"
          value={stats.totalAnnouncements}
          icon={Megaphone}
          accent="slate"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent products */}
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              Your products
            </h3>
            <Link
              href="/my_business/all_products"
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-orange-500"
            >
              View all
              <FaArrowRightLong size={14} />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-gray-500">
                You haven&apos;t listed any products yet.
              </p>
              <Link
                href="/my_business/add_product"
                className="rounded-full bg-lime-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-lime-500"
              >
                Add your first product
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-3 transition hover:border-lime-200 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                      📦
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {product.product_name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            product.is_available
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {product.is_available ? "Available" : "Unavailable"}
                        </span>
                        <span className="text-xs font-medium text-orange-500">
                          KSh {product.price}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent announcements */}
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              Recent announcements
            </h3>
            <Link
              href="/my_business/notifications"
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-orange-500"
            >
              View all
              <FaArrowRightLong size={14} />
            </Link>
          </div>

          {recentAnnouncements.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-gray-500">
                Nothing posted yet. Let your neighbors know what&apos;s new.
              </p>
              <Link
                href="/my_business/add_announcement"
                className="rounded-full bg-lime-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-lime-500"
              >
                Post an announcement
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-orange-200 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-gray-700">
                      {announcement.title}
                    </h4>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                      <Clock3 size={12} />
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {announcement.message}
                  </p>
                  {announcement.product_name && (
                    <span className="mt-3 inline-block rounded-full bg-lime-100 px-3 py-1 text-xs font-medium text-lime-700">
                      {announcement.product_name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
