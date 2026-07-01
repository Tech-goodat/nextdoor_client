"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Save,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const EditProduct = () => {
  const router = useRouter();
  const params = useParams();

  const productId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `https://nextdoor-server.onrender.com/product/${productId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        setProductName(data.product_name);
        setDescription(data.description);
        setPrice(data.price);
        setDiscount(data.discount || "");
        setAvailable(data.is_available);
      } catch (error) {
        console.error(error);
        alert("Could not load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    setSaving(true);

    try {
      const response = await fetch(
        `https://nextdoor-server.onrender.com/product/${productId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_name: productName,
            description,
            price,
            discount,
            is_available: available,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      alert("Product updated successfully!");

      router.push("/my_business/products");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-orange-100 p-3">
              <Package className="text-orange-500" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Edit Product
              </h1>

              <p className="text-sm text-slate-500">
                Update your product information
              </p>
            </div>
          </div>

          <Link
            href="/my_business/products"
            className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">

          {/* Product Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Product Name
            </label>

            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* Price */}

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Price (KSh)
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Discount (%)
              </label>

              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-orange-500"
              />
            </div>

          </div>

          {/* Availability */}

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
            <input
              type="checkbox"
              checked={available}
              onChange={() => setAvailable(!available)}
              className="h-5 w-5 accent-orange-500"
            />

            <span className="text-slate-700">
              Product is available for customers
            </span>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-4">

            <Link
              href="/my_business/products"
              className="rounded-xl border border-gray-300 px-6 py-3 text-slate-700 hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditProduct;