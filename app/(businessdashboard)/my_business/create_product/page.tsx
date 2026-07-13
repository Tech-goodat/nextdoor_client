"use client";

import { useState } from "react";
import { Package, DollarSign, Tag, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductFormData {
  product_name: string;
  description: string;
  price: string;
  discount: string;
  is_available: boolean;
}

export default function CreateProductForm() {
    const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: "",
    description: "",
    price: "",
    discount: "",
    is_available: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    setLoading(true);

    try {
      const response = await fetch(
        "https://nextdoor-server.onrender.com/product/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log("Product created:", data);
      router.push('/my_business/products')

      setFormData({
        product_name: "",
        description: "",
        price: "",
        discount: "",
        is_available: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3  mt-10"
    >
      {/* Product Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Product Name
        </label>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-slate-50 px-4 py-3">
          <Package
            size={18}
            className="text-orange-500"
          />

          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="e.g. Shoe Cleaning"
            className="w-full bg-transparent outline-none"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>

        <div className="rounded-xl border border-gray-300 bg-slate-50 p-3">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product..."
            rows={4}
            className="w-full resize-none bg-transparent outline-none"
            required
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Price (KES)
        </label>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-slate-50 px-4 py-3">
          <DollarSign
            size={18}
            className="text-orange-500"
          />

          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="500"
            className="w-full bg-transparent outline-none"
            required
          />
        </div>
      </div>

      {/* Discount */}
      <div className="items-center">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Discount (Optional)
        </label>
 <div className="flex w-full gap-5 items-center">
        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-slate-50 px-4 py-3">
          <Tag
            size={18}
            className="text-orange-500"
          />
       
          <input
            type="text"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="10% OFF"
            className="w-full bg-transparent outline-none"
          />
        </div>
       <label className="flex items-center justify-between gap-4 rounded-xl  bg-slate-50 p-4">
  <span className="text-sm font-medium text-slate-700">
    Product Available
  </span>

  <button
    type="button"
    onClick={() =>
      setFormData((prev) => ({
        ...prev,
        is_available: !prev.is_available,
      }))
    }
    className={`relative h-7 w-14 rounded-full transition-all duration-300 ${
      formData.is_available
        ? "bg-orange-500"
        : "bg-slate-300"
    }`}
  >
    <span
      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 ${
        formData.is_available
          ? "left-8"
          : "left-1"
      }`}
    />
  </button>
</label>
      </div>
      </div>

      {/* Availability */}
      

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-orange-500 py-3 font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
      >
        {loading
          ? "Creating Product..."
          : "Create Product"}
      </button>
    </form>
  );
}