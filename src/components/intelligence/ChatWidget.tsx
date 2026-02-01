"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, RefreshCw } from "lucide-react";

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

interface ChatWidgetProps {
  onNewIntel?: (intel: IntelRecord) => void;
}

export default function ChatWidget({ onNewIntel }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [records, setRecords] = useState<IntelRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/intelligence?recent=60");
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch intelligence:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
      // Poll for updates every 10 seconds
      const interval = setInterval(fetchRecords, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen, fetchRecords]);

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          staffName: "Dashboard User",
          useMock: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("");
        // Add to list immediately
        setRecords((prev) => [data.data, ...prev]);
        onNewIntel?.(data.data);
      }
    } catch (error) {
      console.error("Failed to send:", error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all ${
          isOpen ? "bg-gray-800" : "bg-black hover:bg-gray-800"
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
        {records.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
            {records.length > 9 ? "9+" : records.length}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 rounded-sm border border-gray-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900">
                Staff Intelligence Feed
              </h3>
              <p className="text-[12px] text-gray-500">
                {records.length} notes in last hour
              </p>
            </div>
            <button
              onClick={fetchRecords}
              disabled={loading}
              className="rounded-sm p-1.5 text-gray-500 hover:bg-gray-200"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Messages */}
          <div className="max-h-80 overflow-y-auto p-3 space-y-3">
            {records.length === 0 ? (
              <div className="py-8 text-center text-[14px] text-gray-400">
                No recent intelligence captured.
                <br />
                Send a note below or via Telegram.
              </div>
            ) : (
              records.map((record) => (
                <div
                  key={record.id}
                  className="rounded-sm border border-gray-100 bg-gray-50 p-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-[14px] font-semibold text-gray-900">
                      {record.guestName}
                      {record.roomNumber && (
                        <span className="ml-2 text-[13px] font-normal text-gray-500">
                          Room {record.roomNumber}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400">
                      {formatTime(record.capturedAt)}
                    </span>
                  </div>

                  <div className="space-y-1 text-[13px]">
                    {record.occasion && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-600">Occasion:</span>
                        <span className="text-gray-700">{record.occasion}</span>
                      </div>
                    )}
                    {record.dietary && record.dietary.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-green-600">Dietary:</span>
                        <span className="text-gray-700">
                          {record.dietary.join(", ")}
                        </span>
                      </div>
                    )}
                    {record.preferences && record.preferences.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-blue-600">Preferences:</span>
                        <span className="text-gray-700">
                          {record.preferences.join(", ")}
                        </span>
                      </div>
                    )}
                    {record.requests && record.requests.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-purple-600">Requests:</span>
                        <span className="text-gray-700">
                          {record.requests.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-[11px] text-gray-400">
                    Captured by {record.capturedBy}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder='e.g., "Mr. Chen 412 - birthday, vegetarian"'
                className="flex-1 rounded-sm border border-gray-200 px-3 py-2 text-[14px] focus:border-gray-400 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || sending}
                className="rounded-sm bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:bg-gray-300"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
