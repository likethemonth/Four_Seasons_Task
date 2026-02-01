"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import {
  Mail,
  Phone,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
  Paperclip,
  Star,
  AlertCircle,
} from "lucide-react";

type CommunicationType = "email" | "call" | "chat" | "note";

interface Communication {
  id: string;
  type: CommunicationType;
  subject: string;
  summary: string;
  fullContent?: string;
  from: string;
  to?: string;
  timestamp: Date;
  duration?: string; // for calls
  sentiment?: "positive" | "neutral" | "negative";
  actionItems?: string[];
  attachments?: string[];
  important?: boolean;
}

interface CommunicationLogProps {
  guestName?: string;
  roomNumber?: string;
}

// Mock data generator for communications
function generateMockCommunications(guestName: string): Communication[] {
  const now = new Date();
  const communications: Communication[] = [
    {
      id: "comm_1",
      type: "email",
      subject: "RE: Reservation Confirmation - Suite 412",
      summary: "Guest confirmed arrival time and requested early check-in if possible. Mentioned celebrating wife's birthday.",
      fullContent: `Dear Four Seasons Team,

Thank you for the confirmation. We are looking forward to our stay.

A few requests:
1. If possible, we would appreciate early check-in around 1pm
2. This trip is to celebrate my wife's 40th birthday - would love any special touches you can arrange
3. She is vegetarian - please note for any F&B recommendations

We will be arriving by private car from the airport.

Best regards,
${guestName}`,
      from: guestName,
      to: "reservations@fourseasons.com",
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      sentiment: "positive",
      actionItems: ["Arrange early check-in", "Birthday amenity", "Note vegetarian preference"],
      important: true,
    },
    {
      id: "comm_2",
      type: "call",
      subject: "Pre-arrival call with guest",
      summary: "Confirmed preferences: high floor, quiet room, spa appointment interest. Guest mentioned wife loves peonies.",
      from: "Maria Santos (Front Office)",
      to: guestName,
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      duration: "8 min",
      sentiment: "positive",
      actionItems: ["Book spa appointment", "Request peonies for room", "Assign high floor room"],
    },
    {
      id: "comm_3",
      type: "email",
      subject: "Spa Appointment Confirmation",
      summary: "Confirmed couples massage for Saturday 3pm. Noted nut allergy for aromatherapy oils.",
      fullContent: `Dear ${guestName},

Thank you for booking with Four Seasons Spa.

Your appointment details:
- Service: Couples Relaxation Massage (90 min)
- Date: Saturday, February 15th
- Time: 3:00 PM
- Therapists: Elena & Marcus

We have noted the nut allergy and will use alternative oils.

Please arrive 15 minutes early to enjoy our relaxation lounge.

Warm regards,
Four Seasons Spa Team`,
      from: "spa@fourseasons.com",
      to: guestName,
      timestamp: new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000),
      sentiment: "positive",
      attachments: ["spa_menu.pdf"],
    },
    {
      id: "comm_4",
      type: "chat",
      subject: "WhatsApp inquiry about late dining",
      summary: "Guest asked about late dinner options after 10pm. Recommended private dining or room service.",
      from: guestName,
      to: "Concierge WhatsApp",
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      sentiment: "neutral",
      actionItems: ["Follow up on dining preference"],
    },
    {
      id: "comm_5",
      type: "note",
      subject: "Internal note from reservation team",
      summary: "High-value repeat guest (12th stay). Previous feedback mentioned appreciating personalized service. Last stay noted minor issue with room temperature.",
      from: "System (Guest History)",
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      sentiment: "neutral",
      important: true,
    },
  ];

  return communications;
}

const typeIcons: Record<CommunicationType, React.ReactNode> = {
  email: <Mail size={16} />,
  call: <Phone size={16} />,
  chat: <MessageSquare size={16} />,
  note: <FileText size={16} />,
};

const typeColors: Record<CommunicationType, string> = {
  email: "bg-blue-100 text-blue-700",
  call: "bg-green-100 text-green-700",
  chat: "bg-purple-100 text-purple-700",
  note: "bg-gray-100 text-gray-600",
};

const sentimentColors: Record<string, string> = {
  positive: "text-green-600",
  neutral: "text-gray-500",
  negative: "text-red-600",
};

export default function CommunicationLog({
  guestName = "Mr. Chen",
}: CommunicationLogProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<CommunicationType | "all">("all");

  const communications = generateMockCommunications(guestName);

  const filtered =
    filter === "all"
      ? communications
      : communications.filter((c) => c.type === filter);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card>
      <CardHeader
        title="Communication History"
        action={
          <div className="flex items-center gap-2">
            {(["all", "email", "call", "chat", "note"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`rounded-sm px-2 py-1 text-[12px] font-medium transition-colors ${
                  filter === type
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        }
      />
      <CardBody className="max-h-[600px] overflow-y-auto">
        <div className="space-y-3">
          {filtered.map((comm) => {
            const isExpanded = expandedId === comm.id;
            return (
              <div
                key={comm.id}
                className={`rounded-sm border transition-all ${
                  isExpanded
                    ? "border-gray-300 shadow-sm"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                {/* Header - always visible */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : comm.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-sm p-1.5 ${typeColors[comm.type]}`}
                      >
                        {typeIcons[comm.type]}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-semibold text-gray-900">
                            {comm.subject}
                          </span>
                          {comm.important && (
                            <Star
                              size={14}
                              className="text-amber-500 fill-amber-500"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-gray-500">
                          <User size={12} />
                          <span>{comm.from}</span>
                          {comm.duration && (
                            <>
                              <span>•</span>
                              <Clock size={12} />
                              <span>{comm.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-400">
                        {formatDate(comm.timestamp)} {formatTime(comm.timestamp)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  <p className="text-[13px] text-gray-600 line-clamp-2">
                    {comm.summary}
                  </p>

                  {/* Action items preview */}
                  {comm.actionItems && comm.actionItems.length > 0 && !isExpanded && (
                    <div className="mt-2 flex items-center gap-1">
                      <AlertCircle size={12} className="text-amber-500" />
                      <span className="text-[11px] text-amber-600">
                        {comm.actionItems.length} action item
                        {comm.actionItems.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-4">
                    {/* Full content */}
                    {comm.fullContent && (
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                          Full Message
                        </div>
                        <div className="rounded-sm bg-white border border-gray-200 p-3 text-[13px] text-gray-700 whitespace-pre-wrap">
                          {comm.fullContent}
                        </div>
                      </div>
                    )}

                    {/* Action items */}
                    {comm.actionItems && comm.actionItems.length > 0 && (
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                          Action Items
                        </div>
                        <div className="space-y-1">
                          {comm.actionItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-[13px]"
                            >
                              <input
                                type="checkbox"
                                className="rounded-sm"
                                defaultChecked={false}
                              />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attachments */}
                    {comm.attachments && comm.attachments.length > 0 && (
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                          Attachments
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {comm.attachments.map((file, idx) => (
                            <span
                              key={idx}
                              className="flex items-center gap-1.5 rounded-sm bg-white border border-gray-200 px-2 py-1 text-[12px] text-gray-600"
                            >
                              <Paperclip size={12} />
                              {file}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sentiment */}
                    {comm.sentiment && (
                      <div className="flex items-center gap-2 text-[12px]">
                        <span className="text-gray-500">Sentiment:</span>
                        <span
                          className={`font-medium ${
                            sentimentColors[comm.sentiment]
                          }`}
                        >
                          {comm.sentiment.charAt(0).toUpperCase() +
                            comm.sentiment.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
