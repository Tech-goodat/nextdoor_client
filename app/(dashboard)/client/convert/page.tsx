"use client";

import Link from "next/link";
import React, { useState } from "react";

import {
  Building2,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Convert = () => {
  const [formData, setFormData] = useState({
    business_type: "",
    business_name: "",
    description: "",
    shop_number: "",
    opens: "",
    closes: "",
    phone_number: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    console.log('my access_token.......................', token)
    

    try {
      const response = await fetch(
        "https://nextdoor-server.onrender.com/business/",
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

      if (!response.ok) {
        alert("Failed to create business.");
        console.log(data);
        return;
      }

      setShowSuccess(true);
      router.push('/my_business/home')
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }
      
  };

  

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-orange-50 to-lime-50 px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">

        <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:p-8">
          
          <h1 className="text-4xl font-bold text-gray-800">
            Next
            <span className="text-orange-500">Door</span>
            <span className="text-lime-600">.</span>
          </h1>

          <h2 className="mt-6 text-2xl font-bold text-gray-800">
            List your business
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Start with a free plan. Upgrade anytime to unlock
            more features.
          </p>

          {/* Logo Upload */}
          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Business Logo
            </label>

            <div className="flex h-36 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 text-center">
              <div>
                <p className="text-4xl">📷</p>

                <p className="mt-2 text-sm text-gray-600">
                  Upload business logo
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* Business Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Business Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                <Building2
                  size={18}
                  className="text-gray-500"
                />

                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="e.g. Mama Njeri's Kitchen"
                  className="w-full bg-transparent outline-none text-gray-800"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Category
              </label>

              <select
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none"
              >
                <option value="">
                  Select category
                </option>

                <option value="Food & Drinks">
                  Food & Drinks
                </option>

                <option value="Beauty">
                  Beauty
                </option>

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Laundry">
                  Laundry
                </option>

                <option value="Repairs">
                  Repairs
                </option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Short Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tell residents what you offer..."
                className="w-full rounded-xl border border-gray-200 p-4 text-gray-800 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Business Phone
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                <Phone
                  size={18}
                  className="text-gray-500"
                />

                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="0712 345 678"
                  className="w-full bg-transparent outline-none text-gray-800"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Location in Estate
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                <MapPin
                  size={18}
                  className="text-gray-500"
                />

                <input
                  type="text"
                  name="shop_number"
                  value={formData.shop_number}
                  onChange={handleChange}
                  placeholder="e.g. Block C, near the gate"
                  className="w-full bg-transparent outline-none text-gray-800"
                />
              </div>
            </div>

            {/* Hours */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Opens
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                  <Clock
                    size={18}
                    className="text-gray-500"
                  />

                  <input
                    type="text"
                    name="opens"
                    value={formData.opens}
                    onChange={handleChange}
                    placeholder="7:00 AM"
                    className="w-full bg-transparent outline-none text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Closes
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                  <Clock
                    size={18}
                    className="text-gray-500"
                  />

                  <input
                    type="text"
                    name="closes"
                    value={formData.closes}
                    onChange={handleChange}
                    placeholder="9:00 PM"
                    className="w-full bg-transparent outline-none text-gray-800"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg"
            >
              List My Business
            </button>
          </form>
        </div>
        
      </div>
      {showSuccess && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">

    <div className="mx-4 w-full max-w-md animate-in zoom-in-95 duration-300 rounded-3xl border border-white/50 bg-white p-8 shadow-2xl">

      <div className="flex justify-center">
        <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-linear-to-r from-orange-100 to-lime-100">
          <CheckCircle2
            size={48}
            className="text-lime-600"
          />
        </div>
      </div>

      <h2 className="mt-6 text-center text-2xl font-bold text-gray-800">
        Congratulations 🎉
      </h2>

      <p className="mt-3 text-center text-sm leading-relaxed text-gray-600">
        Your business has been listed successfully.
      </p>

      <p className="mt-2 text-center text-sm leading-relaxed text-gray-600">
        You are now officially a seller on{" "}
        <span className="font-semibold text-orange-500">
          NextDoor
        </span>.
      </p>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => setShowSuccess(false)}
          className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
        >
          Stay Here
        </button>

        <Link
          href="/business/dashboard"
          className="flex flex-1 items-center justify-center rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600"
        >
          Go To Dashboard
        </Link>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Convert;