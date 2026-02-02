"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import DateSelector from "@/components/dashboard/DateSelector";
import IntelligenceFeed from "@/components/intelligence/IntelligenceFeed";
import QuickCapture from "@/components/intelligence/QuickCapture";
import VIPTouchpoints from "@/components/intelligence/VIPTouchpoints";
import CommunicationLog from "@/components/intelligence/CommunicationLog";
import GuestDetailModal from "@/components/intelligence/GuestDetailModal";
import {
  Users,
  Crown,
  UtensilsCrossed,
  Sparkles,
  Clock,
  Baby,
  Leaf,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Gift,
  Mail,
  Phone,
} from "lucide-react";

type Loyalty = "ELITE" | "PREFERRED" | "VIP" | "FIRST";

interface GuestRow {
  id: string;
  name: string;
  loyalty: Loyalty;
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
    dndP?: number;
    kidsClubP?: number;
    dietary?: string;
  };
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

function pick<T>(r: () => number, arr: T[]): T {
  return arr[Math.floor(r() * arr.length)];
}

function weighted<T>(r: () => number, entries: [T, number][]): T {
  const total = entries.reduce((a, [, w]) => a + w, 0);
  let x = r() * total;
  for (const [val, w] of entries) {
    if ((x -= w) <= 0) return val;
  }
  return entries[entries.length - 1][0];
}

function generateGuests(count: number, seed = 12345): GuestRow[] {
  const rand = rng(seed);
  const firstNames = [
    "Jane", "John", "Sara", "Marco", "Emily", "David", "Amir", "Priya",
    "Luis", "Hana", "Noah", "Ava", "Liam", "Mia", "Oliver", "Sophia",
    "Elijah", "Isabella", "Lucas", "Amelia", "Mateo", "Charlotte", "Ethan",
    "Grace", "Zara", "Yuna", "Chen", "Akira", "Fatima", "Omar",
  ];
  const lastNames = [
    "Doe", "Chen", "Al-Farsi", "Rossi", "Nguyen", "Garcia", "Khan", "Patel",
    "Silva", "Kim", "Smith", "Brown", "Wilson", "Taylor", "Anderson", "Thomas",
    "Lee", "Martin", "Clark", "Rodriguez", "Lopez", "Hernandez", "Singh",
    "Yamamoto", "Hassan", "Park", "Ibrahim", "Carter", "Ahmed", "Chan",
  ];
  const diets = ["Gluten-free", "Dairy-free", "Vegan", "Vegetarian"];

  const guests: GuestRow[] = [];
  for (let i = 0; i < count; i++) {
    const first = pick(rand, firstNames);
    const last = pick(rand, lastNames);
    const name = `${first} ${last}`;

    const loyalty = weighted<Loyalty>(rand, [
      ["FIRST", 50],
      ["PREFERRED", 30],
      ["ELITE", 12],
      ["VIP", 8],
    ]);
    const vip = loyalty === "VIP" || (loyalty === "ELITE" && rand() < 0.25);

    const segs = new Set<string>();
    if (rand() < 0.45) segs.add("FNB_HEAVY");
    if (rand() < 0.25) segs.add("SPA_USER");
    if (rand() < 0.20) segs.add("EARLY_CHECKOUT");
    if (rand() < 0.12) segs.add("FAMILY");
    if (rand() < 0.40) segs.add("BUSINESS");
    if (!segs.has("BUSINESS")) segs.add("LEISURE");
    if (vip) segs.add("VIP_TOUCHPOINT");

    const arrHour = Math.floor(rand() * 12) + 10;
    const arrMin = Math.floor(rand() * 60);
    const depHour = segs.has("EARLY_CHECKOUT") ? Math.floor(rand() * 3) + 5 : Math.floor(rand() * 6) + 9;
    const stayNights = Math.floor(rand() * 4) + 1;
    const arrival = `Sat ${String(arrHour).padStart(2, "0")}:${String(arrMin).padStart(2, "0")}`;
    const departure = `${["Sun", "Mon", "Tue", "Wed"][stayNights - 1]} ${String(depHour).padStart(2, "0")}:${String(
      Math.floor(rand() * 60)
    ).padStart(2, "0")}`;

    // Assign room numbers
    const floor = Math.floor(rand() * 8) + 4; // Floors 4-11
    const roomNum = Math.floor(rand() * 20) + 1;
    const room = `${floor}${String(roomNum).padStart(2, "0")}`;

    const fnbDinnerCovers = segs.has("FNB_HEAVY") ? 1.8 + rand() * 1.5 : 0.8 + rand() * 1.2;
    const irdP = segs.has("BUSINESS") || arrHour >= 20 ? 0.5 + rand() * 0.4 : 0.1 + rand() * 0.4;
    const spaP = segs.has("SPA_USER") ? 0.45 + rand() * 0.4 : 0.02 + rand() * 0.2;
    const earlyCheckoutP = segs.has("EARLY_CHECKOUT") ? 0.6 + rand() * 0.35 : 0.05 + rand() * 0.3;
    const dndP = 0.05 + rand() * 0.2;
    const kidsClubP = segs.has("FAMILY") ? 0.35 + rand() * 0.45 : undefined;
    const dietary = rand() < 0.10 ? pick(rand, diets) : undefined;

    guests.push({
      id: `g${i + 1}`,
      name,
      loyalty,
      vip,
      arrival,
      departure,
      room,
      segments: Array.from(segs),
      preds: { fnbDinnerCovers, irdP, spaP, earlyCheckoutP, dndP, kidsClubP, dietary },
    });
  }
  return guests;
}

function TierPill({ tier }: { tier: Loyalty }) {
  const map: Record<Loyalty, string> = {
    ELITE: "bg-black text-white",
    PREFERRED: "bg-gray-700 text-white",
    VIP: "bg-gray-500 text-white",
    FIRST: "bg-gray-200 text-gray-700",
  };
  return (
    <span className={`rounded-sm px-2 py-1 text-[12px] font-semibold ${map[tier]}`}>
      {tier}
    </span>
  );
}

function Segments({ segs }: { segs: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {segs.slice(0, 3).map((s) => (
        <span key={s} className="rounded-full bg-gray-100 px-2 py-1 text-[12px] text-gray-700">
          {s.replaceAll("_", " ")}
        </span>
      ))}
      {segs.length > 3 && (
        <span className="rounded-full bg-gray-100 px-2 py-1 text-[12px] text-gray-500">
          +{segs.length - 3}
        </span>
      )}
    </div>
  );
}

export default function GuestsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 15));
  const [query, setQuery] = useState("");
  const [vipOnly, setVipOnly] = useState(false);
  const [segment, setSegment] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"arrivals" | "intelligence" | "communications">("intelligence");
  const [selectedGuest, setSelectedGuest] = useState<GuestRow | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>(undefined);
  const pageSize = 25;

  const allRows = useMemo(() => generateGuests(2000, 20260130), []);

  const segments = [
    "ALL", "FNB_HEAVY", "EARLY_CHECKOUT", "FAMILY", "SPA_USER", "BUSINESS", "VIP_TOUCHPOINT", "LEISURE",
  ];

  const filtered = useMemo(() => {
    return allRows.filter((r) => {
      if (vipOnly && !r.vip) return false;
      if (segment !== "ALL" && !r.segments.includes(segment)) return false;
      if (query && !r.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [allRows, query, vipOnly, segment]);

  useEffect(() => {
    setPage(1);
  }, [query, vipOnly, segment]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const pct = (num: number) => Math.round((num / Math.max(1, filtered.length)) * 100);
  const fnbHeavyPct = pct(filtered.filter((g) => g.segments.includes("FNB_HEAVY")).length);
  const spaPct = pct(filtered.filter((g) => g.segments.includes("SPA_USER")).length);
  const families = filtered.filter((g) => g.segments.includes("FAMILY")).length;
  const earlyCheckoutRooms = Math.round(filtered.reduce((acc, g) => acc + (g.preds.earlyCheckoutP ?? 0), 0));
  const dietaryCount = filtered.filter((g) => !!g.preds.dietary).length;
  const eliteCount = filtered.filter((g) => g.loyalty === "ELITE").length;
  const vipCount = filtered.filter((g) => g.loyalty === "VIP").length;

  const handleSelectGuestFromFeed = (guestName: string, roomNumber: string) => {
    const guest = allRows.find((g) =>
      g.name.toLowerCase().includes(guestName.toLowerCase()) ||
      g.room === roomNumber
    );
    if (guest) {
      setSelectedGuest(guest);
      setSelectedRoom(roomNumber);
    } else {
      // Create a synthetic guest for the modal
      setSelectedGuest({
        id: "temp",
        name: guestName,
        loyalty: "FIRST",
        arrival: "TBD",
        departure: "TBD",
        room: roomNumber,
        segments: [],
        preds: {},
      });
      setSelectedRoom(roomNumber);
    }
  };

  return (
    <div className="px-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-2 font-display text-[34px] font-medium text-black">
            Guest Intelligence Platform
          </h1>
          <p className="text-[16px] text-gray-600">
            Capture, track, and act on guest preferences in real-time
          </p>
        </div>
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {[
          { id: "intelligence", label: "Intelligence Hub", icon: <MessageSquare size={16} /> },
          { id: "arrivals", label: "Arriving Guests", icon: <Users size={16} /> },
          { id: "communications", label: "Communications", icon: <Mail size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-[14px] font-medium border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Intelligence Hub Tab */}
      {activeTab === "intelligence" && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - VIP Touchpoints */}
          <div className="col-span-2">
            <VIPTouchpoints />
          </div>

          {/* Right Column - Staff Intelligence Feed + Quick Capture */}
          <div className="col-span-1 space-y-6">
            <IntelligenceFeed
              maxItems={8}
              onSelectGuest={handleSelectGuestFromFeed}
            />
            <QuickCapture />
          </div>
        </div>
      )}

      {/* Arrivals Tab */}
      {activeTab === "arrivals" && (
        <>
          {/* Filters */}
          <Card className="mb-6">
            <CardBody>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                    Search Guest
                  </label>
                  <div className="flex items-center gap-2 rounded-sm border border-gray-300 bg-white px-3 py-2">
                    <Search size={14} className="text-gray-500" />
                    <input
                      className="w-full outline-none text-[14px]"
                      placeholder="Name..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                    Segment
                  </label>
                  <div className="flex items-center gap-2 rounded-sm border border-gray-300 bg-white px-3 py-2">
                    <Filter size={14} className="text-gray-500" />
                    <select
                      className="w-full bg-transparent text-[14px] outline-none"
                      value={segment}
                      onChange={(e) => setSegment(e.target.value)}
                    >
                      {segments.map((s) => (
                        <option key={s} value={s}>
                          {s.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                    VIP Only
                  </label>
                  <div className="flex items-center gap-3 rounded-sm border border-gray-300 bg-white px-3 py-2">
                    <Crown size={14} className="text-gray-500" />
                    <input
                      type="checkbox"
                      checked={vipOnly}
                      onChange={(e) => setVipOnly(e.target.checked)}
                    />
                    <span className="text-[14px]">Show VIP/Elite Only</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Summary cards */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[24px] font-semibold text-black">{filtered.length}</div>
                    <div className="text-[13px] text-gray-500">Arriving Guests</div>
                  </div>
                  <Users size={24} className="text-gray-300" />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[24px] font-semibold text-black">{vipCount + eliteCount}</div>
                    <div className="text-[13px] text-gray-500">VIP/Elite</div>
                  </div>
                  <Crown size={24} className="text-gray-300" />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[24px] font-semibold text-black">{dietaryCount}</div>
                    <div className="text-[13px] text-gray-500">Dietary Needs</div>
                  </div>
                  <Leaf size={24} className="text-gray-300" />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[24px] font-semibold text-black">{earlyCheckoutRooms}</div>
                    <div className="text-[13px] text-gray-500">Early Checkouts</div>
                  </div>
                  <Clock size={24} className="text-gray-300" />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Table */}
          <Card>
            <CardHeader title={`Arriving Guests (${filtered.length})`} />
            <CardBody className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">Guest</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">Room</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">Stay</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">Segments</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">Dietary</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((g) => (
                    <tr
                      key={g.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedGuest(g);
                        setSelectedRoom(g.room);
                      }}
                    >
                      <td className="px-4 py-4">
                        <div className="mb-1 text-[14px] font-semibold text-black">{g.name}</div>
                        <div className="flex items-center gap-2">
                          <TierPill tier={g.loyalty} />
                          {g.vip && <Crown size={14} className="text-amber-500" />}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[14px] text-gray-700">{g.room}</td>
                      <td className="px-4 py-4 text-[13px] text-gray-600">
                        <div>{g.arrival}</div>
                        <div className="text-gray-400">{g.departure}</div>
                      </td>
                      <td className="px-4 py-4">
                        <Segments segs={g.segments} />
                      </td>
                      <td className="px-4 py-4">
                        {g.preds.dietary ? (
                          <span className="flex items-center gap-1 text-[13px] text-green-700">
                            <Leaf size={14} />
                            {g.preds.dietary}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-[14px] text-gray-700">
            <div>
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-300 bg-white hover:border-black disabled:opacity-40"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </button>
              <span>Page {page} / {totalPages}</span>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-300 bg-white hover:border-black disabled:opacity-40"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Communications Tab */}
      {activeTab === "communications" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <CommunicationLog guestName="Mr. Chen" />
          </div>
          <div className="col-span-1 space-y-6">
            {/* Summary stats */}
            <Card>
              <CardHeader title="Communication Summary" />
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[14px] text-gray-700">
                    <Mail size={16} className="text-blue-500" />
                    Emails
                  </div>
                  <span className="text-[18px] font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[14px] text-gray-700">
                    <Phone size={16} className="text-green-500" />
                    Calls
                  </div>
                  <span className="text-[18px] font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[14px] text-gray-700">
                    <MessageSquare size={16} className="text-purple-500" />
                    Chat Messages
                  </div>
                  <span className="text-[18px] font-semibold">12</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-700">Action Items</span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[13px] font-semibold text-amber-700">
                      5 pending
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Quick intel from comms */}
            <Card>
              <CardHeader title="Extracted Insights" />
              <CardBody className="space-y-3">
                <div className="flex items-start gap-2 rounded-sm bg-amber-50 p-3">
                  <Gift size={16} className="mt-0.5 text-amber-500" />
                  <div>
                    <div className="text-[13px] font-semibold text-gray-800">Special Occasions</div>
                    <div className="text-[12px] text-gray-600">3 birthdays, 1 anniversary today</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-sm bg-green-50 p-3">
                  <Leaf size={16} className="mt-0.5 text-green-500" />
                  <div>
                    <div className="text-[13px] font-semibold text-gray-800">Dietary Alerts</div>
                    <div className="text-[12px] text-gray-600">2 nut allergies, 5 vegetarian</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-sm bg-blue-50 p-3">
                  <Clock size={16} className="mt-0.5 text-blue-500" />
                  <div>
                    <div className="text-[13px] font-semibold text-gray-800">Special Requests</div>
                    <div className="text-[12px] text-gray-600">4 early check-ins, 2 late checkouts</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* Guest Detail Modal */}
      <GuestDetailModal
        isOpen={!!selectedGuest}
        onClose={() => {
          setSelectedGuest(null);
          setSelectedRoom(undefined);
        }}
        guest={selectedGuest}
        roomNumber={selectedRoom}
      />
    </div>
  );
}
