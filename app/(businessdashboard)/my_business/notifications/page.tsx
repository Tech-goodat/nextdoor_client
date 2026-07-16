"use client";

import React, { useEffect, useState } from "react";
import { Bell, Package, Store, Calendar } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  message: string;
  announcement_type: string;
  business_name: string;
  product_name: string | null;
  created_at: string;
}

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://nextdoor-server.onrender.com/announcement/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }

        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

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
              Loading notifications...
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Fetching the latest notifications for you.
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
    <div className="min-h-screen w-full flex items-center flex-col px-4 py-8 md:px-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-orange-100 p-3">
            <Bell className="text-orange-500" size={26} />
          </div>

          <div className="flex w-full flex-col">
            <h1 className="text-xl md:text-3xl font-bold text-gray-800">
              Community Announcements
            </h1>

            <p className="mt-1 text-xs max-w-60 lg:text text-gray-500">
              Stay updated with everything happening around the estate.
            </p>
          </div>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-white py-20 text-center">
          <Bell
            size={48}
            className="mx-auto mb-4 text-gray-300"
          />

          <h2 className="text-xl font-semibold text-gray-700">
            No announcements yet
          </h2>

          <p className="mt-2 text-gray-500">
            New businesses and products will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6 w-full itema-center flex flex-col lg:grid lg:grid-cols-2 lg:gap-6">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="rounded-3xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                {/* Left */}
                <div className="flex gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      announcement.announcement_type ===
                      "NEW_PRODUCT"
                        ? "bg-lime-100"
                        : "bg-orange-100"
                    }`}
                  >
                    {announcement.announcement_type ===
                    "NEW_PRODUCT" ? (
                      <Package
                        className="text-lime-700"
                        size={28}
                      />
                    ) : (
                      <Store
                        className="text-orange-600"
                        size={28}
                      />
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-700">
                      {announcement.title}
                    </h2>

                    <p className="mt-2 text-gray-600">
                      {announcement.message}
                    </p>

                    <div className="mt-4 flex flex-wrap w-full gap-2">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                        {announcement.business_name}
                      </span>

                      {announcement.product_name && (
                        <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-medium text-lime-700">
                          {announcement.product_name}
                        </span>
                      )}

                      <span
                        className={`rounded-full  px-3 py-1 text-xs font-medium ${
                          announcement.announcement_type ===
                          "NEW_PRODUCT"
                            ? "bg-lime-50 text-lime-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {announcement.announcement_type ===
                        "NEW_PRODUCT"
                          ? "New Product"
                          : "New Business"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />

                  {new Date(
                    announcement.created_at
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;