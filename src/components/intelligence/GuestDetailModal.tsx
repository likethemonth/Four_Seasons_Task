"use client";

import { useState, useEffect } from "react";
import {
  X,
  Crown,
  Clock,
  MapPin,
  Gift,
  Utensils,
  Heart,
  Bell,
  MessageSquare,
  User,
  Calendar,
  Star,
  AlertTriangle,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

interface IntelRecord {
  id: string;
  guestName: string;
  roomNumber: string;
  occasion?: string;
  dietary?: string[];
  preferences?: string[];
  requests?: string[];
  capturedBy: string;
  capturedAt: string;
  confidence: number;
}

interface GuestData {
  name: string;
  loyalty: string;
  vip?: boolean;
  arrival: string;
  departure: string;
  room?: string;
  segments: string[];
  preds: {
    fnbDinnerCovers?: number;
    irdP?: number;
    spaP?: number;
    earlyCheckoutP?: number;
    dietary?: string;
  };
}

interface GuestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: GuestData | null;
  roomNumber?: string;
}

const tierColors: Record<string, string> = {
  ELITE: "bg-black text-white",
  PREFERRED: "bg-gray-700 text-white",
  VIP: "bg-gray-500 text-white",
  FIRST: "bg-gray-200 text-gray-700",
};

export default function GuestDetailModal({
  isOpen,
  onClose,
  guest,
  roomNumber,
}: GuestDetailModalProps) {
  const [intel, setIntel] = useState<IntelRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && (guest?.name || roomNumber)) {
      setLoading(true);
      const searchParam = roomNumber || guest?.name || "";
      fetch(`/api/intelligence/${encodeURIComponent(searchParam)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIntel(data.data);
          } else {
            setIntel([]);
          }
        })
        .catch(() => setIntel([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, guest?.name, roomNumber]);

  if (!isOpen || !guest) return null;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Merge all intelligence into summary
  const mergedIntel = {
    occasions: new Set<string>(),
    dietary: new Set<string>(),
    preferences: new Set<string>(),
    requests: new Set<string>(),
  };

  intel.forEach((record) => {
    if (record.occasion) mergedIntel.occasions.add(record.occasion);
    record.dietary?.forEach((d) => mergedIntel.dietary.add(d));
    record.preferences?.forEach((p) => mergedIntel.preferences.add(p));
    record.requests?.forEach((r) => mergedIntel.requests.add(r));
  });

  // Also add guest's existing dietary from predictions
  if (guest.preds.dietary) {
    mergedIntel.dietary.add(guest.preds.dietary);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-[20px] font-semibold text-gray-600">
              {guest.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[22px] font-semibold text-black">
                  {guest.name}
                </h2>
                {guest.vip && <Crown size={18} className="text-amber-500" />}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`rounded-sm px-2 py-0.5 text-[11px] font-semibold ${
                    tierColors[guest.loyalty] || tierColors.FIRST
                  }`}
                >
                  {guest.loyalty}
                </span>
                {roomNumber && (
                  <span className="flex items-center gap-1 text-[13px] text-gray-500">
                    <MapPin size={14} />
                    Room {roomNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stay Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-sm border border-gray-200 p-4">
              <div className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Arrival
              </div>
              <div className="flex items-center gap-2 text-[15px] text-gray-800">
                <Calendar size={16} className="text-gray-400" />
                {guest.arrival}
              </div>
            </div>
            <div className="rounded-sm border border-gray-200 p-4">
              <div className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Departure
              </div>
              <div className="flex items-center gap-2 text-[15px] text-gray-800">
                <Calendar size={16} className="text-gray-400" />
                {guest.departure}
              </div>
            </div>
          </div>

          {/* Segments */}
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Guest Segments
            </div>
            <div className="flex flex-wrap gap-2">
              {guest.segments.map((seg) => (
                <span
                  key={seg}
                  className="rounded-full bg-gray-100 px-3 py-1 text-[13px] text-gray-700"
                >
                  {seg.replaceAll("_", " ")}
                </span>
              ))}
            </div>
          </div>

          {/* Captured Intelligence */}
          {(intel.length > 0 ||
            mergedIntel.occasions.size > 0 ||
            mergedIntel.dietary.size > 0 ||
            mergedIntel.preferences.size > 0 ||
            mergedIntel.requests.size > 0) && (
            <div className="rounded-sm bg-blue-50 border border-blue-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={16} className="text-blue-600" />
                <span className="text-[13px] font-semibold uppercase tracking-wider text-blue-700">
                  Captured Intelligence
                </span>
                {intel.length > 0 && (
                  <span className="rounded-full bg-blue-200 px-2 py-0.5 text-[11px] text-blue-700">
                    {intel.length} note{intel.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {mergedIntel.occasions.size > 0 && (
                  <div className="flex items-start gap-3">
                    <Gift size={16} className="mt-0.5 text-amber-500" />
                    <div>
                      <div className="text-[12px] font-semibold text-gray-500 mb-1">
                        Special Occasion
                      </div>
                      <div className="text-[14px] text-gray-800">
                        {Array.from(mergedIntel.occasions).join(", ")}
                      </div>
                    </div>
                  </div>
                )}

                {mergedIntel.dietary.size > 0 && (
                  <div className="flex items-start gap-3">
                    <Utensils size={16} className="mt-0.5 text-green-600" />
                    <div>
                      <div className="text-[12px] font-semibold text-gray-500 mb-1">
                        Dietary Requirements
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(mergedIntel.dietary).map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-green-100 px-2.5 py-0.5 text-[12px] text-green-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {mergedIntel.preferences.size > 0 && (
                  <div className="flex items-start gap-3">
                    <Heart size={16} className="mt-0.5 text-pink-500" />
                    <div>
                      <div className="text-[12px] font-semibold text-gray-500 mb-1">
                        Preferences
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(mergedIntel.preferences).map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-pink-100 px-2.5 py-0.5 text-[12px] text-pink-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {mergedIntel.requests.size > 0 && (
                  <div className="flex items-start gap-3">
                    <Bell size={16} className="mt-0.5 text-purple-500" />
                    <div>
                      <div className="text-[12px] font-semibold text-gray-500 mb-1">
                        Service Requests
                      </div>
                      <div className="text-[14px] text-gray-800">
                        {Array.from(mergedIntel.requests).join("; ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Source attribution */}
              {intel.length > 0 && (
                <div className="mt-4 pt-3 border-t border-blue-200 space-y-1">
                  {intel.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center gap-2 text-[11px] text-gray-500"
                    >
                      <User size={12} />
                      <span>
                        {record.capturedBy} - {formatTime(record.capturedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Service Predictions */}
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Service Predictions
            </div>
            <div className="grid grid-cols-2 gap-3">
              {guest.preds.fnbDinnerCovers !== undefined && (
                <div className="flex items-center justify-between rounded-sm border border-gray-200 p-3">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed size={16} className="text-gray-400" />
                    <span className="text-[14px] text-gray-700">
                      Dinner Covers
                    </span>
                  </div>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {guest.preds.fnbDinnerCovers.toFixed(1)}
                  </span>
                </div>
              )}
              {guest.preds.irdP !== undefined && (
                <div className="flex items-center justify-between rounded-sm border border-gray-200 p-3">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed size={16} className="text-gray-400" />
                    <span className="text-[14px] text-gray-700">
                      Room Service
                    </span>
                  </div>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {Math.round(guest.preds.irdP * 100)}%
                  </span>
                </div>
              )}
              {guest.preds.spaP !== undefined && (
                <div className="flex items-center justify-between rounded-sm border border-gray-200 p-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-gray-400" />
                    <span className="text-[14px] text-gray-700">Spa Usage</span>
                  </div>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {Math.round(guest.preds.spaP * 100)}%
                  </span>
                </div>
              )}
              {guest.preds.earlyCheckoutP !== undefined && (
                <div className="flex items-center justify-between rounded-sm border border-gray-200 p-3">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-[14px] text-gray-700">
                      Early Checkout
                    </span>
                  </div>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {Math.round(guest.preds.earlyCheckoutP * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Staffing Implications */}
          <div>
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
              <AlertTriangle size={14} />
              Staffing Implications
            </div>
            <div className="space-y-2 text-[14px]">
              {guest.vip && (
                <div className="flex items-center gap-2 text-amber-700">
                  <Star size={14} />
                  VIP touchpoint required - ensure personalized welcome
                </div>
              )}
              {mergedIntel.dietary.size > 0 && (
                <div className="flex items-center gap-2 text-green-700">
                  <Utensils size={14} />
                  Kitchen alert: {Array.from(mergedIntel.dietary).join(", ")}
                </div>
              )}
              {mergedIntel.occasions.size > 0 && (
                <div className="flex items-center gap-2 text-amber-700">
                  <Gift size={14} />
                  Special occasion prep: {Array.from(mergedIntel.occasions).join(", ")}
                </div>
              )}
              {guest.preds.earlyCheckoutP && guest.preds.earlyCheckoutP > 0.5 && (
                <div className="flex items-center gap-2 text-blue-700">
                  <Clock size={14} />
                  Housekeeping: Likely early checkout - prioritize room turnover
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
