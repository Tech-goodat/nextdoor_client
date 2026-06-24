"use client";

import React from "react";
import { Search } from "lucide-react";

const TopNavBar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/80 backdrop-blur-md">
      
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          What's Good Felix
        </h1>

        <button
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-gradient-to-r
            from-orange-500
            to-lime-500
            font-semibold
            text-white
            shadow-md
            transition-all
            duration-300
            hover:scale-105
          "
        >
          JK
        </button>
      </div>

      <div className="px-4 pb-4 sm:px-6">
        <div className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 transition-all duration-300 focus-within:border-orange-400 focus-within:shadow-md">
          
          <Search
            size={18}
            className="text-gray-400 transition-colors group-focus-within:text-orange-500"
          />

          <input
            type="text"
            placeholder="Search businesses, products..."
            className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

    </header>
  );
};

export default TopNavBar;