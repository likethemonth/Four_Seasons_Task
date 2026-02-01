"use client";

import { Clock, User, Star, AlertTriangle, CheckCircle, Play } from "lucide-react";

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

interface RoomCardProps {
  task: HousekeepingTask;
  staff: Housekeeper[];
  onStatusUpdate: (taskId: string, status: "in_progress" | "complete") => void;
}

const priorityColors = {
  high: "border-red-200 bg-red-50",
  medium: "border-amber-200 bg-amber-50",
  low: "border-gray-200 bg-white",
};

const priorityBadgeColors = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-gray-100 text-gray-600",
};

const statusColors = {
  pending: "bg-gray-100 text-gray-600",
  assigned: "bg-blue-100 text-blue-700",
  in_progress: "bg-purple-100 text-purple-700",
  complete: "bg-green-100 text-green-700",
};

const roomTypeBadge = {
  suite: "bg-black text-white",
  deluxe: "bg-gray-700 text-white",
  standard: "bg-gray-200 text-gray-700",
};

export default function RoomCard({ task, staff, onStatusUpdate }: RoomCardProps) {
  const getAssignedNames = () => {
    if (!task.assignedTo || task.assignedTo.length === 0) return null;
    return task.assignedTo
      .map((id) => staff.find((s) => s.id === id)?.name || id)
      .join(" & ");
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTimeUntilArrival = () => {
    if (!task.nextArrival) return null;
    const arrival = new Date(task.nextArrival);
    const now = new Date();
    const diffMs = arrival.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 0) return "Overdue";
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const assignedNames = getAssignedNames();
  const timeUntil = getTimeUntilArrival();

  return (
    <div
      className={`rounded-sm border p-4 transition-all ${priorityColors[task.priorityLevel]}`}
    >
      <div className="flex items-start justify-between mb-3">
        {/* Room info */}
        <div className="flex items-center gap-3">
          <div className="text-[20px] font-semibold text-gray-900">
            {task.roomNumber}
          </div>
          <span
            className={`rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase ${roomTypeBadge[task.roomType]}`}
          >
            {task.roomType}
          </span>
          <span className="text-[13px] text-gray-500">Floor {task.floor}</span>
        </div>

        {/* Priority & Status */}
        <div className="flex items-center gap-2">
          <span
            className={`rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase ${priorityBadgeColors[task.priorityLevel]}`}
          >
            {task.priorityLevel} ({task.priority})
          </span>
          <span
            className={`rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase ${statusColors[task.status]}`}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Details row */}
      <div className="flex flex-wrap gap-4 mb-3 text-[13px]">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Clock size={14} />
          <span>Checkout: {formatTime(task.checkoutTime)}</span>
        </div>
        {task.nextArrival && (
          <div
            className={`flex items-center gap-1.5 ${
              timeUntil === "Overdue" ? "text-red-600" : "text-gray-600"
            }`}
          >
            <AlertTriangle size={14} />
            <span>
              Arrival: {formatTime(task.nextArrival)} ({timeUntil})
            </span>
          </div>
        )}
        {task.nextGuestVip && (
          <div className="flex items-center gap-1.5 text-amber-600">
            <Star size={14} />
            <span>VIP Guest</span>
          </div>
        )}
      </div>

      {/* Assigned staff */}
      {assignedNames && (
        <div className="flex items-center gap-1.5 mb-3 text-[13px] text-blue-700">
          <User size={14} />
          <span>Assigned: {assignedNames}</span>
        </div>
      )}

      {/* Guest preferences */}
      {task.nextGuestPreferences && task.nextGuestPreferences.length > 0 && (
        <div className="mb-3">
          <div className="text-[11px] font-semibold uppercase text-gray-500 mb-1">
            Guest Preferences
          </div>
          <div className="flex flex-wrap gap-1.5">
            {task.nextGuestPreferences.map((pref, idx) => (
              <span
                key={idx}
                className="rounded-full bg-white border border-gray-200 px-2.5 py-0.5 text-[12px] text-gray-600"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {task.status !== "complete" && (
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          {task.status === "assigned" && (
            <button
              onClick={() => onStatusUpdate(task.id, "in_progress")}
              className="flex items-center gap-1.5 rounded-sm bg-purple-600 px-3 py-1.5 text-[13px] text-white hover:bg-purple-700"
            >
              <Play size={14} />
              Start Cleaning
            </button>
          )}
          {task.status === "in_progress" && (
            <button
              onClick={() => onStatusUpdate(task.id, "complete")}
              className="flex items-center gap-1.5 rounded-sm bg-green-600 px-3 py-1.5 text-[13px] text-white hover:bg-green-700"
            >
              <CheckCircle size={14} />
              Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
