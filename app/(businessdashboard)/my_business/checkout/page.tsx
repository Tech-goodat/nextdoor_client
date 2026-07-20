"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Store,
  Smartphone,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

interface CartItem {
  id: number;
  product: number;
  product_name: string;
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
  businesses: BusinessGroup[];
  total_price: string;
  total_items: number;
}

type PaymentState =
  | "idle"
  | "prompting"
  | "waiting"
  | "success"
  | "failed";

const BASE_URL = "https://nextdoor-server.onrender.com";

export default function CheckoutPage() {
  const router = useRouter();
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [cart, setCart] = useState<Cart | null>(null);
  const [group, setGroup] = useState<BusinessGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Token ${localStorage.getItem("token")}`,
  });

  const fetchCart = async (id: string | null) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/`, {
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch cart.");
      const data: Cart = await response.json();
      setCart(data);

      const matched = data.businesses.find(
        (b) => String(b.business_id) === id
      );
      setGroup(matched ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("business_id");
    setBusinessId(id);
    fetchCart(id);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const normalizePhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.startsWith("0")) return `254${digits.slice(1)}`;
    if (digits.startsWith("254")) return digits;
    if (digits.startsWith("7") || digits.startsWith("1")) return `254${digits}`;
    return digits;
  };

  const pollPaymentStatus = (checkoutRequestId: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/checkout/mpesa/status/?checkout_request_id=${checkoutRequestId}`,
          { headers: authHeaders() }
        );
        const data = await response.json();

        if (data.status === "success") {
          clearInterval(pollRef.current!);
          setPaymentState("success");
          setTimeout(() => router.push("/my_orders"), 1800);
        } else if (data.status === "failed" || data.status === "cancelled") {
          clearInterval(pollRef.current!);
          setPaymentState("failed");
          setErrorMsg(data.message || "Payment was not completed.");
        }
        // else keep polling while status === "pending"
      } catch (error) {
        console.error(error);
      }
    }, 3000);
  };

  const initiatePayment = async () => {
    if (!group) return;
    const normalized = normalizePhone(phone);

    if (normalized.length !== 12) {
      setErrorMsg("Enter a valid M-Pesa number, e.g. 0712345678.");
      return;
    }

    setErrorMsg("");
    setPaymentState("prompting");

    try {
      const response = await fetch(`${BASE_URL}/checkout/mpesa/initiate/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          phone: normalized,
          business_id: group.business_id,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not start M-Pesa payment.");
      }

      setPaymentState("waiting");
      pollPaymentStatus(data.checkout_request_id);
    } catch (error) {
      console.error(error);
      setPaymentState("failed");
      setErrorMsg(
        error instanceof Error ? error.message : "Something went wrong."
      );
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
              Loading Checkout...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (!businessId || !group) {
    return (
      <div className="min-h-screen w-full flex justify-center bg-slate-50 p-4 sm:p-6">
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-gray-300 bg-white p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              No items to check out
            </h2>
            <p className="mx-auto mt-3 max-w-md text-slate-500">
              This business has no items in your cart, or the link is
              missing a business. Go back to your cart and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 lg:flex-row lg:items-start">
        {/* Order review */}
        <div className="flex w-full flex-col rounded-3xl border border-gray-300 bg-white p-6 lg:w-2/3">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-3">
              <ShoppingBag className="text-orange-500" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">
                <span className="text-sm text-orange-500">
                  {group.items.length}
                </span>{" "}
                ITEMS TO CHECK OUT
              </h2>
              <p className="text-sm text-slate-500">
                Confirm your order from{" "}
                <span className="font-medium text-slate-700">
                  {group.business_name}
                </span>{" "}
                before paying.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
              <Store size={15} />
              {group.business_name}
            </div>

            <div className="space-y-3">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-200 p-4"
                >
                  <div>
                    <p className="font-medium text-gray-700">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Qty {item.quantity} &middot; KSh {item.price}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-700">
                    KSh {item.subtotal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment panel */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-6 rounded-3xl border border-gray-300 bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold text-slate-800">
              Pay with M-Pesa
            </h2>

            <div className="mb-4 flex justify-between">
              <span className="text-slate-500">Items</span>
              <span>{group.items.length}</span>
            </div>

            <div className="mb-6 flex justify-between border-b border-gray-200 pb-6">
              <span className="text-slate-500">Total</span>
              <span className="font-semibold text-orange-500">
                KSh {group.subtotal}
              </span>
            </div>

            {paymentState === "success" ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle2 size={40} className="text-green-500" />
                <p className="font-medium text-slate-800">
                  Payment received!
                </p>
                <p className="text-sm text-slate-500">
                  Taking you to your orders...
                </p>
              </div>
            ) : (
              <>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  M-Pesa phone number
                </label>
                <div className="mb-1 flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 focus-within:border-orange-400">
                  <Smartphone size={18} className="text-slate-400" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="0712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={
                      paymentState === "prompting" ||
                      paymentState === "waiting"
                    }
                    className="w-full bg-transparent text-sm text-gray-700 outline-none disabled:opacity-60"
                  />
                </div>

                {errorMsg && (
                  <p className="mb-2 flex items-center gap-1 text-sm text-red-500">
                    <XCircle size={14} />
                    {errorMsg}
                  </p>
                )}

                <button
                  onClick={initiatePayment}
                  disabled={
                    paymentState === "prompting" ||
                    paymentState === "waiting" ||
                    !phone
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-medium text-white transition hover:bg-orange-600 disabled:opacity-60"
                >
                  {paymentState === "prompting" || paymentState === "waiting" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {paymentState === "prompting"
                        ? "Sending prompt..."
                        : "Waiting for M-Pesa PIN..."}
                    </>
                  ) : (
                    <>Pay KSh {group.subtotal}</>
                  )}
                </button>

                {paymentState === "waiting" && (
                  <p className="mt-3 text-center text-xs text-slate-500">
                    Check your phone and enter your M-Pesa PIN to complete the
                    payment.
                  </p>
                )}

                {paymentState === "failed" && (
                  <button
                    onClick={initiatePayment}
                    className="mt-3 w-full text-center text-xs font-medium text-orange-500 hover:text-orange-600"
                  >
                    Try again
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}