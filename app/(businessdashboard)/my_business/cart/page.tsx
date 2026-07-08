"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowRight,
  Store,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

interface CartItem {
  id: number;
  product: number;
  product_name: string;
  business_name: string;
  price: string;
  quantity: number;
}

interface Cart {
  id: number;
  items: CartItem[];
  subtotal: string;
  total_items: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://nextdoor-server.onrender.com/cart/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cart.");
      }

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
          <div className="flex flex-col items-center">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-orange-400 border-r-orange-400"></div>
            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-700">
              Loading Cart...
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Please wait while we fetch your cart.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen w-full bg-slate-50 p-4 sm:p-6">
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-gray-300 bg-white p-8 sm:p-12 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-50">
              <ShoppingCart size={48} className="text-orange-500" />
            </div>

            <h2 className="text-3xl font-bold text-slate-900">
              Your cart is currently empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Looks like you haven't added any products yet. Browse businesses
              around your estate and discover amazing products waiting for you.
            </p>

            <Link
              href="/my_business/all_products"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600"
            >
              Explore Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart */}
        <div className="lg:col-span-2 rounded-3xl border border-gray-300 bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-3">
              <ShoppingCart className="text-orange-500" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                <span className="text-lg text-orange-500">
                  {cart.total_items}
                </span>{" "}
                ITEMS IN CART
              </h2>

              <p className="text-sm text-slate-500">
                Review your selected products.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-gray-300 p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl sm:flex">
                      📦
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        {item.product_name}
                      </h3>

                      <div className="mt-2 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm text-slate-500">
                          <Store size={15} />
                          {item.business_name}
                        </span>
                      </div>

                      <p className="mt-3 font-semibold text-orange-500">
                        KSh {item.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-4 sm:items-end">
                    <div className="flex items-center gap-3">
                      <button className="rounded-xl border border-gray-300 p-2 hover:bg-slate-100">
                        <Minus size={16} />
                      </button>

                      <span className="font-semibold">
                        {item.quantity}
                      </span>

                      <button className="rounded-xl border border-gray-300 p-2 hover:bg-slate-100">
                        <Plus size={16} />
                      </button>
                    </div>

                    <p className="font-semibold text-slate-700">
                      KSh {Number(item.price) * item.quantity}
                    </p>

                    <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600">
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="sticky top-6 rounded-3xl border border-gray-300 bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold text-slate-800">
              Order Summary
            </h2>

            <div className="mb-4 flex justify-between">
              <span className="text-slate-500">Items</span>
              <span>{cart.total_items}</span>
            </div>

            <div className="mb-6 flex justify-between">
              <span className="text-slate-500">Subtotal</span>

              <span className="font-semibold text-orange-500">
                KSh {cart.subtotal}
              </span>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-medium text-white transition hover:bg-orange-600">
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}