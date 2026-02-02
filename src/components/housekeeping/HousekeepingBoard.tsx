"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LayoutGrid,
  List,
  Users,
  Building2,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronDown,
  Search,
} from "lucide-react";

// OPERA-compatible status types
type RoomStatus = "clean" | "dirty" | "pickup" | "inspected" | "ooo" | "oos";
type FOStatus = "vacant" | "occupied";
type ReservationStatus = "arrival" | "arrived" | "stayover" | "due_out" | "departed" | "not_reserved";

interface HousekeepingTask {
  id: string;
  roomNumber: string;
  roomType: "suite" | "deluxe" | "standard";
  floor: number;
  checkoutTime: string;
  nextArrival?: string;
  nextGuestVip: boolean;
  nextGuestPreferences?: string[];
  priority: number;
  priorityLevel: "high" | "medium" | "low";
  assignedTo?: string[];
  status: "pending" | "assigned" | "in_progress" | "complete";
  opera?: {
    roomStatus?: string;
    hkStatus?: string;
    foStatus?: string;
    vipCode?: string;
  };
}

interface Housekeeper {
  id: string;
  name: string;
  currentFloor: number;
  assignedRooms: number;
  status: "available" | "busy" | "break";
}

interface QueueData {
  queue: HousekeepingTask[];
  staff: Housekeeper[];
  summary: {
    pending: number;
    inProgress: number;
    staffAvailable: number;
    staffBusy: number;
    staffOnBreak: number;
  };
}

// OPERA status color mapping
const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  clean: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  inspected: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
  dirty: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  pickup: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  ooo: { bg: "bg-gray-200", text: "text-gray-600", border: "border-gray-400" },
  oos: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  pending: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  assigned: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  in_progress: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  complete: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
};

const PRIORITY_COLORS = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500",
};

type ViewMode = "board" | "floor" | "list" | "attendant";

export default function HousekeepingBoard() {
  const [data, setData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [selectedRooms, setSelectedRooms] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    status: "all",
    floor: "all",
    priority: "all",
    assignee: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch("/api/housekeeping/queue");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch queue:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  const handleStatusUpdate = async (taskId: string, status: string) => {
    try {
      await fetch(`/api/housekeeping/task/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchQueue();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    for (const roomId of selectedRooms) {
      await handleStatusUpdate(roomId, status);
    }
    setSelectedRooms(new Set());
  };

  const handleCheckout = async (roomNumber: string, vip: boolean = false) => {
    try {
      await fetch("/api/housekeeping/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber,
          nextArrival: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          nextGuestVip: vip,
        }),
      });
      fetchQueue();
    } catch (error) {
      console.error("Failed to trigger checkout:", error);
    }
  };

  const toggleRoomSelection = (taskId: string) => {
    const newSelection = new Set(selectedRooms);
    if (newSelection.has(taskId)) {
      newSelection.delete(taskId);
    } else {
      newSelection.add(taskId);
    }
    setSelectedRooms(newSelection);
  };

  const selectAllRooms = () => {
    if (selectedRooms.size === filteredQueue.length) {
      setSelectedRooms(new Set());
    } else {
      setSelectedRooms(new Set(filteredQueue.map((t) => t.id)));
    }
  };

  // Filter queue based on current filters
  const filteredQueue = (data?.queue || []).filter((task) => {
    if (filters.status !== "all" && task.status !== filters.status) return false;
    if (filters.floor !== "all" && task.floor !== parseInt(filters.floor)) return false;
    if (filters.priority !== "all" && task.priorityLevel !== filters.priority) return false;
    if (filters.assignee !== "all") {
      if (filters.assignee === "unassigned" && task.assignedTo?.length) return false;
      if (filters.assignee !== "unassigned" && !task.assignedTo?.includes(filters.assignee)) return false;
    }
    if (searchQuery && !task.roomNumber.includes(searchQuery)) return false;
    return true;
  });

  // Group tasks by floor for floor view
  const tasksByFloor = filteredQueue.reduce((acc, task) => {
    if (!acc[task.floor]) acc[task.floor] = [];
    acc[task.floor].push(task);
    return acc;
  }, {} as Record<number, HousekeepingTask[]>);

  // Group tasks by attendant for attendant view
  const tasksByAttendant = (data?.staff || []).map((staff) => ({
    ...staff,
    tasks: filteredQueue.filter((t) => t.assignedTo?.includes(staff.id)),
  }));

  // Get unique floors for filter
  const floors = [...new Set((data?.queue || []).map((t) => t.floor))].sort();

  // Calculate statistics
  const stats = {
    total: data?.queue.length || 0,
    clean: data?.queue.filter((t) => t.status === "complete").length || 0,
    dirty: data?.queue.filter((t) => t.status === "pending").length || 0,
    pickup: data?.queue.filter((t) => t.status === "assigned").length || 0,
    inProgress: data?.queue.filter((t) => t.status === "in_progress").length || 0,
    highPriority: data?.queue.filter((t) => t.priorityLevel === "high").length || 0,
    vipArrivals: data?.queue.filter((t) => t.nextGuestVip).length || 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("board")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-[13px] font-medium transition-all ${
              viewMode === "board"
                ? "bg-black text-white"
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
                ? "bg-black text-white"
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
                ? "bg-black text-white"
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
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Users size={16} />
            Attendants
          </button>
        </div>
        <div className="flex items-center gap-2">
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
          <button
            onClick={fetchQueue}
            className="flex items-center gap-1.5 px-3 py-2 rounded-sm bg-gray-100 text-gray-600 hover:bg-gray-200 text-[13px] font-medium"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Bar - OPERA Style */}
      <div className="grid grid-cols-7 gap-2">
        <div className="bg-white border border-gray-200 rounded-sm p-3 text-center">
          <div className="text-[20px] font-semibold text-gray-900">{stats.total}</div>
          <div className="text-[11px] text-gray-500 uppercase tracking-wider">Total Rooms</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-sm p-3 text-center">
          <div className="text-[20px] font-semibold text-green-700">{stats.clean}</div>
          <div className="text-[11px] text-green-600 uppercase tracking-wider">Clean</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-sm p-3 text-center">
          <div className="text-[20px] font-semibold text-red-700">{stats.dirty}</div>
          <div className="text-[11px] text-red-600 uppercase tracking-wider">Dirty</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-3 text-center">
          <div className="text-[20px] font-semibold text-yellow-700">{stats.pickup}</div>
          <div className="text-[11px] text-yellow-600 uppercase tracking-wider">Pickup</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-sm p-3 text-center">
          <div className="text-[20px] font-semibold text-blue-700">{stats.inProgress}</div>
          <div className="text-[11px] text-blue-600 uppercase tracking-wider">In Progress</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-sm p-3 text-center">
          <div className="text-[20px] font-semibold text-orange-700">{stats.highPriority}</div>
          <div className="text-[11px] text-orange-600 uppercase tracking-wider">High Priority</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-sm p-3 text-center">
          <div className="text-[20px] font-semibold text-purple-700">{stats.vipArrivals}</div>
          <div className="text-[11px] text-purple-600 uppercase tracking-wider">VIP Arrivals</div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
          <div className="grid grid-cols-5 gap-4">
            {/* Search */}
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
            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Room Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-[13px] focus:outline-none focus:border-gray-400"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Dirty</option>
                <option value="assigned">Pickup</option>
                <option value="in_progress">In Progress</option>
                <option value="complete">Clean</option>
              </select>
            </div>
            {/* Floor Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Floor
              </label>
              <select
                value={filters.floor}
                onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-[13px] focus:outline-none focus:border-gray-400"
              >
                <option value="all">All Floors</option>
                {floors.map((floor) => (
                  <option key={floor} value={floor}>
                    Floor {floor}
                  </option>
                ))}
              </select>
            </div>
            {/* Priority Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-[13px] focus:outline-none focus:border-gray-400"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            {/* Attendant Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Attendant
              </label>
              <select
                value={filters.assignee}
                onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-[13px] focus:outline-none focus:border-gray-400"
              >
                <option value="all">All Attendants</option>
                <option value="unassigned">Unassigned</option>
                {data?.staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Demo Checkout - Compact */}
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-blue-700">Demo: Trigger Checkout</span>
          <div className="flex gap-2">
            {["412", "508", "720", "801", "605"].map((room) => (
              <button
                key={room}
                onClick={() => handleCheckout(room, room === "801" || room === "720")}
                className="px-2 py-1 bg-white border border-blue-300 rounded-sm text-[12px] text-blue-700 hover:bg-blue-100"
              >
                {room}
                {(room === "801" || room === "720") && <span className="ml-1 text-amber-600">★</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRooms.size > 0 && (
        <div className="bg-gray-900 text-white rounded-sm p-3 flex items-center justify-between">
          <span className="text-[13px]">
            {selectedRooms.size} room{selectedRooms.size > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkStatusUpdate("in_progress")}
              className="px-3 py-1 bg-blue-600 rounded-sm text-[12px] hover:bg-blue-700"
            >
              Start Cleaning
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("complete")}
              className="px-3 py-1 bg-green-600 rounded-sm text-[12px] hover:bg-green-700"
            >
              Mark Clean
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

      {/* Main Content Area */}
      <div className="bg-white border border-gray-200 rounded-sm">
        {filteredQueue.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Building2 size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-[14px]">No rooms in queue</p>
            <p className="text-[12px]">Trigger a checkout above to add rooms</p>
          </div>
        ) : viewMode === "board" ? (
          <RoomBoardView
            tasks={filteredQueue}
            selectedRooms={selectedRooms}
            onToggleSelection={toggleRoomSelection}
            onSelectAll={selectAllRooms}
            onStatusUpdate={handleStatusUpdate}
            staff={data?.staff || []}
          />
        ) : viewMode === "floor" ? (
          <FloorView
            tasksByFloor={tasksByFloor}
            selectedRooms={selectedRooms}
            onToggleSelection={toggleRoomSelection}
            onStatusUpdate={handleStatusUpdate}
            staff={data?.staff || []}
          />
        ) : viewMode === "list" ? (
          <ListView
            tasks={filteredQueue}
            selectedRooms={selectedRooms}
            onToggleSelection={toggleRoomSelection}
            onSelectAll={selectAllRooms}
            onStatusUpdate={handleStatusUpdate}
            staff={data?.staff || []}
          />
        ) : (
          <AttendantView
            attendants={tasksByAttendant}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </div>
  );
}

// Room Board View (Grid)
function RoomBoardView({
  tasks,
  selectedRooms,
  onToggleSelection,
  onSelectAll,
  onStatusUpdate,
  staff,
}: {
  tasks: HousekeepingTask[];
  selectedRooms: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onStatusUpdate: (id: string, status: string) => void;
  staff: Housekeeper[];
}) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2 text-[13px] text-gray-600">
          <input
            type="checkbox"
            checked={selectedRooms.size === tasks.length && tasks.length > 0}
            onChange={onSelectAll}
            className="rounded"
          />
          Select All
        </label>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-300" /> Dirty
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-300" /> Pickup
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-300" /> In Progress
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-300" /> Clean
          </span>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {tasks.map((task) => (
          <RoomTile
            key={task.id}
            task={task}
            isSelected={selectedRooms.has(task.id)}
            onToggle={() => onToggleSelection(task.id)}
            onStatusUpdate={onStatusUpdate}
            staff={staff}
          />
        ))}
      </div>
    </div>
  );
}

// Room Tile Component
function RoomTile({
  task,
  isSelected,
  onToggle,
  onStatusUpdate,
  staff,
}: {
  task: HousekeepingTask;
  isSelected: boolean;
  onToggle: () => void;
  onStatusUpdate: (id: string, status: string) => void;
  staff: Housekeeper[];
}) {
  const colors = STATUS_COLORS[task.status] || STATUS_COLORS.pending;
  const assignedStaff = staff.filter((s) => task.assignedTo?.includes(s.id));

  return (
    <div
      className={`relative rounded-sm border-2 ${colors.border} ${colors.bg} p-3 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-blue-500" : ""
      } border-l-4 ${PRIORITY_COLORS[task.priorityLevel]}`}
      onClick={onToggle}
    >
      {/* Selection checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-2 right-2"
      />

      {/* Room Number */}
      <div className="text-[18px] font-bold text-gray-900">{task.roomNumber}</div>

      {/* Room Type */}
      <div className="text-[11px] text-gray-500 uppercase">{task.roomType}</div>

      {/* VIP Badge */}
      {task.nextGuestVip && (
        <div className="absolute top-2 left-2">
          <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-sm">
            VIP
          </span>
        </div>
      )}

      {/* Status */}
      <div className={`mt-2 text-[11px] font-medium ${colors.text} uppercase`}>
        {task.status.replace("_", " ")}
      </div>

      {/* Assigned Staff */}
      {assignedStaff.length > 0 && (
        <div className="mt-1 text-[10px] text-gray-500 truncate">
          {assignedStaff.map((s) => s.name.split(" ")[0]).join(", ")}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-2 flex gap-1" onClick={(e) => e.stopPropagation()}>
        {task.status === "pending" && (
          <button
            onClick={() => onStatusUpdate(task.id, "in_progress")}
            className="flex-1 px-1 py-0.5 bg-blue-600 text-white text-[9px] rounded-sm hover:bg-blue-700"
          >
            Start
          </button>
        )}
        {task.status === "assigned" && (
          <button
            onClick={() => onStatusUpdate(task.id, "in_progress")}
            className="flex-1 px-1 py-0.5 bg-blue-600 text-white text-[9px] rounded-sm hover:bg-blue-700"
          >
            Start
          </button>
        )}
        {task.status === "in_progress" && (
          <button
            onClick={() => onStatusUpdate(task.id, "complete")}
            className="flex-1 px-1 py-0.5 bg-green-600 text-white text-[9px] rounded-sm hover:bg-green-700"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}

// Floor View
function FloorView({
  tasksByFloor,
  selectedRooms,
  onToggleSelection,
  onStatusUpdate,
  staff,
}: {
  tasksByFloor: Record<number, HousekeepingTask[]>;
  selectedRooms: Set<string>;
  onToggleSelection: (id: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
  staff: Housekeeper[];
}) {
  const floors = Object.keys(tasksByFloor)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="divide-y divide-gray-200">
      {floors.map((floor) => (
        <div key={floor} className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={16} className="text-gray-400" />
            <span className="text-[14px] font-semibold text-gray-900">Floor {floor}</span>
            <span className="text-[12px] text-gray-500">
              ({tasksByFloor[floor].length} rooms)
            </span>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {tasksByFloor[floor]
              .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
              .map((task) => (
                <RoomTile
                  key={task.id}
                  task={task}
                  isSelected={selectedRooms.has(task.id)}
                  onToggle={() => onToggleSelection(task.id)}
                  onStatusUpdate={onStatusUpdate}
                  staff={staff}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// List View (Table)
function ListView({
  tasks,
  selectedRooms,
  onToggleSelection,
  onSelectAll,
  onStatusUpdate,
  staff,
}: {
  tasks: HousekeepingTask[];
  selectedRooms: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onStatusUpdate: (id: string, status: string) => void;
  staff: Housekeeper[];
}) {
  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-4 py-3 text-left">
            <input
              type="checkbox"
              checked={selectedRooms.size === tasks.length && tasks.length > 0}
              onChange={onSelectAll}
              className="rounded"
            />
          </th>
          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Room
          </th>
          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Type
          </th>
          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Floor
          </th>
          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Status
          </th>
          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Priority
          </th>
          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Attendant
          </th>
          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Next Arrival
          </th>
          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {tasks.map((task) => {
          const colors = STATUS_COLORS[task.status];
          const assignedStaff = staff.filter((s) => task.assignedTo?.includes(s.id));
          return (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRooms.has(task.id)}
                  onChange={() => onToggleSelection(task.id)}
                  className="rounded"
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[14px]">{task.roomNumber}</span>
                  {task.nextGuestVip && (
                    <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-sm">
                      VIP
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-[13px] text-gray-600 capitalize">{task.roomType}</td>
              <td className="px-4 py-3 text-[13px] text-gray-600">{task.floor}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-sm text-[11px] font-medium ${colors.bg} ${colors.text}`}
                >
                  {task.status.replace("_", " ").toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-sm text-[11px] font-medium ${
                    task.priorityLevel === "high"
                      ? "bg-red-100 text-red-700"
                      : task.priorityLevel === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.priorityLevel.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-[13px] text-gray-600">
                {assignedStaff.length > 0
                  ? assignedStaff.map((s) => s.name).join(", ")
                  : "-"}
              </td>
              <td className="px-4 py-3 text-[13px] text-gray-600">
                {task.nextArrival
                  ? new Date(task.nextArrival).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  {(task.status === "pending" || task.status === "assigned") && (
                    <button
                      onClick={() => onStatusUpdate(task.id, "in_progress")}
                      className="px-2 py-1 bg-blue-600 text-white text-[11px] rounded-sm hover:bg-blue-700"
                    >
                      Start
                    </button>
                  )}
                  {task.status === "in_progress" && (
                    <button
                      onClick={() => onStatusUpdate(task.id, "complete")}
                      className="px-2 py-1 bg-green-600 text-white text-[11px] rounded-sm hover:bg-green-700"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// Attendant View
function AttendantView({
  attendants,
  onStatusUpdate,
}: {
  attendants: (Housekeeper & { tasks: HousekeepingTask[] })[];
  onStatusUpdate: (id: string, status: string) => void;
}) {
  return (
    <div className="divide-y divide-gray-200">
      {attendants.map((attendant) => (
        <div key={attendant.id} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  attendant.status === "available"
                    ? "bg-green-500"
                    : attendant.status === "busy"
                    ? "bg-blue-500"
                    : "bg-gray-400"
                }`}
              >
                {attendant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-gray-900">{attendant.name}</div>
                <div className="text-[12px] text-gray-500">
                  Floor {attendant.currentFloor} •{" "}
                  <span
                    className={
                      attendant.status === "available"
                        ? "text-green-600"
                        : attendant.status === "busy"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }
                  >
                    {attendant.status.charAt(0).toUpperCase() + attendant.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[20px] font-semibold text-gray-900">
                {attendant.tasks.length}
              </div>
              <div className="text-[11px] text-gray-500">Assigned Rooms</div>
            </div>
          </div>

          {attendant.tasks.length > 0 ? (
            <div className="grid grid-cols-6 gap-2">
              {attendant.tasks.map((task) => {
                const colors = STATUS_COLORS[task.status];
                return (
                  <div
                    key={task.id}
                    className={`rounded-sm border ${colors.border} ${colors.bg} p-2 text-center`}
                  >
                    <div className="text-[14px] font-bold text-gray-900">{task.roomNumber}</div>
                    <div className={`text-[10px] ${colors.text} uppercase`}>
                      {task.status.replace("_", " ")}
                    </div>
                    {task.nextGuestVip && (
                      <span className="inline-block mt-1 px-1 py-0.5 bg-amber-500 text-white text-[8px] font-bold rounded-sm">
                        VIP
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-[13px] text-gray-400 italic">No rooms assigned</div>
          )}
        </div>
      ))}
    </div>
  );
}
