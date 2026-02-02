"use client";

import { use } from "react";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import GuestProfilePanel from "@/components/guests/GuestProfilePanel";

export default function GuestProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="px-6">
      {/* Breadcrumb & Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px]">
          <Link href="/guests" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <ChevronLeft size={16} />
            Back to Guests
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">Manage Profile</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
            Page Refresh
          </button>
          <button className="px-4 py-2 text-[13px] font-medium text-white bg-[#1a1a1a] rounded-sm hover:bg-[#2a2a2a] transition-colors">
            I Want To...
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="font-display text-[28px] font-medium text-black">Manage Profile</h1>
      </div>

      {/* Profile Panel */}
      <GuestProfilePanel guestId={id} />
    </div>
  );
}
