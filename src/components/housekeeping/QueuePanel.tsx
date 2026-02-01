"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { RefreshCw } from "lucide-react";
import RoomCard from "./RoomCard";
import StaffStatus from "./StaffStatus";

interface HousekeepingTask {
  id: string;
  roomNumber: string;
  roomType: "suite" | "deluxe" | "standard";
  floor: number;
  checkoutTime: string;
  nextArrival?: string;
  nextGuestVip: boolean;
  nextGuestPreferences?: string[];
  priority: number;
  priorityLevel: "high" | "medium" | "low";
  assignedTo?: string[];
  status: "pending" | "assigned" | "in_progress" | "complete";
}

interface Housekeeper {
  id: string;
  name: string;
  currentFloor: number;
  assignedRooms: number;
  status: "available" | "busy" | "break";
}

interface QueueData {
  queue: HousekeepingTask[];
  staff: Housekeeper[];
  summary: {
    pending: number;
    inProgress: number;
    staffAvailable: number;
    staffBusy: number;
    staffOnBreak: number;
  };
}

export default function QueuePanel() {
  const [data, setData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch("/api/housekeeping/queue");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch queue:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    // Poll every 5 seconds for updates
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  const handleCheckout = async (roomNumber: string, vip: boolean = false) => {
    try {
      await fetch("/api/housekeeping/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber,
          nextArrival: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          nextGuestVip: vip,
        }),
      });
      fetchQueue();
    } catch (error) {
      console.error("Failed to trigger checkout:", error);
    }
  };

  const handleStatusUpdate = async (
    taskId: string,
    status: "in_progress" | "complete"
  ) => {
    try {
      await fetch(`/api/housekeeping/task/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchQueue();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader title="Housekeeping Queue" />
        <CardBody>
          <div className="flex items-center justify-center py-12">
            <RefreshCw size={24} className="animate-spin text-gray-400" />
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Housekeeping Queue"
          action={
            <button
              onClick={fetchQueue}
              className="text-[13px] text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          }
        />
        <CardBody>
          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="rounded-sm bg-gray-50 p-3 text-center">
              <div className="text-[24px] font-semibold text-gray-900">
                {data?.summary.pending || 0}
              </div>
              <div className="text-[12px] text-gray-500">Pending</div>
            </div>
            <div className="rounded-sm bg-blue-50 p-3 text-center">
              <div className="text-[24px] font-semibold text-blue-700">
                {data?.summary.inProgress || 0}
              </div>
              <div className="text-[12px] text-blue-600">In Progress</div>
            </div>
            <div className="rounded-sm bg-green-50 p-3 text-center">
              <div className="text-[24px] font-semibold text-green-700">
                {data?.summary.staffAvailable || 0}
              </div>
              <div className="text-[12px] text-green-600">Staff Available</div>
            </div>
            <div className="rounded-sm bg-amber-50 p-3 text-center">
              <div className="text-[24px] font-semibold text-amber-700">
                {data?.summary.staffBusy || 0}
              </div>
              <div className="text-[12px] text-amber-600">Staff Busy</div>
            </div>
          </div>

          {/* Demo Checkout Buttons */}
          <div className="mb-6 p-4 rounded-sm bg-gray-50 border border-gray-200">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Demo: Trigger Checkout
            </div>
            <div className="flex flex-wrap gap-2">
              {["412", "508", "720", "801", "605"].map((room) => (
                <button
                  key={room}
                  onClick={() =>
                    handleCheckout(room, room === "801" || room === "720")
                  }
                  className="rounded-sm border border-gray-300 bg-white px-3 py-1.5 text-[13px] hover:bg-gray-100"
                >
                  Room {room}
                  {(room === "801" || room === "720") && (
                    <span className="ml-1 text-amber-600">VIP</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Queue List */}
          <div className="space-y-3">
            {(!data?.queue || data.queue.length === 0) ? (
              <div className="py-8 text-center text-[14px] text-gray-400">
                No rooms in queue. Trigger a checkout above to add rooms.
              </div>
            ) : (
              data.queue.map((task) => (
                <RoomCard
                  key={task.id}
                  task={task}
                  staff={data.staff}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
            )}
          </div>
        </CardBody>
      </Card>

      {/* Staff Status */}
      {data?.staff && <StaffStatus staff={data.staff} />}
    </div>
  );
}
