"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import {
  Clock,
  MapPin,
  AlertTriangle,
  Heart,
  Utensils,
  ChevronDown,
  ChevronUp,
  UtensilsCrossed,
  Sparkles,
  Dumbbell,
  LogOut,
  Headphones,
  Lightbulb,
} from "lucide-react";

interface ServicePrediction {
  service: string;
  usage: "heavy" | "moderate" | "light" | "none";
  detail: string;
  icon: React.ReactNode;
}

interface StaffingImplication {
  department: string;
  action: string;
}

interface VIPGuest {
  id: string;
  name: string;
  initials: string;
  stayCount: number;
  arrivalTime: string;
  room: string;
  tier: "ELITE" | "PREFERRED" | "VIP";
  specialRequests: string[];
  preferences: {
    dietary?: string;
    roomPreferences?: string[];
    pastComplaints?: string;
    accessibility?: string;
  };
  spendHistory: {
    avgPerStay: number;
    topCategory: string;
  };
  servicePredictions: ServicePrediction[];
  staffingImplications: StaffingImplication[];
}

const tierColors = {
  ELITE: "bg-black text-white",
  PREFERRED: "bg-gray-800 text-white",
  VIP: "bg-gray-600 text-white",
};

const usageColors = {
  heavy: "text-green-700 bg-green-50",
  moderate: "text-blue-700 bg-blue-50",
  light: "text-gray-600 bg-gray-100",
  none: "text-gray-400 bg-gray-50",
};

const usageLabels = {
  heavy: "High",
  moderate: "Moderate",
  light: "Low",
  none: "None",
};

interface VIPArrivalsProps {
  selectedDate: Date;
}

function generateVIPGuests(date: Date): VIPGuest[] {
  const dateNum = date.getDate();
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Vary arrival times based on date
  const baseGuests: VIPGuest[] = [
    {
      id: "1",
      name: "John Chen",
      initials: "JC",
      stayCount: 12 + (dateNum % 3),
      arrivalTime: `${13 + (dateNum % 3)}:00`,
      room: `Suite ${800 + (dateNum % 5)}`,
      tier: "PREFERRED",
      specialRequests: ["Early check-in", "Champagne on arrival"],
      preferences: {
        dietary: "Dairy-free",
        roomPreferences: ["High floor", "City view"],
      },
      spendHistory: {
        avgPerStay: 2840 + (dateNum * 50),
        topCategory: "Room Service",
      },
      servicePredictions: [
        { service: "F&B", usage: "heavy", detail: "Ordered room service 80% of stays", icon: <UtensilsCrossed size={14} /> },
        { service: "Spa", usage: "none", detail: "No spa bookings in history", icon: <Sparkles size={14} /> },
        { service: "Gym", usage: "heavy", detail: "Morning user (6-7am)", icon: <Dumbbell size={14} /> },
        { service: "Checkout", usage: "light", detail: "Early pattern (avg 6:30am)", icon: <LogOut size={14} /> },
        { service: "Concierge", usage: "light", detail: "Low usage", icon: <Headphones size={14} /> },
      ],
      staffingImplications: [
        { department: "Room Service", action: "Include in evening demand forecast" },
        { department: "Housekeeping", action: "Early turnover likely" },
        { department: "Kitchen", action: "Dairy-free prep required" },
        { department: "Gym", action: "Morning attendant coverage" },
      ],
    },
    {
      id: "2",
      name: "Sarah Mitchell",
      initials: "SM",
      stayCount: 8 + (dateNum % 4),
      arrivalTime: `${14 + (dateNum % 4)}:30`,
      room: `Suite ${1200 + (dateNum % 10)}`,
      tier: "VIP",
      specialRequests: ["Airport transfer arranged", `Spa appointment ${15 + (dateNum % 4)}pm`],
      preferences: {
        roomPreferences: ["Quiet room", "Extra pillows"],
      },
      spendHistory: {
        avgPerStay: 3200 + (dateNum * 40),
        topCategory: "Spa",
      },
      servicePredictions: [
        { service: "F&B", usage: "moderate", detail: "Restaurant dining 60% of stays", icon: <UtensilsCrossed size={14} /> },
        { service: "Spa", usage: "heavy", detail: "Booked spa 90% of stays", icon: <Sparkles size={14} /> },
        { service: "Gym", usage: "moderate", detail: "Afternoon user", icon: <Dumbbell size={14} /> },
        { service: "Checkout", usage: "moderate", detail: "Standard checkout (11am)", icon: <LogOut size={14} /> },
        { service: "Concierge", usage: "moderate", detail: "Regular requests", icon: <Headphones size={14} /> },
      ],
      staffingImplications: [
        { department: "Spa", action: "Premium therapist availability" },
        { department: "F&B", action: "Restaurant reservation priority" },
        { department: "Housekeeping", action: "Standard turnover schedule" },
      ],
    },
    {
      id: "3",
      name: "Robert Kim",
      initials: "RK",
      stayCount: 22 + (dateNum % 5),
      arrivalTime: `${15 + (dateNum % 3)}:00`,
      room: "Presidential",
      tier: "ELITE",
      specialRequests: ["GM welcome", `Private dining ${19 + (dateNum % 2)}pm`],
      preferences: {
        dietary: "Pescatarian",
        roomPreferences: ["Same room as previous"],
        pastComplaints: "Noise issue - Jun 2025",
      },
      spendHistory: {
        avgPerStay: 8500 + (dateNum * 100),
        topCategory: "F&B",
      },
      servicePredictions: [
        { service: "F&B", usage: "heavy", detail: "Private dining 95% of stays", icon: <UtensilsCrossed size={14} /> },
        { service: "Spa", usage: "light", detail: "Occasional massage booking", icon: <Sparkles size={14} /> },
        { service: "Gym", usage: "none", detail: "No gym usage", icon: <Dumbbell size={14} /> },
        { service: "Checkout", usage: "heavy", detail: "Late checkout (2pm+)", icon: <LogOut size={14} /> },
        { service: "Concierge", usage: "heavy", detail: "High-touch guest", icon: <Headphones size={14} /> },
      ],
      staffingImplications: [
        { department: "F&B", action: "Executive chef attention for private dining" },
        { department: "Kitchen", action: "Pescatarian menu preparation" },
        { department: "Concierge", action: "Dedicated concierge assignment" },
        { department: "Housekeeping", action: "Late turnover, noise-sensitive room" },
        { department: "Management", action: "GM welcome scheduled" },
      ],
    },
  ];

  // Add extra guests on weekends
  if (isWeekend) {
    baseGuests.push({
      id: "4",
      name: "Amanda Li",
      initials: "AL",
      stayCount: 5 + (dateNum % 3),
      arrivalTime: `${17 + (dateNum % 2)}:00`,
      room: `Suite ${600 + (dateNum % 8)}`,
      tier: "PREFERRED",
      specialRequests: ["Late check-out pre-approved"],
      preferences: {
        dietary: "Vegan",
      },
      spendHistory: {
        avgPerStay: 1950 + (dateNum * 30),
        topCategory: "Restaurant",
      },
      servicePredictions: [
        { service: "F&B", usage: "moderate", detail: "Restaurant focused, minimal room service", icon: <UtensilsCrossed size={14} /> },
        { service: "Spa", usage: "moderate", detail: "Booked spa 40% of stays", icon: <Sparkles size={14} /> },
        { service: "Gym", usage: "heavy", detail: "Daily yoga studio user", icon: <Dumbbell size={14} /> },
        { service: "Checkout", usage: "heavy", detail: "Late checkout pattern (2pm)", icon: <LogOut size={14} /> },
        { service: "Concierge", usage: "light", detail: "Low usage", icon: <Headphones size={14} /> },
      ],
      staffingImplications: [
        { department: "Kitchen", action: "Vegan options available" },
        { department: "Housekeeping", action: "Late turnover required" },
        { department: "Gym", action: "Yoga studio morning availability" },
      ],
    });
    baseGuests.push({
      id: "5",
      name: "Michael Torres",
      initials: "MT",
      stayCount: 15 + (dateNum % 4),
      arrivalTime: `${19 + (dateNum % 2)}:00`,
      room: `Suite ${900 + (dateNum % 12)}`,
      tier: "ELITE",
      specialRequests: ["Business center access", "Morning car service"],
      preferences: {
        roomPreferences: ["Corner room", "Desk setup"],
      },
      spendHistory: {
        avgPerStay: 4200 + (dateNum * 60),
        topCategory: "Room Service",
      },
      servicePredictions: [
        { service: "F&B", usage: "heavy", detail: "Room service 85% of stays", icon: <UtensilsCrossed size={14} /> },
        { service: "Spa", usage: "none", detail: "No spa history", icon: <Sparkles size={14} /> },
        { service: "Gym", usage: "moderate", detail: "Evening user (7-8pm)", icon: <Dumbbell size={14} /> },
        { service: "Checkout", usage: "light", detail: "Early checkout (6am flights)", icon: <LogOut size={14} /> },
        { service: "Concierge", usage: "heavy", detail: "Business services focused", icon: <Headphones size={14} /> },
      ],
      staffingImplications: [
        { department: "Room Service", action: "Late evening availability" },
        { department: "Housekeeping", action: "Early turnover (6am checkout)" },
        { department: "Concierge", action: "Business center support" },
        { department: "Transport", action: "Morning car service confirmed" },
      ],
    });
  }

  return baseGuests;
}

export default function VIPArrivals({ selectedDate }: VIPArrivalsProps) {
  const vipGuests = generateVIPGuests(selectedDate);
  const [expandedGuestId, setExpandedGuestId] = useState<string | null>(null);

  const toggleExpand = (guestId: string) => {
    setExpandedGuestId(expandedGuestId === guestId ? null : guestId);
  };

  return (
    <Card>
      <CardHeader title="VIP Arrivals Today" action={`View All ${vipGuests.length + 10}`} />
      <CardBody className="space-y-4 max-h-[600px] overflow-y-auto">
        {vipGuests.map((guest) => {
          const isExpanded = expandedGuestId === guest.id;
          return (
            <div
              key={guest.id}
              className={`rounded-sm border transition-all duration-200 ${
                isExpanded ? "border-gray-400 shadow-sm" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Clickable Header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => toggleExpand(guest.id)}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-[15px] font-semibold text-gray-600">
                      {guest.initials}
                    </div>
                    <div>
                      <div className="text-[16px] font-semibold text-black">{guest.name}</div>
                      <div className="text-[14px] text-gray-500">
                        {guest.stayCount} stays across network
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-sm px-2.5 py-1 text-[11px] font-semibold tracking-wide ${tierColors[guest.tier]}`}>
                      {guest.tier}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-[14px]">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock size={14} />
                    <span>Arrival: {guest.arrivalTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <MapPin size={14} />
                    <span>{guest.room}</span>
                  </div>
                </div>

                {/* Special Requests */}
                {guest.specialRequests.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {guest.specialRequests.map((request, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-amber-50 px-3 py-1 text-[13px] text-amber-700"
                        >
                          {request}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferences & Alerts */}
                <div className="flex flex-wrap gap-3 text-[13px]">
                  {guest.preferences.dietary && (
                    <div className="flex items-center gap-1.5 text-green-700">
                      <Utensils size={14} />
                      {guest.preferences.dietary}
                    </div>
                  )}
                  {guest.preferences.pastComplaints && (
                    <div className="flex items-center gap-1.5 text-red-600">
                      <AlertTriangle size={14} />
                      {guest.preferences.pastComplaints}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Heart size={14} />
                    Avg £{guest.spendHistory.avgPerStay.toLocaleString()}/stay
                  </div>
                </div>
              </div>

              {/* Expanded Guest Profile Section */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-5 space-y-5">
                  {/* Service Predictions */}
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
                      Service Predictions
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {guest.servicePredictions.map((prediction) => (
                        <div
                          key={prediction.service}
                          className="flex items-center justify-between bg-white rounded-sm p-3 border border-gray-100"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">{prediction.icon}</span>
                            <span className="text-[14px] font-semibold text-gray-700">
                              {prediction.service}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[13px] text-gray-500">
                              {prediction.detail}
                            </span>
                            <span className={`text-[12px] font-semibold px-2 py-0.5 rounded ${usageColors[prediction.usage]}`}>
                              {usageLabels[prediction.usage]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Room Preferences */}
                  {guest.preferences.roomPreferences && guest.preferences.roomPreferences.length > 0 && (
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
                        Room Preferences
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {guest.preferences.roomPreferences.map((pref, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-white border border-gray-200 px-3 py-1 text-[13px] text-gray-600"
                          >
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Staffing Implications */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
                      <Lightbulb size={14} />
                      Staffing Implications
                    </div>
                    <div className="space-y-2">
                      {guest.staffingImplications.map((implication, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-[14px]"
                        >
                          <span className="font-semibold text-gray-700 min-w-[110px]">
                            {implication.department}:
                          </span>
                          <span className="text-gray-600">{implication.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
