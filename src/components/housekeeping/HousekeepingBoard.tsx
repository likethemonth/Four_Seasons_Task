"use client";

import { useState, useMemo } from "react";
import {
  LayoutGrid,
  List,
  Users,
  Building2,
  Filter,
  RefreshCw,
  Search,
  Star,
  Eye,
  MapPin,
  Clock,
  User,
  Bed,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
} from "lucide-react";
import AIOptimizationPanel from "./AIOptimizationPanel";
import Button from "@/components/ui/Button";
import {
  getHotelRooms,
  getRoomsByFloor,
  getFloorSummary,
  FLOOR_LAYOUTS,
  HOUSEKEEPING_STAFF,
  ROOM_CATEGORIES,
  type Room,
  type HousekeepingStaff,
} from "@/lib/data/parkLaneRooms";
import { useCopilot, type RoomContext } from "@/context/CopilotContext";

// Status color mapping
const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  clean: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  inspected: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
  dirty: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  pickup: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  ooo: { bg: "bg-gray-300", text: "text-gray-600", border: "border-gray-400" },
  oos: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
};

const FO_STATUS_COLORS: Record<string, string> = {
  vacant: "text-gray-500",
  occupied: "text-blue-600",
  due_out: "text-orange-600",
  arrival: "text-purple-600",
  departed: "text-gray-400",
};

type ViewMode = "board" | "floor" | "list" | "attendant";

export default function HousekeepingBoard() {
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [selectedRooms, setSelectedRooms] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    status: "all",
    foStatus: "all",
    floor: "all",
    category: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFloor, setExpandedFloor] = useState<number | null>(null);
  const [showAIOptimization, setShowAIOptimization] = useState(false);

  // Copilot integration
  const { selectRoom, setPageContext } = useCopilot();

  // Set page context on mount
  useMemo(() => {
    setPageContext({ page: "housekeeping" });
  }, [setPageContext]);

  // Handle opening copilot with room context
  const handleRoomInfo = (room: Room) => {
    const roomContext: RoomContext = {
      roomNumber: room.roomNumber,
      floor: room.floor,
      category: ROOM_CATEGORIES[room.category]?.label || room.category,
      status: room.roomStatus,
      guestName: room.guestName,
      isVip: room.isVip,
    };
    selectRoom(roomContext);
  };

  // Get all rooms
  const allRooms = useMemo(() => getHotelRooms(), []);

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      if (filters.status !== "all" && room.roomStatus !== filters.status) return false;
      if (filters.foStatus !== "all" && room.foStatus !== filters.foStatus) return false;
      if (filters.floor !== "all" && room.floor !== parseInt(filters.floor)) return false;
      if (filters.category !== "all" && room.category !== filters.category) return false;
      if (searchQuery && !room.roomNumber.includes(searchQuery)) return false;
      return true;
    });
  }, [allRooms, filters, searchQuery]);

  // Get unique values for filters
  const floors = [...new Set(allRooms.map((r) => r.floor))].sort();
  const categories = [...new Set(allRooms.map((r) => r.category))];

  // Calculate statistics
  const stats = useMemo(() => ({
    total: allRooms.length,
    clean: allRooms.filter((r) => r.roomStatus === "clean").length,
    inspected: allRooms.filter((r) => r.roomStatus === "inspected").length,
    dirty: allRooms.filter((r) => r.roomStatus === "dirty").length,
    pickup: allRooms.filter((r) => r.roomStatus === "pickup").length,
    occupied: allRooms.filter((r) => r.foStatus === "occupied").length,
    arrivals: allRooms.filter((r) => r.foStatus === "arrival").length,
    departures: allRooms.filter((r) => r.foStatus === "due_out").length,
    vip: allRooms.filter((r) => r.isVip).length,
  }), [allRooms]);

  const toggleRoomSelection = (roomNumber: string) => {
    const newSelection = new Set(selectedRooms);
    if (newSelection.has(roomNumber)) {
      newSelection.delete(roomNumber);
    } else {
      newSelection.add(roomNumber);
    }
    setSelectedRooms(newSelection);
  };

  const selectAllRooms = () => {
    if (selectedRooms.size === filteredRooms.length) {
      setSelectedRooms(new Set());
    } else {
      setSelectedRooms(new Set(filteredRooms.map((r) => r.roomNumber)));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("board")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-[13px] font-medium transition-all ${
              viewMode === "board"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <LayoutGrid size={16} />
            Room Board
          </button>
          <button
            onClick={() => setViewMode("floor")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-[13px] font-medium transition-all ${
              viewMode === "floor"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Building2 size={16} />
            Floor View
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-[13px] font-medium transition-all ${
              viewMode === "list"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <List size={16} />
            List View
          </button>
          <button
            onClick={() => setViewMode("attendant")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-[13px] font-medium transition-all ${
              viewMode === "attendant"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Users size={16} />
            Attendants
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAIOptimization(true)}
            variant="primary"
            className="px-3 py-2"
          >
            <Sparkles size={16} /> AI Optimize
          </Button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-[13px] font-medium transition-all ${
              showFilters
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-9 gap-2">
        <StatCard label="Total" value={stats.total} color="gray" />
        <StatCard label="Clean" value={stats.clean} color="green" />
        <StatCard label="Inspected" value={stats.inspected} color="emerald" />
        <StatCard label="Dirty" value={stats.dirty} color="red" />
        <StatCard label="Pickup" value={stats.pickup} color="yellow" />
        <StatCard label="Occupied" value={stats.occupied} color="blue" />
        <StatCard label="Arrivals" value={stats.arrivals} color="purple" />
        <StatCard label="Departures" value={stats.departures} color="orange" />
        <StatCard label="VIP" value={stats.vip} color="amber" icon={<Star size={12} />} />
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Room Number
              </label>
              <div className="relative">
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-sm text-[13px] focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                HK Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-[13px]"
              >
                <option value="all">All Statuses</option>
                <option value="clean">Clean</option>
                <option value="inspected">Inspected</option>
                <option value="dirty">Dirty</option>
                <option value="pickup">Pickup</option>
                <option value="ooo">Out of Order</option>
                <option value="oos">Out of Service</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                FO Status
              </label>
              <select
                value={filters.foStatus}
                onChange={(e) => setFilters({ ...filters, foStatus: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-[13px]"
              >
                <option value="all">All</option>
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
                <option value="due_out">Due Out</option>
                <option value="arrival">Arrival</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Floor
              </label>
              <select
                value={filters.floor}
                onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-[13px]"
              >
                <option value="all">All Floors</option>
                {floors.map((floor) => (
                  <option key={floor} value={floor}>
                    Floor {floor}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Room Type
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-[13px]"
              >
                <option value="all">All Types</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {ROOM_CATEGORIES[cat]?.label || cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedRooms.size > 0 && (
        <div className="bg-gray-900 text-white rounded-sm p-3 flex items-center justify-between">
          <span className="text-[13px]">
            {selectedRooms.size} room{selectedRooms.size > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-green-600 rounded-sm text-[12px] hover:bg-green-700">
              Mark Clean
            </button>
            <button className="px-3 py-1 bg-blue-600 rounded-sm text-[12px] hover:bg-blue-700">
              Assign Attendant
            </button>
            <button
              onClick={() => setSelectedRooms(new Set())}
              className="px-3 py-1 bg-gray-700 rounded-sm text-[12px] hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white border border-gray-200 rounded-sm">
        {viewMode === "board" && (
          <RoomBoardView
            rooms={filteredRooms}
            selectedRooms={selectedRooms}
            onToggleSelection={toggleRoomSelection}
            onSelectAll={selectAllRooms}
            onRoomInfo={handleRoomInfo}
          />
        )}
        {viewMode === "floor" && (
          <FloorPlanView
            rooms={filteredRooms}
            selectedRooms={selectedRooms}
            onToggleSelection={toggleRoomSelection}
            expandedFloor={expandedFloor}
            onExpandFloor={setExpandedFloor}
            onRoomInfo={handleRoomInfo}
          />
        )}
        {viewMode === "list" && (
          <ListView
            rooms={filteredRooms}
            selectedRooms={selectedRooms}
            onToggleSelection={toggleRoomSelection}
            onSelectAll={selectAllRooms}
          />
        )}
        {viewMode === "attendant" && (
          <AttendantView staff={HOUSEKEEPING_STAFF} rooms={allRooms} />
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-[11px]">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-sm bg-green-100 border border-green-300" />
          Clean
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-sm bg-emerald-100 border border-emerald-300" />
          Inspected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-sm bg-red-100 border border-red-300" />
          Dirty
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-sm bg-yellow-100 border border-yellow-300" />
          Pickup
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-sm bg-gray-300 border border-gray-400" />
          OOO
        </span>
        <span className="flex items-center gap-1.5">
          <Star size={12} className="text-amber-500" />
          VIP
        </span>
      </div>

      {/* AI Optimization Panel */}
      {showAIOptimization && (
        <AIOptimizationPanel onClose={() => setShowAIOptimization(false)} />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}) {
  const colorClasses: Record<string, string> = {
    gray: "bg-white border-gray-200",
    green: "bg-green-50 border-green-200 text-green-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    red: "bg-red-50 border-red-200 text-red-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
  };

  return (
    <div className={`border rounded-sm p-2 text-center ${colorClasses[color]}`}>
      <div className="flex items-center justify-center gap-1">
        {icon}
        <span className="text-[18px] font-semibold">{value}</span>
      </div>
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}

// Room Board View (Grid)
function RoomBoardView({
  rooms,
  selectedRooms,
  onToggleSelection,
  onSelectAll,
  onRoomInfo,
}: {
  rooms: Room[];
  selectedRooms: Set<string>;
  onToggleSelection: (roomNumber: string) => void;
  onSelectAll: () => void;
  onRoomInfo?: (room: Room) => void;
}) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2 text-[13px] text-gray-600">
          <input
            type="checkbox"
            checked={selectedRooms.size === rooms.length && rooms.length > 0}
            onChange={onSelectAll}
            className="rounded"
          />
          Select All ({rooms.length} rooms)
        </label>
      </div>
      <div className="grid grid-cols-8 gap-2">
        {rooms.map((room) => (
          <RoomTile
            key={room.roomNumber}
            room={room}
            isSelected={selectedRooms.has(room.roomNumber)}
            onToggle={() => onToggleSelection(room.roomNumber)}
            onInfo={onRoomInfo ? () => onRoomInfo(room) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

// Room Tile Component
function RoomTile({
  room,
  isSelected,
  onToggle,
  onInfo,
  compact = false,
}: {
  room: Room;
  isSelected: boolean;
  onToggle: () => void;
  onInfo?: () => void;
  compact?: boolean;
}) {
  const colors = STATUS_COLORS[room.roomStatus] || STATUS_COLORS.dirty;

  return (
    <div
      className={`group relative rounded-sm border-2 ${colors.border} ${colors.bg} ${
        compact ? "p-1.5" : "p-2"
      } cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onToggle}
    >
      {/* Info button */}
      {onInfo && !compact && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInfo();
          }}
          className="absolute top-1 left-1 p-0.5 rounded hover:bg-white/50 transition-colors opacity-0 group-hover:opacity-100"
          title="View in Copilot"
        >
          <Sparkles size={12} className="text-gray-500" />
        </button>
      )}

      {/* VIP Badge */}
      {room.isVip && (
        <div className="absolute -top-1 -right-1">
          <Star size={14} className="text-amber-500 fill-amber-500" />
        </div>
      )}

      {/* Room Number */}
      <div className={`font-bold text-gray-900 ${compact ? "text-[13px]" : "text-[16px]"}`}>
        {room.roomNumber}
      </div>

      {/* Room Type (short) */}
      <div className={`text-gray-500 truncate ${compact ? "text-[9px]" : "text-[10px]"}`}>
        {room.category.includes("suite")
          ? "Suite"
          : room.category === "deluxe"
          ? "DLX"
          : room.category === "premier"
          ? "PRM"
          : room.category === "superior"
          ? "SUP"
          : room.category === "terrace"
          ? "TER"
          : room.category.substring(0, 3).toUpperCase()}
      </div>

      {/* FO Status indicator */}
      {!compact && (
        <div className={`text-[9px] mt-1 ${FO_STATUS_COLORS[room.foStatus]}`}>
          {room.foStatus === "occupied" && "OCC"}
          {room.foStatus === "vacant" && "VAC"}
          {room.foStatus === "due_out" && "D/O"}
          {room.foStatus === "arrival" && "ARR"}
        </div>
      )}

      {/* Guest name if occupied */}
      {!compact && room.guestName && (
        <div className="text-[9px] text-gray-500 truncate mt-0.5">
          {room.guestName}
        </div>
      )}
    </div>
  );
}

// Floor Plan View
function FloorPlanView({
  rooms,
  selectedRooms,
  onToggleSelection,
  expandedFloor,
  onExpandFloor,
  onRoomInfo,
}: {
  rooms: Room[];
  selectedRooms: Set<string>;
  onToggleSelection: (roomNumber: string) => void;
  expandedFloor: number | null;
  onExpandFloor: (floor: number | null) => void;
  onRoomInfo?: (room: Room) => void;
}) {
  const floors = [9, 8, 7, 6, 5, 4, 3, 2]; // Top to bottom

  return (
    <div className="divide-y divide-gray-200">
      {floors.map((floor) => {
        const floorRooms = rooms.filter((r) => r.floor === floor);
        const floorLayout = FLOOR_LAYOUTS[floor];
        const summary = getFloorSummary(floor);
        const isExpanded = expandedFloor === floor;

        return (
          <div key={floor} className="p-4">
            {/* Floor Header */}
            <button
              onClick={() => onExpandFloor(isExpanded ? null : floor)}
              className="w-full flex items-center justify-between mb-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-gray-100 flex items-center justify-center">
                  <span className="text-[18px] font-bold text-gray-700">{floor}</span>
                </div>
                <div className="text-left">
                  <div className="text-[14px] font-semibold text-gray-900">
                    {floorLayout?.name || `Floor ${floor}`}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {floorLayout?.description || `${floorRooms.length} rooms`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Floor Stats */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                    {summary.clean + summary.inspected} Clean
                  </span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded">
                    {summary.dirty} Dirty
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                    {summary.occupied} Occ
                  </span>
                  {summary.vip > 0 && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded flex items-center gap-1">
                      <Star size={10} />
                      {summary.vip} VIP
                    </span>
                  )}
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {/* Floor Rooms */}
            {isExpanded && floorLayout && (
              <div className="space-y-4 mt-4">
                {floorLayout.wings.map((wing) => {
                  const wingRooms = floorRooms.filter((r) =>
                    wing.rooms.includes(r.roomNumber)
                  );
                  return (
                    <div key={wing.name}>
                      <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {wing.name}
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        {wingRooms.map((room) => (
                          <RoomTile
                            key={room.roomNumber}
                            room={room}
                            isSelected={selectedRooms.has(room.roomNumber)}
                            onToggle={() => onToggleSelection(room.roomNumber)}
                            onInfo={onRoomInfo ? () => onRoomInfo(room) : undefined}
                            compact
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Collapsed view - show mini tiles */}
            {!isExpanded && (
              <div className="grid grid-cols-24 gap-1">
                {floorRooms
                  .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
                  .map((room) => {
                    const colors = STATUS_COLORS[room.roomStatus];
                    return (
                      <div
                        key={room.roomNumber}
                        className={`h-6 rounded-sm ${colors.bg} border ${colors.border} flex items-center justify-center cursor-pointer hover:opacity-80`}
                        onClick={() => onToggleSelection(room.roomNumber)}
                        title={`${room.roomNumber} - ${room.categoryLabel} - ${room.roomStatus}`}
                      >
                        {room.isVip && <Star size={8} className="text-amber-600" />}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// List View
function ListView({
  rooms,
  selectedRooms,
  onToggleSelection,
  onSelectAll,
}: {
  rooms: Room[];
  selectedRooms: Set<string>;
  onToggleSelection: (roomNumber: string) => void;
  onSelectAll: () => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-3 py-2 text-left">
              <input
                type="checkbox"
                checked={selectedRooms.size === rooms.length && rooms.length > 0}
                onChange={onSelectAll}
                className="rounded"
              />
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-600">Room</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-600">Floor</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-600">Type</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-600">View</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-600">HK Status</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-600">FO Status</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-600">Guest</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-600">VIP</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-600">Size</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rooms.map((room) => {
            const colors = STATUS_COLORS[room.roomStatus];
            return (
              <tr key={room.roomNumber} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRooms.has(room.roomNumber)}
                    onChange={() => onToggleSelection(room.roomNumber)}
                    className="rounded"
                  />
                </td>
                <td className="px-3 py-2 font-semibold">{room.roomNumber}</td>
                <td className="px-3 py-2">{room.floor}</td>
                <td className="px-3 py-2">{room.categoryLabel}</td>
                <td className="px-3 py-2 capitalize">{room.view}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${colors.bg} ${colors.text}`}>
                    {room.roomStatus}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className={`capitalize ${FO_STATUS_COLORS[room.foStatus]}`}>
                    {room.foStatus.replace("_", " ")}
                  </span>
                </td>
                <td className="px-3 py-2">{room.guestName || "-"}</td>
                <td className="px-3 py-2">
                  {room.isVip && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-medium">
                      {room.vipCode}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-gray-500">{room.sqm}m²</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Attendant View
function AttendantView({
  staff,
  rooms,
}: {
  staff: HousekeepingStaff[];
  rooms: Room[];
}) {
  const attendants = staff.filter((s) => s.role === "attendant");
  const supervisors = staff.filter((s) => s.role === "supervisor" || s.role === "inspector");

  return (
    <div className="p-4 space-y-6">
      {/* Supervisors */}
      <div>
        <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Supervisors & Inspectors
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {supervisors.map((person) => (
            <StaffCard key={person.id} person={person} rooms={rooms} />
          ))}
        </div>
      </div>

      {/* Attendants */}
      <div>
        <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Room Attendants
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {attendants.map((person) => (
            <AttendantCard key={person.id} person={person} rooms={rooms} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StaffCard({ person, rooms }: { person: HousekeepingStaff; rooms: Room[] }) {
  const statusColors: Record<string, string> = {
    available: "bg-green-500",
    busy: "bg-blue-500",
    break: "bg-yellow-500",
    off_duty: "bg-gray-400",
  };

  return (
    <div className="p-3 border border-gray-200 rounded-sm">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${statusColors[person.status]} flex items-center justify-center text-white font-semibold text-[14px]`}>
          {person.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <div className="text-[13px] font-semibold">{person.name}</div>
          <div className="text-[11px] text-gray-500 capitalize">
            {person.role.replace("_", " ")} | Floor {person.currentFloor}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendantCard({ person, rooms }: { person: HousekeepingStaff; rooms: Room[] }) {
  const assignedRooms = rooms.filter((r) => person.assignedRooms.includes(r.roomNumber));
  const statusColors: Record<string, string> = {
    available: "bg-green-500",
    busy: "bg-blue-500",
    break: "bg-yellow-500",
    off_duty: "bg-gray-400",
  };

  return (
    <div className="p-4 border border-gray-200 rounded-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${statusColors[person.status]} flex items-center justify-center text-white font-semibold`}>
            {person.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div className="text-[14px] font-semibold">{person.name}</div>
            <div className="text-[11px] text-gray-500">
              Floor {person.currentFloor} | {person.shiftStart} - {person.shiftEnd}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[20px] font-bold">{person.roomsCompleted}</div>
          <div className="text-[10px] text-gray-500">Completed</div>
        </div>
      </div>

      {/* Assigned Rooms */}
      <div className="text-[11px] text-gray-500 mb-2">
        Assigned: {person.assignedRooms.length} rooms
      </div>
      <div className="grid grid-cols-4 gap-1">
        {assignedRooms.map((room) => {
          const colors = STATUS_COLORS[room.roomStatus];
          return (
            <div
              key={room.roomNumber}
              className={`p-1.5 rounded-sm ${colors.bg} border ${colors.border} text-center`}
            >
              <div className="text-[12px] font-bold">{room.roomNumber}</div>
              {room.isVip && <Star size={10} className="mx-auto text-amber-600" />}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
        <span className="text-gray-500">
          Avg: {person.avgCleaningTime} min/room
        </span>
        <span className={`px-2 py-0.5 rounded capitalize ${
          person.status === "available" ? "bg-green-100 text-green-700" :
          person.status === "busy" ? "bg-blue-100 text-blue-700" :
          "bg-yellow-100 text-yellow-700"
        }`}>
          {person.status}
        </span>
      </div>
    </div>
  );
}
