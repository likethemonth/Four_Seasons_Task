"use client";

import { MessageSquare, Gift, Utensils, Heart, Bell } from "lucide-react";

interface GuestIntelligence {
  id: string;
  guestName: string;
  roomNumber: string;
  occasion?: string;
  dietary?: string[];
  preferences?: string[];
  requests?: string[];
  capturedBy: string;
  capturedAt: string | Date;
  confidence: number;
}

interface GuestIntelCardProps {
  intel: GuestIntelligence[];
}

export default function GuestIntelCard({ intel }: GuestIntelCardProps) {
  if (intel.length === 0) {
    return null;
  }

  const formatTime = (dateInput: string | Date) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Merge multiple intel records into a unified view
  const merged = {
    occasions: new Set<string>(),
    dietary: new Set<string>(),
    preferences: new Set<string>(),
    requests: new Set<string>(),
    sources: [] as { by: string; at: string | Date }[],
  };

  for (const record of intel) {
    if (record.occasion) merged.occasions.add(record.occasion);
    record.dietary?.forEach((d) => merged.dietary.add(d));
    record.preferences?.forEach((p) => merged.preferences.add(p));
    record.requests?.forEach((r) => merged.requests.add(r));
    merged.sources.push({ by: record.capturedBy, at: record.capturedAt });
  }

  return (
    <div className="mt-4 rounded-sm bg-gray-50 border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={16} className="text-gray-700" />
        <span className="text-[13px] font-semibold uppercase tracking-wider text-gray-700">
          Captured Intelligence
        </span>
      </div>

      <div className="space-y-3">
        {merged.occasions.size > 0 && (
          <div className="flex items-start gap-2">
            <Gift size={14} className="mt-0.5 text-gray-600" />
            <div>
              <div className="text-[12px] font-semibold text-gray-500 mb-1">
                Occasion
              </div>
              <div className="text-[14px] text-gray-800">
                {Array.from(merged.occasions).join(", ")}
              </div>
            </div>
          </div>
        )}

        {merged.dietary.size > 0 && (
          <div className="flex items-start gap-2">
            <Utensils size={14} className="mt-0.5 text-gray-600" />
            <div>
              <div className="text-[12px] font-semibold text-gray-500 mb-1">
                Dietary Requirements
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(merged.dietary).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-[12px] text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {merged.preferences.size > 0 && (
          <div className="flex items-start gap-2">
            <Heart size={14} className="mt-0.5 text-gray-600" />
            <div>
              <div className="text-[12px] font-semibold text-gray-500 mb-1">
                Preferences
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(merged.preferences).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-[12px] text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {merged.requests.size > 0 && (
          <div className="flex items-start gap-2">
            <Bell size={14} className="mt-0.5 text-gray-600" />
            <div>
              <div className="text-[12px] font-semibold text-gray-500 mb-1">
                Service Requests
              </div>
              <div className="text-[14px] text-gray-800">
                {Array.from(merged.requests).join("; ")}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Source attribution */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-[11px] text-gray-500">
          {merged.sources.map((source, idx) => (
            <span key={idx}>
              {idx > 0 && " • "}
              Captured by {source.by}, {formatTime(source.at)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
