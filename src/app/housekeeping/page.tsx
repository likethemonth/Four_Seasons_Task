"use client";

import QueuePanel from "@/components/housekeeping/QueuePanel";

export default function HousekeepingPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-black">
          Housekeeping Operations
        </h1>
        <p className="text-[14px] text-gray-500">
          Real-time room queue with priority scoring and auto-assignment
        </p>
      </div>

      <QueuePanel />
    </div>
  );
}
