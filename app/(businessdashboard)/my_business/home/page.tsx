"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Store,
  Phone,
  MapPin,
  Clock3,
  ChevronRight,
} from "lucide-react";

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

const Home = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://nextdoor-server.onrender.com/business/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Response:", data);
        console.log("Is Array:", Array.isArray(data));

        if (response.ok) {
          if (Array.isArray(data)) {
            setBusinesses(data);
          } else {
            console.error(
              "Expected an array but received:",
              data
            );
            setBusinesses([]);
          }
        } else {
          console.error("Backend Error:", data);
          setBusinesses([]);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        businesses
          .map((business) => business.business_type)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [businesses]);

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.business_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      business.description
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      business.business_type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search businesses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-gray-300 bg-white py-3 pr-4 pl-12 outline-none focus:ring-2 focus:ring-lime-400"
        />
      </div>

      {/* Categories */}
      <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap rounded-full border px-5 py-2 text-sm text-gray-700 transition ${
              selectedCategory === category
                ? "border-lime-400 bg-lime-400 text-black"
                : "border-gray-200 bg-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="mb-6 text-sm font-medium uppercase tracking-wide text-gray-600">
        {filteredBusinesses.length} Businesses Found
      </p>

      {/* Loading */}
      {loading ? (
        <div className="py-20 text-center">
          Loading businesses...
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          No businesses found.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredBusinesses.map((business) => (
            <div
              key={business.id}
              className="flex items-center justify-between rounded-3xl border border-gray-200 bg-white px-5 py-3 transition hover:shadow-md"
            >
              <div className="flex gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-50">
                  <Store
                    size={28}
                    className="text-lime-600"
                  />
                </div>

                <div>
                  <h2 className="text-md font-semibold text-gray-700">
                    {business.business_name}
                  </h2>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {business.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Open
                    </span>

                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={14} />
                      {business.shop_number}
                    </span>

                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone size={14} />
                      {business.phone_number}
                    </span>

                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock3 size={14} />
                      {business.opens} - {business.closes}
                    </span>
                  </div>
                </div>
              </div>

              <button className="text-gray-400 transition hover:text-gray-700">
                <ChevronRight size={28} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;