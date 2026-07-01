"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  Search,
  Store,
  Phone,
  MapPin,
  Clock3,
  ChevronRight,
  Plus,
  Package,
  Pencil,
  Trash2,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";



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

interface Product {
  id: number;
  product_name: string;
  description: string;
  price: string;
  discount?: string;
  is_available: boolean;
}

interface Announcement {
  id: number;
  business_name: string;
  product_name: string;
  title: string;
  message: string;
  announcement_type: string;
  created_at: string;
}

const Home = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://nextdoor-server.onrender.com/business/?limit=3",
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

    useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "https://nextdoor-server.onrender.com/product/?limit=3",
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

   useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://nextdoor-server.onrender.com/announcement/?limit=3",
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
            setAnnouncements(data);
            console.log('Announcements......................', data)
          } else {
            console.error(
              "Expected an array but received:",
              data
            );
            setAnnouncements([]);
          }
        } else {
          console.error("Backend Error:", data);
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);


  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-4 text-gray-600 shadow-sm">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full  bg-gray-50  ">   
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
        <div className="flex lg:grid lg:grid-cols-2 flex-col gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex w-full items-center justify-between">
      <p className="mb-6 text-xs items-center font-medium uppercase tracking-wide text-gray-600">
       Nearby businesses
      </p>
      <Link href='/client/all_businesses' className="flex gap-2 mr-5 items-center hover:text-orange-400 cursor-pointer text-xs text-gray-600">View all <FaArrowRightLong size={15}/></Link>
        </div>
          {filteredBusinesses.map((business) => (
            <div
              key={business.id}
              className="flex items-center justify-between rounded-3xl border border-gray-200 bg-white py-3 transition hover:shadow-md"
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
         <div className="flex flex-col items-center w-full gap-5">
         <div className="space-y-5 mt-15 flex w-full flex-col sm:space-y-4">
          
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-gray-200 sm:p-5 transition hover:shadow-sm"
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
                    </div>
                  </div>
                </div>

                
              </div>
              
            ))}
            <div className="flex w-full items-center justify-between ml-[85%] ">
      <Link href='/client/all_products' className="flex gap-2 mr-5 items-center hover:text-orange-400 cursor-pointer text-xs text-gray-600">View all <FaArrowRightLong size={15}/></Link>
        </div>
          </div>
          </div>
        </div>
       
      )}

      {/* Announcements */}
<div className="mt-8 w-full rounded-3xl border border-gray-200 bg-white p-5">
  <div className="mb-5 flex items-center justify-between">
    <h3 className="text-lg font-semibold text-gray-700">
      Community Updates
    </h3>

    <Link
      href="/client/notifications"
      className="flex items-center gap-2 text-xs text-gray-600 hover:text-orange-500"
    >
      View all
      <FaArrowRightLong size={14} />
    </Link>
  </div>

  {announcements.length === 0 ? (
    <p className="py-6 text-center text-sm text-gray-500">
      No announcements yet.
    </p>
  ) : (
    <div className="space-y-4 ">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-orange-200 hover:bg-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-700">
                {announcement.title}
              </h4>

              <p className="mt-2 text-sm text-gray-600">
                {announcement.message}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                  {announcement.business_name}
                </span>

                {announcement.product_name && (
                  <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-medium text-lime-700">
                    {announcement.product_name}
                  </span>
                )}
              </div>
            </div>

            <span className="text-xs text-gray-400">
              {new Date(
                announcement.created_at
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

      
    </div>
  );
};

export default Home;