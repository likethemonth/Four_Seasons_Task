"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  User,
  Star,
  Calendar,
  Utensils,
  AlertTriangle,
  Clock,
  MessageSquare,
  Sparkles,
  Gift,
  Heart,
  Coffee,
  Bed,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Building2,
  Users,
  Cake,
  Wine,
  Leaf,
  Volume2,
  Moon,
} from "lucide-react";

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
  // Intelligence data
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

// Mock data for demonstration
const mockArrivals: GuestIntelligence[] = [
  {
    id: "1",
    name: "Piper Kiser",
    vipCode: "VVIP",
    stayCount: 26,
    confirmationNumber: "83924751",
    arrivalDate: "2024-02-15",
    departureDate: "2024-02-18",
    roomType: "Deluxe Suite",
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
        requests: ["Champagne on arrival", "Rose petals", "Dinner reservation at Zuma"],
      },
    ],
    stayPatterns: {
      avgNights: 3,
      avgSpend: 4200,
      preferredRoomType: "Deluxe Suite",
      typicalRequests: ["Spa booking day 2", "Late checkout", "Airport transfer"],
    },
    riskSignals: [
      { type: "positive", message: "26th stay - high loyalty guest" },
    ],
    predictedNeeds: [
      "Late checkout (requested 4/5 stays)",
      "Spa booking Saturday 2pm",
      "Anniversary amenity setup",
    ],
    occasion: "Anniversary weekend - partner James",
    actionItems: [
      { action: "Pre-hold spa slot Saturday 2pm", priority: "high", assignedTo: "Spa" },
      { action: "Prepare anniversary amenity", priority: "high", assignedTo: "Concierge" },
      { action: "Confirm Zuma reservation", priority: "medium", assignedTo: "Concierge" },
    ],
  },
  {
    id: "2",
    name: "Courtney Adams",
    stayCount: 1,
    confirmationNumber: "84012367",
    arrivalDate: "2024-02-15",
    departureDate: "2024-02-17",
    roomType: "Superior Room",
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
      {
        type: "email",
        date: "2024-02-13",
        summary: "Follow-up confirming transfer",
        requests: ["Confirmed shellfish allergy"],
      },
    ],
    stayPatterns: {
      avgNights: 0,
      avgSpend: 0,
      preferredRoomType: "N/A",
      typicalRequests: [],
    },
    riskSignals: [
      { type: "warning", message: "First visit - set expectations high" },
    ],
    predictedNeeds: [
      "Airport transfer confirmation",
      "Restaurant recommendation follow-up",
    ],
    actionItems: [
      { action: "Allergy flag added to F&B profile", priority: "high", assignedTo: "F&B" },
      { action: "Confirm airport transfer 2pm", priority: "high", assignedTo: "Concierge" },
      { action: "Send restaurant recommendations", priority: "medium", assignedTo: "Concierge" },
    ],
  },
  {
    id: "3",
    name: "Marcus Chen",
    vipCode: "VIP",
    stayCount: 8,
    confirmationNumber: "83901122",
    arrivalDate: "2024-02-15",
    departureDate: "2024-02-16",
    roomType: "Executive Suite",
    preferences: {
      room: ["High floor", "City view", "Extra workspace"],
      dining: ["In-room dining", "Coffee always available"],
      amenities: ["Express checkout", "Pressing service"],
    },
    dietary: ["Vegetarian"],
    communicationHistory: [],
    stayPatterns: {
      avgNights: 1.5,
      avgSpend: 890,
      preferredRoomType: "Executive Suite",
      typicalRequests: ["Express checkout", "Early wake-up call"],
    },
    riskSignals: [
      { type: "warning", message: "Noise complaint on stay #5 - room moved", date: "2023-09" },
      { type: "positive", message: "Issue resolved - left positive review" },
    ],
    predictedNeeds: [
      "Express checkout",
      "Early wake-up call 5:30am",
      "Business center access",
    ],
    actionItems: [
      { action: "Assign quiet room away from elevator", priority: "high", assignedTo: "Front Desk" },
      { action: "Pre-set wake-up call 5:30am", priority: "medium" },
    ],
  },
];

// Housekeeping intelligence
const mockHousekeepingQueue = [
  {
    room: "305",
    status: "departure",
    checkoutTime: "11:00 AM",
    nextArrival: "1:00 PM",
    nextGuest: "VIP - Kiser, Piper",
    priority: "URGENT",
    notes: "Anniversary setup required before arrival",
    estimatedTime: 45,
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
  {
    room: "502",
    status: "stayover",
    guestType: "Family",
    notes: "2 kids under 10 - full clean, restock minibar snacks",
    priority: "MEDIUM",
    estimatedTime: 35,
  },
  {
    room: "601",
    status: "departure",
    checkoutTime: "12:00 PM",
    nextArrival: "4:00 PM",
    nextGuest: "VIP arrival",
    priority: "HIGH",
    notes: "Inspect before VIP arrival",
    estimatedTime: 50,
  },
];

type SidebarMode = "arrivals" | "profile" | "housekeeping";

interface IntelligenceSidebarProps {
  mode?: SidebarMode;
  selectedGuestId?: string;
}

export default function IntelligenceSidebar({
  mode = "arrivals",
  selectedGuestId,
}: IntelligenceSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeMode, setActiveMode] = useState<SidebarMode>(mode);
  const [selectedGuest, setSelectedGuest] = useState<GuestIntelligence | null>(
    selectedGuestId ? mockArrivals.find((g) => g.id === selectedGuestId) || null : null
  );

  if (!isExpanded) {
    return (
      <div className="fixed right-0 top-0 bottom-0 w-12 bg-[#0d9488] flex flex-col items-center py-4 z-50 shadow-lg">
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2 hover:bg-[#0f766e] rounded transition-colors mb-4"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <div className="flex-1 flex flex-col items-center gap-3">
          <button
            onClick={() => { setIsExpanded(true); setActiveMode("arrivals"); }}
            className={`p-2 rounded transition-colors ${activeMode === "arrivals" ? "bg-white/20" : "hover:bg-[#0f766e]"}`}
          >
            <Users size={18} className="text-white" />
          </button>
          <button
            onClick={() => { setIsExpanded(true); setActiveMode("profile"); }}
            className={`p-2 rounded transition-colors ${activeMode === "profile" ? "bg-white/20" : "hover:bg-[#0f766e]"}`}
          >
            <User size={18} className="text-white" />
          </button>
          <button
            onClick={() => { setIsExpanded(true); setActiveMode("housekeeping"); }}
            className={`p-2 rounded transition-colors ${activeMode === "housekeeping" ? "bg-white/20" : "hover:bg-[#0f766e]"}`}
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
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#0d9488] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-white" />
          <span className="text-[14px] font-semibold text-white">Guest Intelligence</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 hover:bg-[#0f766e] rounded transition-colors"
        >
          <ChevronRight size={18} className="text-white" />
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => { setActiveMode("arrivals"); setSelectedGuest(null); }}
          className={`flex-1 px-3 py-2 text-[12px] font-medium transition-colors ${
            activeMode === "arrivals"
              ? "text-[#0d9488] border-b-2 border-[#0d9488]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Arrivals Briefing
        </button>
        <button
          onClick={() => setActiveMode("profile")}
          className={`flex-1 px-3 py-2 text-[12px] font-medium transition-colors ${
            activeMode === "profile"
              ? "text-[#0d9488] border-b-2 border-[#0d9488]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Guest Profile
        </button>
        <button
          onClick={() => setActiveMode("housekeeping")}
          className={`flex-1 px-3 py-2 text-[12px] font-medium transition-colors ${
            activeMode === "housekeeping"
              ? "text-[#0d9488] border-b-2 border-[#0d9488]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          HK Queue
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeMode === "arrivals" && !selectedGuest && (
          <ArrivalsView arrivals={mockArrivals} onSelectGuest={setSelectedGuest} />
        )}
        {activeMode === "arrivals" && selectedGuest && (
          <GuestDetailView guest={selectedGuest} onBack={() => setSelectedGuest(null)} />
        )}
        {activeMode === "profile" && (
          <ProfileView guest={selectedGuest || mockArrivals[0]} />
        )}
        {activeMode === "housekeeping" && (
          <HousekeepingView queue={mockHousekeepingQueue} />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>Powered by Four Seasons Intelligence</span>
          <span>Last sync: just now</span>
        </div>
      </div>
    </div>
  );
}

// Arrivals View Component
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
                  {guest.stayCount > 1 ? `${guest.stayCount} stays` : "First visit"} • {guest.roomType}
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 mt-1" />
            </div>

            {/* Quick Intel */}
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

            {/* Action Items Count */}
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
        className="flex items-center gap-1 text-[12px] text-[#0d9488] hover:text-[#0f766e] mb-3"
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
              <TrendingUp size={12} className="text-[#0d9488]" />
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
                  <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded">
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
                  <span key={idx} className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] rounded">
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
                  <span key={idx} className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] rounded font-medium">
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
                {signal.type === "warning" ? (
                  <AlertCircle size={12} />
                ) : (
                  <CheckCircle size={12} />
                )}
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
                      <span key={i} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] rounded">
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

// Profile View
function ProfileView({ guest }: { guest: GuestIntelligence }) {
  return (
    <div className="p-4">
      <div className="text-center mb-4 pb-4 border-b border-gray-200">
        <div className="w-16 h-16 bg-[#0d9488] rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-[20px] font-semibold text-white">
            {guest.name.split(" ").map((n) => n[0]).join("")}
          </span>
        </div>
        <div className="text-[16px] font-semibold text-gray-900">{guest.name}</div>
        {guest.vipCode && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">
            {guest.vipCode}
          </span>
        )}
        <div className="text-[12px] text-gray-500 mt-1">
          {guest.stayCount} stays • Member since 2019
        </div>
      </div>

      {/* Stay Patterns */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Stay Patterns
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-[16px] font-semibold text-gray-900">
              {guest.stayPatterns.avgNights || 3}
            </div>
            <div className="text-[10px] text-gray-500">Avg Nights</div>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-[16px] font-semibold text-gray-900">
              ${guest.stayPatterns.avgSpend || "2,400"}
            </div>
            <div className="text-[10px] text-gray-500">Avg Spend</div>
          </div>
        </div>
      </div>

      {/* Full Profile Summary */}
      <div className="space-y-3">
        <div>
          <div className="text-[11px] font-semibold text-gray-500 mb-1">Room Preferences</div>
          <div className="text-[12px] text-gray-700">
            {guest.preferences.room.join(" • ") || "High floor, king bed, quiet side"}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-gray-500 mb-1">Dining Preferences</div>
          <div className="text-[12px] text-gray-700">
            {guest.preferences.dining.join(" • ") || "Italian preferred, $400 avg spend"}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-gray-500 mb-1">Typical Requests</div>
          <div className="text-[12px] text-gray-700">
            {guest.stayPatterns.typicalRequests.join(" • ") || "Late checkout, spa day 2, turndown 9pm"}
          </div>
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
                  {room.guestType} - {room.pattern}
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
