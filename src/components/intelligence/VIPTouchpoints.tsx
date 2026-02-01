"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import {
  Crown,
  Clock,
  MapPin,
  Gift,
  Utensils,
  Heart,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";

interface VIPGuest {
  id: string;
  name: string;
  initials: string;
  tier: "ELITE" | "PREFERRED" | "VIP";
  room: string;
  arrivalTime: string;
  stayCount: number;
  occasion?: string;
  dietary?: string[];
  preferences?: string[];
  requests?: string[];
  communications: {
    emails: number;
    calls: number;
    chats: number;
  };
  touchpoints: {
    id: string;
    task: string;
    department: string;
    status: "pending" | "done" | "in_progress";
    assignedTo?: string;
  }[];
}

const mockVIPs: VIPGuest[] = [
  {
    id: "vip_1",
    name: "Mr. Chen",
    initials: "MC",
    tier: "PREFERRED",
    room: "Suite 412",
    arrivalTime: "2:00 PM",
    stayCount: 12,
    occasion: "Wife's 40th birthday",
    dietary: ["Vegetarian"],
    preferences: ["Peonies", "High floor", "Quiet room"],
    requests: ["Late spa availability", "Private dining"],
    communications: { emails: 3, calls: 1, chats: 2 },
    touchpoints: [
      { id: "t1", task: "Birthday amenity setup", department: "Housekeeping", status: "pending", assignedTo: "Maria S." },
      { id: "t2", task: "Peonies in room", department: "Housekeeping", status: "done", assignedTo: "Jun P." },
      { id: "t3", task: "Vegetarian menu briefing", department: "F&B", status: "in_progress", assignedTo: "Chef Marco" },
      { id: "t4", task: "Spa appointment confirmed", department: "Spa", status: "done" },
      { id: "t5", task: "GM welcome call", department: "Management", status: "pending" },
    ],
  },
  {
    id: "vip_2",
    name: "Mrs. Tanaka",
    initials: "MT",
    tier: "ELITE",
    room: "Suite 508",
    arrivalTime: "4:30 PM",
    stayCount: 22,
    dietary: ["Nut allergy", "Gluten-free"],
    preferences: ["Corner room", "Extra pillows"],
    requests: ["Airport transfer"],
    communications: { emails: 2, calls: 2, chats: 0 },
    touchpoints: [
      { id: "t6", task: "Allergy alert to all F&B", department: "F&B", status: "done" },
      { id: "t7", task: "Extra pillows prepared", department: "Housekeeping", status: "done", assignedTo: "Sarah J." },
      { id: "t8", task: "Airport transfer confirmed", department: "Concierge", status: "done" },
      { id: "t9", task: "Welcome amenity", department: "Housekeeping", status: "pending" },
    ],
  },
  {
    id: "vip_3",
    name: "Dr. Williams",
    initials: "DW",
    tier: "VIP",
    room: "Presidential",
    arrivalTime: "6:00 PM",
    stayCount: 8,
    occasion: "Honeymoon",
    preferences: ["Champagne", "Rose petals", "Late checkout"],
    communications: { emails: 4, calls: 0, chats: 1 },
    touchpoints: [
      { id: "t10", task: "Honeymoon package setup", department: "Housekeeping", status: "in_progress", assignedTo: "Anna K." },
      { id: "t11", task: "Champagne chilled", department: "F&B", status: "pending" },
      { id: "t12", task: "Late checkout pre-approved", department: "Front Office", status: "done" },
      { id: "t13", task: "Couples spa reserved", department: "Spa", status: "done" },
    ],
  },
];

const tierColors = {
  ELITE: "bg-black text-white",
  PREFERRED: "bg-gray-700 text-white",
  VIP: "bg-gray-500 text-white",
};

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

const statusIcons = {
  pending: <AlertCircle size={14} />,
  in_progress: <Clock size={14} />,
  done: <CheckCircle size={14} />,
};

export default function VIPTouchpoints() {
  const [expandedId, setExpandedId] = useState<string | null>(mockVIPs[0].id);

  return (
    <Card>
      <CardHeader
        title="VIP Arrivals & Touchpoints"
        action={
          <span className="text-[13px] text-gray-500">
            {mockVIPs.length} VIPs arriving today
          </span>
        }
      />
      <CardBody className="space-y-4">
        {mockVIPs.map((vip) => {
          const isExpanded = expandedId === vip.id;
          const pendingTasks = vip.touchpoints.filter((t) => t.status === "pending").length;
          const completedTasks = vip.touchpoints.filter((t) => t.status === "done").length;

          return (
            <div
              key={vip.id}
              className={`rounded-sm border transition-all ${
                isExpanded ? "border-gray-300 shadow-sm" : "border-gray-200"
              }`}
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : vip.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-[15px] font-semibold text-gray-600">
                      {vip.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-semibold text-black">
                          {vip.name}
                        </span>
                        <span className={`rounded-sm px-2 py-0.5 text-[11px] font-semibold ${tierColors[vip.tier]}`}>
                          {vip.tier}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {vip.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {vip.arrivalTime}
                        </span>
                        <span>{vip.stayCount} stays</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Communication badges */}
                    <div className="flex items-center gap-2 text-[12px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={12} />
                        {vip.communications.emails}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {vip.communications.calls}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={12} />
                        {vip.communications.chats}
                      </span>
                    </div>

                    {/* Task progress */}
                    <div className="flex items-center gap-2">
                      {pendingTasks > 0 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          {pendingTasks} pending
                        </span>
                      )}
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                        {completedTasks}/{vip.touchpoints.length} done
                      </span>
                    </div>

                    {isExpanded ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Quick intel preview */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {vip.occasion && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[12px] text-amber-700">
                      <Gift size={12} />
                      {vip.occasion}
                    </span>
                  )}
                  {vip.dietary?.map((d) => (
                    <span
                      key={d}
                      className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[12px] text-green-700"
                    >
                      <Utensils size={12} />
                      {d}
                    </span>
                  ))}
                  {vip.preferences?.slice(0, 2).map((p) => (
                    <span
                      key={p}
                      className="flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-1 text-[12px] text-pink-700"
                    >
                      <Heart size={12} />
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <div className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Pre-Arrival Touchpoints
                  </div>
                  <div className="space-y-2">
                    {vip.touchpoints.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between rounded-sm bg-white border border-gray-100 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`rounded-sm p-1 ${statusColors[task.status]}`}>
                            {statusIcons[task.status]}
                          </span>
                          <div>
                            <div className="text-[14px] text-gray-800">
                              {task.task}
                            </div>
                            <div className="text-[12px] text-gray-500">
                              {task.department}
                              {task.assignedTo && ` • ${task.assignedTo}`}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`rounded-sm px-2 py-0.5 text-[11px] font-medium ${statusColors[task.status]}`}
                        >
                          {task.status === "in_progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* All preferences */}
                  {vip.requests && vip.requests.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        Service Requests
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {vip.requests.map((req) => (
                          <span
                            key={req}
                            className="rounded-full bg-purple-50 px-2.5 py-1 text-[12px] text-purple-700"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
