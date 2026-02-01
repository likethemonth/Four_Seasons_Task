"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import {
  Send,
  MessageSquare,
  Phone,
  Mail,
  Mic,
  Loader2,
  CheckCircle,
} from "lucide-react";

type CaptureType = "note" | "call" | "email";

interface QuickCaptureProps {
  onCapture?: (data: {
    type: CaptureType;
    message: string;
    guestName?: string;
    roomNumber?: string;
  }) => void;
}

export default function QuickCapture({ onCapture }: QuickCaptureProps) {
  const [type, setType] = useState<CaptureType>("note");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          staffName: `Dashboard (${type})`,
          useMock: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onCapture?.({
          type,
          message: message.trim(),
          guestName: data.data.guestName,
          roomNumber: data.data.roomNumber,
        });
        setMessage("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Failed to capture:", error);
    } finally {
      setSending(false);
    }
  };

  const placeholders: Record<CaptureType, string> = {
    note: 'Quick note: "Mr. Chen 412 - wife\'s birthday, loves peonies, vegetarian"',
    call: 'Call summary: "Spoke with Mrs. Tanaka 508 - confirmed spa at 3pm, mentioned nut allergy"',
    email: 'Email summary: "Guest requested early check-in, celebrating anniversary"',
  };

  const typeButtons: { type: CaptureType; icon: React.ReactNode; label: string }[] = [
    { type: "note", icon: <MessageSquare size={16} />, label: "Note" },
    { type: "call", icon: <Phone size={16} />, label: "Call" },
    { type: "email", icon: <Mail size={16} />, label: "Email" },
  ];

  return (
    <Card>
      <CardHeader title="Quick Capture" />
      <CardBody>
        {/* Type selector */}
        <div className="flex gap-2 mb-4">
          {typeButtons.map((btn) => (
            <button
              key={btn.type}
              onClick={() => setType(btn.type)}
              className={`flex items-center gap-2 rounded-sm px-4 py-2 text-[13px] font-medium transition-all ${
                type === btn.type
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholders[type]}
            className="w-full h-24 rounded-sm border border-gray-200 p-3 text-[14px] resize-none focus:border-gray-400 focus:outline-none"
          />
          {/* Voice input hint */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-gray-400">
            <Mic size={12} />
            <span>Voice transcription coming soon</span>
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[12px] text-gray-500">
            AI will extract: guest name, room, occasion, dietary, preferences
          </div>
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || sending}
            className={`flex items-center gap-2 rounded-sm px-4 py-2 text-[14px] font-medium text-white transition-all ${
              success
                ? "bg-green-600"
                : sending
                ? "bg-gray-400"
                : "bg-black hover:bg-gray-800"
            } disabled:bg-gray-300`}
          >
            {success ? (
              <>
                <CheckCircle size={16} />
                Captured
              </>
            ) : sending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Send size={16} />
                Capture Intel
              </>
            )}
          </button>
        </div>
      </CardBody>
    </Card>
  );
}
