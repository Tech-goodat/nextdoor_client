"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Store, ChevronRight, ClipboardList } from "lucide-react";

interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: string;
}

interface OrderBusinessGroup {
  business_id: number;
  business_name: string;
  status: string;
  subtotal: string;
  items: OrderItem[];
}

interface Order {
  id: number;
  created_at: string;
  total_price: string;
  total_items: number;
  businesses: OrderBusinessGroup[];
}

const BASE_URL = "https://nextdoor-server.onrender.com";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-600",
  processing: "bg-blue-50 text-blue-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Token ${localStorage.getItem("token")}`,
  });

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/orders/`, {
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders.");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center bg-slate-50">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
          <div className="flex flex-col items-center">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-orange-400 border-r-orange-400"></div>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-700">
              Loading Orders...
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              Please wait while we fetch your orders.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen w-full flex justify-center bg-slate-50 p-4 sm:p-6">
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-gray-300 bg-white p-8 sm:p-12 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-50">
              <ClipboardList size={48} className="text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">
              You haven't placed any orders yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Once you check out, your orders will show up here so you can
              track them.
            </p>
            <Link
              href="/my_business/all_products"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600"
            >
              Browse Products
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-orange-100 p-3">
            <ClipboardList className="text-orange-500" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">MY ORDERS</h2>
            <p className="text-sm text-slate-500">
              Track and review your past orders.
            </p>
          </div>
        </div>

        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-3xl border border-gray-300 bg-white p-6"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-4">
              <div>
                <p className="text-sm text-slate-500">
                  Order #{order.id} &middot;{" "}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-500">
                  {order.total_items} item{order.total_items !== 1 && "s"}
                </p>
              </div>
              <p className="font-semibold text-orange-500">
                KSh {order.total_price}
              </p>
            </div>

            <div className="space-y-5">
              {order.businesses.map((group) => (
                <div key={group.business_id}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Store size={15} />
                      {group.business_name}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        statusStyles[group.status] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {group.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl border border-gray-200 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl sm:flex">
                            <Package size={20} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">
                              {item.product_name}
                            </p>
                            <p className="text-sm text-slate-500">
                              Qty {item.quantity} &middot; KSh {item.price}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-slate-700">
                          KSh {item.subtotal}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex justify-end text-sm text-slate-500">
                    Subtotal:{" "}
                    <span className="ml-1 font-medium text-slate-700">
                      KSh {group.subtotal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}