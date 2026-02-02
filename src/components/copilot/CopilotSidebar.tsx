"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useCopilot, type GuestContext, type RoomContext } from "@/context/CopilotContext";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  MessageSquare,
  Building2,
  Sparkles,
  Send,
  User,
  Star,
  Heart,
  AlertTriangle,
  Clock,
  TrendingUp,
  CheckCircle,
  Bed,
  Utensils,
  Mail,
  Phone,
  AlertCircle,
  Trash2,
  Loader2,
} from "lucide-react";

// Guest intelligence data type
interface GuestIntelligence {
  id: string;
  name: string;
  vipCode?: string;
  stayCount: number;
  confirmationNumber: string;
  arrivalDate: string;
  departureDate: string;
  roomType: string;
  assignedRoom?: string;
  occasion?: string;
  preferences: {
    room: string[];
    dining: string[];
    amenities: string[];
  };
  dietary: string[];
  communicationHistory: {
    type: "email" | "call" | "chat";
    date: string;
    summary: string;
    requests: string[];
  }[];
  stayPatterns: {
    avgNights: number;
    avgSpend: number;
    preferredRoomType: string;
    typicalRequests: string[];
  };
  riskSignals: {
    type: "warning" | "positive";
    message: string;
    date?: string;
  }[];
  predictedNeeds: string[];
  actionItems: {
    action: string;
    priority: "high" | "medium" | "low";
    assignedTo?: string;
  }[];
}

// Mock arrivals data
const mockArrivals: GuestIntelligence[] = [
  {
    id: "1",
    name: "Piper Kiser",
    vipCode: "VVIP",
    stayCount: 26,
    confirmationNumber: "83924751",
    arrivalDate: "2024-02-15",
    departureDate: "2024-02-18",
    roomType: "Royal Suite",
    assignedRoom: "501",
    preferences: {
      room: ["High floor", "Away from elevator", "King bed", "Extra pillows"],
      dining: ["Italian cuisine", "Window table", "9pm dinner preferred"],
      amenities: ["Spa day 2", "Late checkout", "Turndown at 9pm"],
    },
    dietary: ["No shellfish"],
    communicationHistory: [
      {
        type: "email",
        date: "2024-02-10",
        summary: "Pre-arrival requesting anniversary arrangements",
        requests: ["Champagne on arrival", "Rose petals", "Dinner reservation at CUT"],
      },
    ],
    stayPatterns: {
      avgNights: 3,
      avgSpend: 8200,
      preferredRoomType: "Royal Suite",
      typicalRequests: ["Spa booking day 2", "Late checkout", "Airport transfer"],
    },
    riskSignals: [{ type: "positive", message: "26th stay - platinum loyalty guest" }],
    predictedNeeds: [
      "Late checkout (requested 4/5 stays)",
      "Spa booking Saturday 2pm",
      "Anniversary amenity setup",
    ],
    occasion: "Anniversary weekend - partner James",
    actionItems: [
      { action: "Pre-hold spa slot Saturday 2pm", priority: "high", assignedTo: "Spa" },
      { action: "Prepare anniversary amenity", priority: "high", assignedTo: "Concierge" },
      { action: "Confirm CUT reservation", priority: "medium", assignedTo: "Concierge" },
    ],
  },
  {
    id: "2",
    name: "Marcus Chen",
    vipCode: "VIP",
    stayCount: 8,
    confirmationNumber: "83901122",
    arrivalDate: "2024-02-15",
    departureDate: "2024-02-17",
    roomType: "Park Suite",
    assignedRoom: "412",
    preferences: {
      room: ["High floor", "Park view", "Extra workspace"],
      dining: ["In-room dining", "Coffee always available"],
      amenities: ["Express checkout", "Pressing service"],
    },
    dietary: ["Vegetarian"],
    communicationHistory: [],
    stayPatterns: {
      avgNights: 2,
      avgSpend: 3200,
      preferredRoomType: "Park Suite",
      typicalRequests: ["Express checkout", "Early wake-up call"],
    },
    riskSignals: [
      { type: "warning", message: "Noise complaint on stay #5 - room moved", date: "2023-09" },
      { type: "positive", message: "Issue resolved - left positive review" },
    ],
    predictedNeeds: ["Express checkout", "Early wake-up call 5:30am", "Business center access"],
    occasion: "Wife's 40th birthday celebration",
    actionItems: [
      { action: "Assign quiet room away from elevator", priority: "high", assignedTo: "Front Desk" },
      { action: "Birthday amenity - peonies", priority: "high", assignedTo: "Concierge" },
      { action: "Pre-set wake-up call 5:30am", priority: "medium" },
    ],
  },
  {
    id: "3",
    name: "Courtney Adams",
    stayCount: 1,
    confirmationNumber: "84012367",
    arrivalDate: "2024-02-15",
    departureDate: "2024-02-17",
    roomType: "Deluxe Room",
    preferences: {
      room: ["Quiet room"],
      dining: ["Italian restaurant recommendation requested"],
      amenities: ["Airport transfer 2pm"],
    },
    dietary: ["Shellfish allergy"],
    communicationHistory: [
      {
        type: "email",
        date: "2024-02-12",
        summary: "Pre-arrival inquiry - first visit",
        requests: ["Italian restaurant recommendation", "Airport transfer", "Early check-in if possible"],
      },
    ],
    stayPatterns: {
      avgNights: 0,
      avgSpend: 0,
      preferredRoomType: "N/A",
      typicalRequests: [],
    },
    riskSignals: [{ type: "warning", message: "First visit - set expectations high" }],
    predictedNeeds: ["Airport transfer confirmation", "Restaurant recommendation follow-up"],
    actionItems: [
      { action: "Allergy flag added to F&B profile", priority: "high", assignedTo: "F&B" },
      { action: "Confirm airport transfer 2pm", priority: "high", assignedTo: "Concierge" },
      { action: "Send restaurant recommendations", priority: "medium", assignedTo: "Concierge" },
    ],
  },
];

// Mock housekeeping queue
const mockHousekeepingQueue = [
  {
    room: "501",
    status: "departure",
    checkoutTime: "11:00 AM",
    nextArrival: "3:00 PM",
    nextGuest: "VIP - Kiser, Piper",
    priority: "URGENT",
    notes: "Anniversary setup required before arrival",
    estimatedTime: 60,
  },
  {
    room: "412",
    status: "departure",
    checkoutTime: "12:00 PM",
    nextArrival: "4:00 PM",
    nextGuest: "VIP - Chen, Marcus (Birthday)",
    priority: "HIGH",
    notes: "Birthday setup with peonies required",
    estimatedTime: 50,
  },
  {
    room: "305",
    status: "stayover",
    guestType: "Family",
    notes: "2 kids under 10 - full clean, restock minibar snacks",
    priority: "MEDIUM",
    estimatedTime: 35,
  },
  {
    room: "410",
    status: "stayover",
    guestType: "Solo business",
    pattern: "Out by 8am daily",
    priority: "LOW",
    notes: "Light refresh only - 15 min",
    estimatedTime: 15,
  },
];

export default function CopilotSidebar() {
  const {
    isOpen,
    close,
    activeTab,
    setActiveTab,
    messages,
    addMessage,
    clearMessages,
    pageContext,
  } = useCopilot();

  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestIntelligence | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  // Generate contextual system message based on page context
  const getContextDescription = () => {
    const parts: string[] = [];
    if (pageContext.page) {
      parts.push(`Viewing: ${pageContext.page}`);
    }
    if (pageContext.selectedRoom) {
      parts.push(
        `Room ${pageContext.selectedRoom.roomNumber} (${pageContext.selectedRoom.category}, ${pageContext.selectedRoom.status})`
      );
    }
    if (pageContext.selectedGuest) {
      parts.push(`Guest: ${pageContext.selectedGuest.name}`);
      if (pageContext.selectedGuest.occasion) {
        parts.push(`Occasion: ${pageContext.selectedGuest.occasion}`);
      }
    }
    return parts.length > 0 ? parts.join(" | ") : null;
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    addMessage("user", userMessage);
    setIsSending(true);

    // Simulate AI response (in production, this would call an API)
    setTimeout(() => {
      const contextDesc = getContextDescription();
      let response = "";

      // Simple contextual responses for demo
      if (userMessage.toLowerCase().includes("room 412") || pageContext.selectedRoom?.roomNumber === "412") {
        response =
          "Room 412 is a Park Suite on floor 4. The next guest is Mr. Marcus Chen (VIP), arriving today for his wife's 40th birthday. Key preparations needed: quiet room assignment, birthday amenity with peonies, and vegetarian dining preferences noted.";
      } else if (userMessage.toLowerCase().includes("vip") || userMessage.toLowerCase().includes("arrival")) {
        response =
          "Today we have 3 arrivals including 2 VIPs:\n\n1. **Piper Kiser (VVIP)** - Royal Suite 501, Anniversary\n2. **Marcus Chen (VIP)** - Park Suite 412, Wife's birthday\n3. **Courtney Adams** - Deluxe Room, First visit (shellfish allergy)\n\nWould you like details on any specific guest?";
      } else if (userMessage.toLowerCase().includes("housekeeping") || userMessage.toLowerCase().includes("clean")) {
        response =
          "Current housekeeping priorities:\n\n1. **Room 501** (URGENT) - VIP departure/arrival, anniversary setup\n2. **Room 412** (HIGH) - VIP birthday setup with peonies\n3. **Room 305** (MEDIUM) - Family stayover\n4. **Room 410** (LOW) - Business stayover, light refresh";
      } else {
        response = `I'm here to help with Four Seasons operations. ${
          contextDesc ? `Currently ${contextDesc}.` : ""
        } You can ask me about:\n\n- Today's arrivals and VIP guests\n- Guest preferences and special occasions\n- Housekeeping priorities and room status\n- Action items and preparations`;
      }

      addMessage("assistant", response);
      setIsSending(false);
    }, 1000);
  };

  if (!isOpen) return null;

  // Minimized state - just icon bar
  if (isMinimized) {
    return (
      <div className="fixed right-0 top-[96px] bottom-0 w-12 bg-black flex flex-col items-center py-4 z-40 shadow-lg">
        <button
          onClick={() => setIsMinimized(false)}
          className="p-2 hover:bg-gray-800 rounded transition-colors mb-4"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <div className="flex-1 flex flex-col items-center gap-3">
          <button
            onClick={() => {
              setIsMinimized(false);
              setActiveTab("arrivals");
            }}
            className={`p-2 rounded transition-colors ${
              activeTab === "arrivals" ? "bg-white/20" : "hover:bg-gray-800"
            }`}
          >
            <Users size={18} className="text-white" />
          </button>
          <button
            onClick={() => {
              setIsMinimized(false);
              setActiveTab("chat");
            }}
            className={`p-2 rounded transition-colors ${
              activeTab === "chat" ? "bg-white/20" : "hover:bg-gray-800"
            }`}
          >
            <MessageSquare size={18} className="text-white" />
          </button>
          <button
            onClick={() => {
              setIsMinimized(false);
              setActiveTab("housekeeping");
            }}
            className={`p-2 rounded transition-colors ${
              activeTab === "housekeeping" ? "bg-white/20" : "hover:bg-gray-800"
            }`}
          >
            <Building2 size={18} className="text-white" />
          </button>
        </div>
        <div className="mt-auto">
          <Sparkles size={20} className="text-white/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-[96px] bottom-0 w-[400px] bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="bg-black px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-white" />
          <span className="text-[14px] font-semibold text-white">Copilot</span>
          {getContextDescription() && (
            <span className="text-[11px] text-gray-400 ml-2 truncate max-w-[180px]">
              {getContextDescription()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-gray-800 rounded transition-colors"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
          <button onClick={close} className="p-1.5 hover:bg-gray-800 rounded transition-colors">
            <X size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => {
            setActiveTab("arrivals");
            setSelectedGuest(null);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-medium transition-colors ${
            activeTab === "arrivals"
              ? "text-black border-b-2 border-black bg-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users size={14} />
          Arrivals
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-medium transition-colors ${
            activeTab === "chat"
              ? "text-black border-b-2 border-black bg-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MessageSquare size={14} />
          Chat
        </button>
        <button
          onClick={() => setActiveTab("housekeeping")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-medium transition-colors ${
            activeTab === "housekeeping"
              ? "text-black border-b-2 border-black bg-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Building2 size={14} />
          HK Queue
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "arrivals" && !selectedGuest && (
          <ArrivalsView arrivals={mockArrivals} onSelectGuest={setSelectedGuest} />
        )}
        {activeTab === "arrivals" && selectedGuest && (
          <GuestDetailView guest={selectedGuest} onBack={() => setSelectedGuest(null)} />
        )}
        {activeTab === "chat" && (
          <ChatView
            messages={messages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            onSend={handleSendMessage}
            isSending={isSending}
            onClear={clearMessages}
            messagesEndRef={messagesEndRef}
          />
        )}
        {activeTab === "housekeeping" && <HousekeepingView queue={mockHousekeepingQueue} />}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>Four Seasons Intelligence</span>
          <span>Last sync: just now</span>
        </div>
      </div>
    </div>
  );
}

// Arrivals View
function ArrivalsView({
  arrivals,
  onSelectGuest,
}: {
  arrivals: GuestIntelligence[];
  onSelectGuest: (guest: GuestIntelligence) => void;
}) {
  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
          Today's Arrivals
        </div>
        <div className="text-[13px] text-gray-600">
          {arrivals.length} guests • {arrivals.filter((a) => a.vipCode).length} VIPs •{" "}
          {arrivals.filter((a) => a.occasion).length} special occasions
        </div>
      </div>

      <div className="space-y-3">
        {arrivals.map((guest) => (
          <button
            key={guest.id}
            onClick={() => onSelectGuest(guest)}
            className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-gray-900">{guest.name}</span>
                  {guest.vipCode && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded">
                      {guest.vipCode}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-500">
                  {guest.stayCount > 1 ? `${guest.stayCount} stays` : "First visit"} •{" "}
                  {guest.roomType}
                  {guest.assignedRoom && ` • Room ${guest.assignedRoom}`}
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 mt-1" />
            </div>

            {guest.occasion && (
              <div className="flex items-center gap-1.5 text-[11px] text-rose-600 mb-1">
                <Heart size={12} />
                {guest.occasion}
              </div>
            )}

            {guest.dietary.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-orange-600 mb-1">
                <AlertTriangle size={12} />
                {guest.dietary.join(", ")}
              </div>
            )}

            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  guest.actionItems.filter((a) => a.priority === "high").length > 0
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {guest.actionItems.length} actions
              </span>
              {guest.communicationHistory.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                  {guest.communicationHistory.length} messages
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Guest Detail View
function GuestDetailView({
  guest,
  onBack,
}: {
  guest: GuestIntelligence;
  onBack: () => void;
}) {
  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[12px] text-gray-600 hover:text-black mb-3"
      >
        <ChevronLeft size={14} />
        Back to arrivals
      </button>

      {/* Guest Header */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[18px] font-semibold text-gray-900">{guest.name}</span>
          {guest.vipCode && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">
              {guest.vipCode}
            </span>
          )}
        </div>
        <div className="text-[12px] text-gray-500">
          {guest.stayCount > 1 ? `${guest.stayCount} stays` : "First visit"} •{" "}
          {guest.arrivalDate} - {guest.departureDate} • {guest.roomType}
          {guest.assignedRoom && ` • Room ${guest.assignedRoom}`}
        </div>
        {guest.occasion && (
          <div className="flex items-center gap-1.5 mt-2 text-[12px] text-rose-600">
            <Heart size={14} />
            <span className="font-medium">{guest.occasion}</span>
          </div>
        )}
      </div>

      {/* Action Items */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Action Items
        </div>
        <div className="space-y-2">
          {guest.actionItems.map((action, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 p-2 rounded ${
                action.priority === "high"
                  ? "bg-red-50 border border-red-200"
                  : action.priority === "medium"
                  ? "bg-yellow-50 border border-yellow-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <CheckCircle
                size={14}
                className={
                  action.priority === "high"
                    ? "text-red-500 mt-0.5"
                    : action.priority === "medium"
                    ? "text-yellow-500 mt-0.5"
                    : "text-gray-400 mt-0.5"
                }
              />
              <div className="flex-1">
                <div className="text-[12px] text-gray-800">{action.action}</div>
                {action.assignedTo && (
                  <div className="text-[10px] text-gray-500">→ {action.assignedTo}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predicted Needs */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Predicted Needs
        </div>
        <div className="space-y-1">
          {guest.predictedNeeds.map((need, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[12px] text-gray-700">
              <TrendingUp size={12} className="text-black" />
              {need}
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Preferences
        </div>
        <div className="space-y-2">
          {guest.preferences.room.length > 0 && (
            <div className="flex items-start gap-2">
              <Bed size={14} className="text-gray-400 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {guest.preferences.room.map((pref, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          )}
          {guest.preferences.dining.length > 0 && (
            <div className="flex items-start gap-2">
              <Utensils size={14} className="text-gray-400 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {guest.preferences.dining.map((pref, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] rounded"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          )}
          {guest.dietary.length > 0 && (
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-orange-500 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {guest.dietary.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] rounded font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Risk Signals */}
      {guest.riskSignals.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Signals
          </div>
          <div className="space-y-1">
            {guest.riskSignals.map((signal, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 text-[12px] ${
                  signal.type === "warning" ? "text-amber-700" : "text-green-700"
                }`}
              >
                {signal.type === "warning" ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                {signal.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Communication History */}
      {guest.communicationHistory.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Recent Communication
          </div>
          <div className="space-y-2">
            {guest.communicationHistory.map((comm, idx) => (
              <div key={idx} className="p-2 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  {comm.type === "email" ? (
                    <Mail size={12} className="text-gray-400" />
                  ) : comm.type === "call" ? (
                    <Phone size={12} className="text-gray-400" />
                  ) : (
                    <MessageSquare size={12} className="text-gray-400" />
                  )}
                  <span className="text-[11px] text-gray-500">{comm.date}</span>
                </div>
                <div className="text-[12px] text-gray-700">{comm.summary}</div>
                {comm.requests.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {comm.requests.map((req, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] rounded"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Chat View
function ChatView({
  messages,
  chatInput,
  setChatInput,
  onSend,
  isSending,
  onClear,
  messagesEndRef,
}: {
  messages: { id: string; role: string; content: string; timestamp: Date }[];
  chatInput: string;
  setChatInput: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
  onClear: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles size={32} className="mx-auto mb-3 text-gray-300" />
            <div className="text-[14px] text-gray-500 mb-2">Welcome to Copilot</div>
            <div className="text-[12px] text-gray-400">
              Ask about arrivals, guest preferences,
              <br />
              housekeeping priorities, or any operational question.
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-[13px] ${
                    msg.role === "user"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div
                    className={`text-[10px] mt-1 ${
                      msg.role === "user" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <Loader2 size={16} className="animate-spin text-gray-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3">
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600"
            >
              <Trash2 size={12} />
              Clear chat
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
            placeholder="Ask about guests, rooms, or operations..."
            className="flex-1 rounded border border-gray-200 px-3 py-2 text-[13px] focus:border-gray-400 focus:outline-none"
            disabled={isSending}
          />
          <button
            onClick={onSend}
            disabled={!chatInput.trim() || isSending}
            className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Housekeeping View
function HousekeepingView({ queue }: { queue: typeof mockHousekeepingQueue }) {
  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
          Smart Cleaning Queue
        </div>
        <div className="text-[13px] text-gray-600">
          Prioritized by arrival times & guest intelligence
        </div>
      </div>

      <div className="space-y-2">
        {queue.map((room, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${
              room.priority === "URGENT"
                ? "bg-red-50 border-red-200"
                : room.priority === "HIGH"
                ? "bg-orange-50 border-orange-200"
                : room.priority === "MEDIUM"
                ? "bg-yellow-50 border-yellow-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-bold text-gray-900">Room {room.room}</span>
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                    room.priority === "URGENT"
                      ? "bg-red-500 text-white"
                      : room.priority === "HIGH"
                      ? "bg-orange-500 text-white"
                      : room.priority === "MEDIUM"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {room.priority}
                </span>
              </div>
              <span className="text-[11px] text-gray-500">{room.estimatedTime} min</span>
            </div>

            <div className="text-[11px] text-gray-600 mb-1">
              {room.status === "departure" ? (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Checkout {room.checkoutTime} → Next arrival {room.nextArrival}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {room.guestType}
                  {room.pattern && ` - ${room.pattern}`}
                </span>
              )}
            </div>

            {room.nextGuest && (
              <div className="text-[11px] text-amber-700 font-medium">{room.nextGuest}</div>
            )}

            <div className="text-[11px] text-gray-700 mt-1">{room.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
