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
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-black px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/images/four-seasons-logo.svg"
            alt="Four Seasons"
            width={140}
            height={40}
            className="invert"
          />
        </div>
        <div className="ml-4 border-l border-gray-600 pl-4">
          <span className="text-[11px] font-light tracking-widest text-[#B8860B] uppercase">
            Labor Optimization
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <select className="appearance-none rounded-sm border border-gray-600 bg-transparent px-4 py-2 pr-8 text-[13px] text-white focus:border-[#B8860B] focus:outline-none cursor-pointer">
            {properties.map((property) => (
              <option key={property} value={property} className="bg-black">
                {property}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B8860B] text-[12px] font-medium text-black">
            MC
          </div>
          <span className="text-[13px] text-white">M. Cocuron</span>
        </div>
      </div>
    </header>
  );
}
