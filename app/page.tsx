"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { FaCartArrowDown } from "react-icons/fa";
import { MdOutlinePlaylistAddCheckCircle } from "react-icons/md";

const cards = [
  {
    icon: <CiSearch />,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    title: "Discover nearby businesses",
    description: "Browse food, beauty, repairs & more",
  },
  {
    icon: <FaCartArrowDown />,
    iconBg: "bg-lime-100",
    iconColor: "text-lime-600",
    title: "Order products & services",
    description: "Request delivery or pickup in minutes",
  },
  {
    icon: <MdOutlinePlaylistAddCheckCircle />,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    title: "List your own business",
    description: "Reach all residents in your estate",
  },
];

const Page = () => {
const router = useRouter();
const [checkingAuth, setCheckingAuth] = useState(true);

useEffect(() => {
  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // No token -> stay on landing page
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    // Logged in business owner
    if (user?.business_name) {
      router.replace("/my_business/home");
      return;
    }

    // Logged in regular client
    else if (user)
    router.replace("/client/home");
  };

  router.replace("/");

  

  checkAuthentication();

  
}, [router]);

  // Prevent landing page flashing before redirect
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-white via-orange-50 to-lime-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-sm text-gray-500">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-linear-to-br from-white via-orange-50 to-lime-50">
      <div className="grid min-h-screen grid-cols-1 gap-12 px-6 py-10 md:px-12 lg:grid-cols-2 lg:px-20">
        {/* Left Section */}
        <div className="flex animate-[fadeIn_0.8s_ease-in-out] flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl">
            Next
            <span className="text-orange-500">Door</span>
            <span className="text-lime-600">.</span>
          </h1>

          <p className="mt-5 max-w-lg text-sm font-medium text-gray-700 md:text-base">
            Your estate's marketplace. Discover, order, and support local
            businesses, all within Tsavo Estate.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${card.iconBg} ${card.iconColor}`}
                >
                  {card.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {card.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-white/50 bg-white/80 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:shadow-2xl md:p-10">
            <h2 className="text-3xl font-bold text-gray-800">
              Get Started
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Join your estate's marketplace today.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="/auth/signup"
                className="flex w-full items-center justify-center rounded-lg bg-orange-500 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02]"
              >
                Create an account
              </Link>

              <Link
                href="/auth/login"
                className="flex w-full items-center justify-center rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50"
              >
                I already have an account
              </Link>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-center text-xs text-gray-500">
                Support local businesses and discover services around you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;