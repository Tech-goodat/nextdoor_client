"use client";

import React, { useEffect, useState } from "react";
import { Camera } from "lucide-react";

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

const Profile = () => {
  const [businessId, setBusinessId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "",
    description: "",
    phone_number: "",
    shop_number: "",
    opens: "",
    closes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://nextdoor-server.onrender.com/business/my_business/",
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      const business: Business = data; 

      setBusinessId(business.id);
      setFormData({
        business_name: business.business_name || "",
        business_type: business.business_type || "",
        description: business.description || "",
        phone_number: business.phone_number || "",
        shop_number: business.shop_number || "",
        opens: business.opens || "",
        closes: business.closes || "",
      });
    } else {
      setMessage(data.error || "Business not found.");
    }
  } catch (error) {
    console.log(error);
    setMessage("Failed to load business.");
  } finally {
    setLoading(false);
  }
};

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (!businessId) {
    setMessage("Business not found.");
    return;
  }

  try {
    setSaving(true);
    setMessage("");

    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://nextdoor-server.onrender.com/business/${businessId}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setMessage("Business updated successfully.");

      setFormData({
        business_name: data.business_name || "",
        business_type: data.business_type || "",
        description: data.description || "",
        phone_number: data.phone_number || "",
        shop_number: data.shop_number || "",
        opens: data.opens || "",
        closes: data.closes || "",
      });
    } else {
      setMessage(data.error || "Failed to update business.");
    }
  } catch (error) {
    console.error(error);
    setMessage("Something went wrong.");
  } finally {
    setSaving(false);
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
              Loading Profile...
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Getting your profile ready .
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
    <div className="w-full md:max-w-7xl flex mx-auto px-6 ">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col  p-8"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-28 h-28 rounded-3xl bg-orange-50 flex items-center justify-center">
            <Camera size={32} className="text-orange-500" />
          </div>

          <button
            type="button"
            className="mt-3 text-orange-500 text-sm"
          >
            Change logo
          </button>
        </div>

        {/* Business Name */}
        <div className="mb-5">
          <label className="block mb-2 text-xs text-gray-600 font-medium">
            Business Name
          </label>

          <input
            type="text"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            className="w-full border rounded-xl text-xs px-4 py-4 outline-none border-gray-300 focus:ring-2 focus:ring-lime-400"
          />
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="block text-gray-600 mb-2 text-xs font-medium">
            Category
          </label>

          <select
            name="business_type"
            value={formData.business_type}
            onChange={handleChange}
            className="w-full border rounded-xl border-gray-300 px-4 py-4 text-xs outline-none focus:ring-1 focus:ring-orange-400"
          >
            <option className="text-xs text-gray-600" value="">Select category</option>
            <option className="text-xs text-gray-600" value="Food">Food</option>
            <option className="text-xs text-gray-600" value="Beauty">Beauty</option>
            <option className="text-xs text-gray-600" value="Repairs">Repairs</option>
            <option className="text-xs text-gray-600" value="Fashion">Fashion</option>
            <option className="text-xs text-gray-600" value="Delivery">Delivery</option>
            <option className="text-xs text-gray-600" value="Health">Health</option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block mb-2 text-xs text-gray-600 font-medium">
            Description
          </label>

          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-xl border-gray-300 text-xs px-4 py-3 resize-none outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>

        {/* Phone + Shop Number */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full border text-xs rounded-xl px-4 py-4 outline-none focus:ring-1 border-gray-300 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs text-gray-600 font-medium">
              Shop Number
            </label>

            <input
              type="text"
              name="shop_number"
              value={formData.shop_number}
              onChange={handleChange}
              className="w-full border rounded-xl text-xs border-gray-300 px-4 py-4 outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-medium">
              Opens At
            </label>

            <input
              type="text"
              name="opens"
              value={formData.opens}
              onChange={handleChange}
              placeholder="8:00AM"
              className="w-full border rounded-xl border-gray-300 text-xs px-4 py-4 outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs text-gray-600 font-medium">
              Closes At
            </label>

            <input
              type="text"
              name="closes"
              value={formData.closes}
              onChange={handleChange}
              placeholder="9:00PM"
              className="w-full border text-xs border-gray-300 rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-xl bg-gray-100 p-4 text-sm">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;