"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";

const properties = [
  "Four Seasons Park Lane, London",
  "Four Seasons New York Downtown",
  "Four Seasons Maui",
  "Four Seasons Singapore",
  "Four Seasons Dubai",
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-24 items-center justify-between bg-black px-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/four-seasons-logo.svg"
            alt="Four Seasons"
            width={40}
            height={60}
          />
        </div>
        <div className="ml-4 border-l border-gray-600 pl-6">
          <span className="text-[15px] font-semibold tracking-wider text-white uppercase">
            Labor Optimization
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <select className="appearance-none rounded-sm border border-gray-600 bg-transparent px-4 py-2.5 pr-10 text-[15px] text-white focus:border-white focus:outline-none cursor-pointer">
            {properties.map((property) => (
              <option key={property} value={property} className="bg-black">
                {property}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-black">
            MC
          </div>
          <span className="text-[15px] font-medium text-white">M. Cocuron</span>
        </div>
      </div>
    </header>
  );
}
