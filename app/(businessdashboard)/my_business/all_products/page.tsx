"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Package,
  Pencil,
  Trash2,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  product_name: string;
  description: string;
  price: string;
  discount?: string;
  is_available: boolean;
  business_name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "https://nextdoor-server.onrender.com/product/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        console.log("Fetched Products:", data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId: number) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      "https://nextdoor-server.onrender.com/cart/add_item/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          product: productId,
          quantity: 1,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add item.");
    }

    alert("Added to cart!");
  } catch (error) {
    console.error(error);
    alert("Could not add item.");
  }
};

  if (loading) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-gray-100 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
          <div className="flex flex-col items-center">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-orange-400 border-r-orange-400"></div>
            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-700">
              Loading Products...
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Please wait while we fetch the latest products for you.
            </p>

            <div className="mt-6 flex gap-2">
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-400 [animation-delay:-0.3s]"></span>
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-lime-400 [animation-delay:-0.15s]"></span>
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-400"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-3 sm:p-6">
      {/* Products Exist */}
      {products.length > 0 ? (
        <div className="rounded-3xl p-2 md:p-4 w-full border border-gray-300 bg-white shadow-sm">
          {/* Section Header */}
          <div className="mb-4 sm:mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-2 sm:p-3">
              <Package size={20} className="text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-800">
                <span className="text-lg text-orange-400">{products.length}</span>{" "}
                PRODUCTS LISTED
              </h3>
              <p className="text-sm text-slate-500">
                Here are all products you have added
              </p>
            </div>
          </div>

          {/* Product List */}
          <div className="space-y-3 flex w-full flex-col lg:grid grid-cols-2 gap-5 sm:space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-gray-300 p-4 sm:p-5 transition hover:shadow-sm"
              >
                {/* Product Info */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                    📦
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg text-gray-600 font-semibold">
                      {product.product_name}
                    </h4>
                    <div className="mt-1 sm:mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs sm:text-sm ${
                          product.is_available
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {product.is_available ? "Available" : "Unavailable"}
                      </span>
                      <span className="font-medium text-sm sm:text-base text-orange-500">
                        KSh {product.price}
                      </span>
                      <span className="font-medium text-xs sm:text-base text-gray-500">
                          {product.business_name}
                        </span>

                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
  <button
    onClick={() => addToCart(product.id)}
    className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
  >
    <Plus size={16} />
    Add to Cart
  </button>
</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-gray-300 bg-white p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto mb-5 sm:mb-6 flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-orange-50">
            <Package size={40} className="text-orange-500 sm:hidden" />
            <Package size={50} className="text-orange-500 hidden sm:block" />
          </div>

          <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-bold text-slate-900">
            No products yet
          </h2>

          <p className="mx-auto max-w-md text-sm sm:text-base text-slate-500">
            You haven't added any products for your business. Start by adding
            your first product and let customers discover what you offer.
          </p>

          <Link
            href="/my_business/create_product"
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 text-sm rounded-lg bg-orange-500 px-5 sm:px-6 py-3 font-medium text-white transition hover:bg-orange-600"
          >
            <Plus size={18} />
            Add Your First Product
          </Link>
        </div>
      )}

    </div>
  );
}