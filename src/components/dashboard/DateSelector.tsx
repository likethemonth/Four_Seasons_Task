"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function DateSelector() {
  return (
    <div className="flex items-center gap-3">
      <button className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-300 bg-white hover:border-black transition-colors">
        <ChevronLeft size={16} />
      </button>
      <div className="flex items-center gap-2 rounded-sm border border-gray-300 bg-white px-4 py-2">
        <Calendar size={14} className="text-gray-500" />
        <span className="text-[14px] font-medium">Saturday, February 15, 2026</span>
      </div>
      <button className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-300 bg-white hover:border-black transition-colors">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
