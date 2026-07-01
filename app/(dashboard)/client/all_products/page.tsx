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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-4 text-gray-600 shadow-sm">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {/* Products Exist */}
      {products.length > 0 ? (
        <div className="rounded-3xl border border-gray-300 bg-white p-4 sm:p-6 shadow-sm">
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
                Browse through all the products listed for sale.
              </p>
            </div>
          </div>

          {/* Product List */}
          <div className="space-y-3 sm:space-y-4">
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
                      <span className=" text-xs sm:text-base text-gray-500">
                        {product.description}
                      </span>
                      <span className=" text-xs sm:text-base text-orange-500">
                        Discount - {product.discount} %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
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

        </div>
      )}

    </div>
  );
}