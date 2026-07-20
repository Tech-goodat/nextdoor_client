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
  subtotal: string;
}

interface BusinessGroup {
  business_id: number;
  business_name: string;
  subtotal: string;
  items: CartItem[];
}

interface Cart {
  id: number;
  user: number;
  businesses: BusinessGroup[];
  total_price: string;
  total_items: number;
}

const BASE_URL = "https://nextdoor-server.onrender.com";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Token ${localStorage.getItem("token")}`,
  });

  const fetchCart = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart/`, {
        headers: authHeaders(),
      });

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

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setUpdatingId(productId);
    try {
      const response = await fetch(`${BASE_URL}/cart/update_quantity/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ product: productId, quantity }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed.");

      setCart(data.cart);
    } catch (error) {
      console.error(error);
      alert("Could not update quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (productId: number) => {
    setUpdatingId(productId);
    try {
      const response = await fetch(`${BASE_URL}/cart/remove_item/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ product: productId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Remove failed.");

      setCart(data.cart);
    } catch (error) {
      console.error(error);
      alert("Could not remove item.");
    } finally {
      setUpdatingId(null);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart/clear_cart/`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Clear failed.");

      setCart(data.cart);
      
    } catch (error) {
      console.error(error);
      alert("Could not clear cart.");
    }
  };

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

  if (!cart || cart.total_items === 0) {
    return (
      <div className="min-h-screen w-full flex justify-center bg-slate-50 p-4 sm:p-6">
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
    <div className="min-h-screen  items-center justify-center w-full p-4 sm:p-6">
      <div className="flex w-full items-center gap-6">
        {/* Cart */}
        <div className="flex w-full flex-col rounded-3xl border border-gray-300 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-100 p-3">
                <ShoppingCart className="text-orange-500" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">
                  <span className="text-sm text-orange-500">
                    {cart.total_items}
                  </span>{" "}
                  ITEMS IN CART
                </h2>
                <p className="text-sm text-slate-500">
                  Review your selected products.
                </p>
              </div>
            </div>

            <button
              onClick={clearCart}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Clear Cart
            </button>
          </div>

          {/* Grouped by business */}
          <div className="space-y-6">
            {cart.businesses.map((group) => (
              <div key={group.business_id}>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Store size={15} />
                  {group.business_name}
                </div>

                <div className="space-y-4">
                  {group.items.map((item) => (
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
                            <p className="mt-3 font-semibold text-orange-500">
                              KSh {item.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-4 sm:items-end">
                          <div className="flex items-center gap-3">
                            <button
                              disabled={updatingId === item.product}
                              onClick={() =>
                                updateQuantity(item.product, item.quantity - 1)
                              }
                              className="rounded-xl border border-gray-300 p-2 hover:bg-slate-100 disabled:opacity-50"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="font-semibold">{item.quantity}</span>

                            <button
                              disabled={updatingId === item.product}
                              onClick={() =>
                                updateQuantity(item.product, item.quantity + 1)
                              }
                              className="rounded-xl border border-gray-300 p-2 hover:bg-slate-100 disabled:opacity-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <p className="font-semibold text-slate-700">
                            KSh {item.subtotal}
                          </p>

                          <button
                            disabled={updatingId === item.product}
                            onClick={() => removeItem(item.product)}
                            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex justify-end text-sm text-slate-500">
                  Business subtotal:{" "}
                  <span className="ml-1 font-medium text-slate-700">
                    KSh {group.subtotal}
                  </span>
                </div>
                <div className="mt-2 flex justify-end text-sm text-slate-500">
                  <Link href='/my_business/checkout' className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-medium text-white transition hover:bg-orange-600">
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary 
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
              <span className="text-slate-500">Total</span>
              <span className="font-semibold text-orange-500">
                KSh {cart.total_price}
              </span>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-medium text-white transition hover:bg-orange-600">
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}