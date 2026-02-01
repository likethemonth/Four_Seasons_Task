"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import {
  MessageSquare,
  Gift,
  Utensils,
  Heart,
  Bell,
  RefreshCw,
  Clock,
  User,
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

interface IntelligenceFeedProps {
  onSelectGuest?: (guestName: string, roomNumber: string) => void;
  maxItems?: number;
}

export default function IntelligenceFeed({
  onSelectGuest,
  maxItems = 10,
}: IntelligenceFeedProps) {
  const [records, setRecords] = useState<IntelRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch(`/api/intelligence?limit=${maxItems}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch intelligence:", error);
    } finally {
      setLoading(false);
    }
  }, [maxItems]);

  useEffect(() => {
    fetchRecords();
    const interval = setInterval(fetchRecords, 10000);
    return () => clearInterval(interval);
  }, [fetchRecords]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader
        title="Staff Intelligence Feed"
        action={
          <button
            onClick={fetchRecords}
            className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-gray-700"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        }
      />
      <CardBody className="max-h-[500px] overflow-y-auto">
        {records.length === 0 ? (
          <div className="py-8 text-center">
            <MessageSquare size={32} className="mx-auto mb-3 text-gray-300" />
            <div className="text-[14px] text-gray-500">
              No intelligence captured yet.
            </div>
            <div className="text-[13px] text-gray-400 mt-1">
              Use the chat widget or Telegram to add staff notes.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                onClick={() =>
                  onSelectGuest?.(record.guestName, record.roomNumber)
                }
                className="rounded-sm border border-gray-100 p-4 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[15px] font-semibold text-gray-900">
                      {record.guestName}
                    </span>
                    {record.roomNumber && (
                      <span className="ml-2 rounded-sm bg-gray-100 px-2 py-0.5 text-[12px] text-gray-600">
                        Room {record.roomNumber}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock size={12} />
                    {formatTime(record.capturedAt)}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5 text-[13px]">
                  {record.occasion && (
                    <div className="flex items-center gap-2">
                      <Gift size={14} className="text-amber-500" />
                      <span className="text-gray-700">{record.occasion}</span>
                    </div>
                  )}
                  {record.dietary && record.dietary.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Utensils size={14} className="text-green-600" />
                      <span className="text-gray-700">
                        {record.dietary.join(", ")}
                      </span>
                    </div>
                  )}
                  {record.preferences && record.preferences.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Heart size={14} className="text-pink-500" />
                      <span className="text-gray-700">
                        {record.preferences.join(", ")}
                      </span>
                    </div>
                  )}
                  {record.requests && record.requests.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-purple-500" />
                      <span className="text-gray-700">
                        {record.requests.join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1 text-[11px] text-gray-400">
                  <User size={12} />
                  {record.capturedBy}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
