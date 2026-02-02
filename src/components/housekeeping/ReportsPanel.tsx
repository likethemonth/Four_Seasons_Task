"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  FileText,
  ClipboardList,
  LayoutDashboard,
  Star,
  Download,
  Printer,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  getHotelRooms,
  getFloorSummary,
  HOUSEKEEPING_STAFF,
  FLOOR_LAYOUTS,
  type Room,
} from "@/lib/data/parkLaneRooms";

type ReportType =
  | "details"
  | "productivity"
  | "discrepancy"
  | "assignment"
  | "statistics"
  | "vip";

export default function ReportsPanel() {
  const [activeReport, setActiveReport] = useState<ReportType | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const rooms = getHotelRooms();

  const reports = [
    {
      id: "details" as ReportType,
      title: "Housekeeping Details Report",
      description: "Room status information for all or selected rooms",
      icon: <Building2 size={20} />,
    },
    {
      id: "productivity" as ReportType,
      title: "Attendant Productivity",
      description: "Credits and rooms cleaned by attendant",
      icon: <Users size={20} />,
    },
    {
      id: "discrepancy" as ReportType,
      title: "Room Discrepancy Report",
      description: "FO and Housekeeping status conflicts",
      icon: <AlertTriangle size={20} />,
    },
    {
      id: "assignment" as ReportType,
      title: "Task Assignment Sheet",
      description: "Daily task sheets for housekeeping staff",
      icon: <ClipboardList size={20} />,
    },
    {
      id: "statistics" as ReportType,
      title: "Room Statistics",
      description: "Compiled room status and reservation data",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "vip" as ReportType,
      title: "VIP Arrivals Report",
      description: "Rooms with VIP guests arriving today",
      icon: <Star size={20} />,
    },
  ];

  if (activeReport) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveReport(null)}
            className="text-[13px] text-gray-600 hover:text-gray-900"
          >
            &larr; Back to Reports
          </button>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-sm text-[12px]">
              <Printer size={14} />
              Print
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-sm text-[12px]">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
        {activeReport === "details" && <HousekeepingDetailsReport rooms={rooms} />}
        {activeReport === "productivity" && <ProductivityReport />}
        {activeReport === "discrepancy" && <DiscrepancyReport rooms={rooms} />}
        {activeReport === "assignment" && <AssignmentSheet />}
        {activeReport === "statistics" && <StatisticsReport rooms={rooms} />}
        {activeReport === "vip" && <VIPArrivalsReport rooms={rooms} />}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[16px] font-semibold text-gray-900">
            Housekeeping Reports
          </h2>
          <p className="text-[12px] text-gray-500 mt-1">
            Four Seasons Park Lane - {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <Calendar size={14} />
          <span>Report Date: Today</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            className="flex items-start gap-3 p-4 border border-gray-200 rounded-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-left"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center text-gray-600">
              {report.icon}
            </div>
            <div>
              <div className="text-[13px] font-medium text-gray-900">
                {report.title}
              </div>
              <div className="text-[12px] text-gray-500 mt-0.5">
                {report.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Housekeeping Details Report
function HousekeepingDetailsReport({ rooms }: { rooms: Room[] }) {
  const [floorFilter, setFloorFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRooms = rooms.filter((room) => {
    if (floorFilter !== "all" && room.floor !== parseInt(floorFilter)) return false;
    if (statusFilter !== "all" && room.roomStatus !== statusFilter) return false;
    return true;
  });

  const floors = [...new Set(rooms.map((r) => r.floor))].sort();

  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-[14px] font-semibold text-gray-900">
          Housekeeping Details Report
        </h3>
        <div className="flex gap-4 mt-3">
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-sm text-[12px]"
          >
            <option value="all">All Floors</option>
            {floors.map((f) => (
              <option key={f} value={f}>
                Floor {f}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-sm text-[12px]"
          >
            <option value="all">All Statuses</option>
            <option value="clean">Clean</option>
            <option value="dirty">Dirty</option>
            <option value="pickup">Pickup</option>
            <option value="inspected">Inspected</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-600">Room</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-600">Floor</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-600">Type</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-600">HK Status</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-600">FO Status</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-600">Guest</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-600">VIP</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-600">Attendant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRooms.slice(0, 50).map((room) => (
              <tr key={room.roomNumber} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">{room.roomNumber}</td>
                <td className="px-3 py-2">{room.floor}</td>
                <td className="px-3 py-2">{room.categoryLabel}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={room.roomStatus} />
                </td>
                <td className="px-3 py-2 capitalize">{room.foStatus.replace("_", " ")}</td>
                <td className="px-3 py-2">{room.guestName || "-"}</td>
                <td className="px-3 py-2">
                  {room.isVip && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-medium">
                      {room.vipCode}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">{room.assignedAttendant || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-gray-200 text-[11px] text-gray-500">
        Showing {Math.min(filteredRooms.length, 50)} of {filteredRooms.length} rooms
      </div>
    </div>
  );
}

// Productivity Report
function ProductivityReport() {
  const staff = HOUSEKEEPING_STAFF.filter((s) => s.role === "attendant");

  const totalRoomsCompleted = staff.reduce((sum, s) => sum + s.roomsCompleted, 0);
  const avgTime = staff.reduce((sum, s) => sum + s.avgCleaningTime, 0) / staff.length;

  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-[14px] font-semibold text-gray-900">
          Attendant Productivity Report
        </h3>
        <p className="text-[12px] text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-GB")} - AM Shift (07:00 - 15:00)
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200">
        <div className="text-center">
          <div className="text-[24px] font-semibold text-gray-900">{staff.length}</div>
          <div className="text-[11px] text-gray-500">Attendants</div>
        </div>
        <div className="text-center">
          <div className="text-[24px] font-semibold text-green-600">{totalRoomsCompleted}</div>
          <div className="text-[11px] text-gray-500">Rooms Completed</div>
        </div>
        <div className="text-center">
          <div className="text-[24px] font-semibold text-blue-600">{avgTime.toFixed(0)}</div>
          <div className="text-[11px] text-gray-500">Avg Minutes/Room</div>
        </div>
        <div className="text-center">
          <div className="text-[24px] font-semibold text-gray-900">
            {(totalRoomsCompleted / staff.length).toFixed(1)}
          </div>
          <div className="text-[11px] text-gray-500">Avg Rooms/Attendant</div>
        </div>
      </div>

      {/* Staff Table */}
      <table className="w-full text-[12px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Attendant</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Floor</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Status</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Assigned</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Completed</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Avg Time</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Performance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {staff.map((s) => {
            const performance = s.avgCleaningTime <= 30 ? "excellent" : s.avgCleaningTime <= 35 ? "good" : "average";
            return (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">{s.currentFloor}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      s.status === "available"
                        ? "bg-green-100 text-green-700"
                        : s.status === "busy"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3">{s.assignedRooms.length}</td>
                <td className="px-4 py-3 font-medium text-green-600">{s.roomsCompleted}</td>
                <td className="px-4 py-3">{s.avgCleaningTime} min</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          performance === "excellent"
                            ? "bg-green-500"
                            : performance === "good"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${Math.min(100, (30 / s.avgCleaningTime) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 capitalize">{performance}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Discrepancy Report
function DiscrepancyReport({ rooms }: { rooms: Room[] }) {
  // Find rooms with status conflicts
  const discrepancies = rooms.filter((room) => {
    // FO says occupied but HK says clean (shouldn't be cleaned if occupied)
    if (room.foStatus === "occupied" && room.roomStatus === "clean") return true;
    // FO says departed but HK hasn't marked dirty
    if (room.foStatus === "departed" && room.roomStatus === "clean") return true;
    // FO says arrival but room is dirty
    if (room.foStatus === "arrival" && room.roomStatus === "dirty") return true;
    return false;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-[14px] font-semibold text-gray-900">
          Room Discrepancy Report
        </h3>
        <p className="text-[12px] text-gray-500 mt-1">
          Conflicts between Front Office and Housekeeping status
        </p>
      </div>

      {discrepancies.length === 0 ? (
        <div className="p-8 text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
          <p className="text-[14px] text-gray-600">No discrepancies found</p>
          <p className="text-[12px] text-gray-500">All room statuses are in sync</p>
        </div>
      ) : (
        <table className="w-full text-[12px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Room</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">FO Status</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">HK Status</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Issue</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {discrepancies.map((room) => {
              let issue = "";
              if (room.foStatus === "occupied" && room.roomStatus === "clean") {
                issue = "Room marked clean but guest still in-house";
              } else if (room.foStatus === "departed" && room.roomStatus === "clean") {
                issue = "Guest departed but room not marked dirty";
              } else if (room.foStatus === "arrival" && room.roomStatus === "dirty") {
                issue = "Arrival expected but room still dirty";
              }

              return (
                <tr key={room.roomNumber} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{room.roomNumber}</td>
                  <td className="px-4 py-3 capitalize">{room.foStatus.replace("_", " ")}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={room.roomStatus} />
                  </td>
                  <td className="px-4 py-3 text-amber-600">{issue}</td>
                  <td className="px-4 py-3">
                    <button className="px-2 py-1 bg-blue-600 text-white rounded-sm text-[10px] hover:bg-blue-700">
                      Resolve
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Assignment Sheet
function AssignmentSheet() {
  const staff = HOUSEKEEPING_STAFF.filter((s) => s.role === "attendant");
  const rooms = getHotelRooms();

  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-[14px] font-semibold text-gray-900">
          Task Assignment Sheet
        </h3>
        <p className="text-[12px] text-gray-500 mt-1">
          Daily room assignments for housekeeping staff
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {staff.map((attendant) => {
          const assignedRooms = rooms.filter((r) =>
            attendant.assignedRooms.includes(r.roomNumber)
          );

          return (
            <div key={attendant.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[14px] font-semibold">
                    {attendant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold">{attendant.name}</div>
                    <div className="text-[11px] text-gray-500">
                      Floor {attendant.currentFloor} | Shift: {attendant.shiftStart} - {attendant.shiftEnd}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-semibold">{attendant.assignedRooms.length}</div>
                  <div className="text-[10px] text-gray-500">Assigned Rooms</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {assignedRooms.map((room) => (
                  <div
                    key={room.roomNumber}
                    className={`p-2 rounded-sm border text-center ${
                      room.roomStatus === "clean"
                        ? "bg-green-50 border-green-200"
                        : room.roomStatus === "dirty"
                        ? "bg-red-50 border-red-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="text-[14px] font-bold">{room.roomNumber}</div>
                    <div className="text-[10px] text-gray-500">{room.categoryLabel}</div>
                    {room.isVip && (
                      <span className="inline-block mt-1 px-1 py-0.5 bg-amber-500 text-white text-[8px] rounded">
                        VIP
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Statistics Report
function StatisticsReport({ rooms }: { rooms: Room[] }) {
  const floors = [2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-[14px] font-semibold text-gray-900">
          Room Statistics Report
        </h3>
        <p className="text-[12px] text-gray-500 mt-1">
          Summary by floor - Four Seasons Park Lane
        </p>
      </div>

      <table className="w-full text-[12px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Floor</th>
            <th className="px-4 py-2 text-center font-semibold text-gray-600">Total</th>
            <th className="px-4 py-2 text-center font-semibold text-green-600">Clean</th>
            <th className="px-4 py-2 text-center font-semibold text-red-600">Dirty</th>
            <th className="px-4 py-2 text-center font-semibold text-yellow-600">Pickup</th>
            <th className="px-4 py-2 text-center font-semibold text-blue-600">Occupied</th>
            <th className="px-4 py-2 text-center font-semibold text-gray-600">Vacant</th>
            <th className="px-4 py-2 text-center font-semibold text-purple-600">Arrivals</th>
            <th className="px-4 py-2 text-center font-semibold text-orange-600">Departures</th>
            <th className="px-4 py-2 text-center font-semibold text-amber-600">VIP</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {floors.map((floor) => {
            const summary = getFloorSummary(floor);
            return (
              <tr key={floor} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">Floor {floor}</td>
                <td className="px-4 py-3 text-center">{summary.total}</td>
                <td className="px-4 py-3 text-center text-green-600 font-medium">{summary.clean}</td>
                <td className="px-4 py-3 text-center text-red-600 font-medium">{summary.dirty}</td>
                <td className="px-4 py-3 text-center text-yellow-600 font-medium">{summary.pickup}</td>
                <td className="px-4 py-3 text-center text-blue-600">{summary.occupied}</td>
                <td className="px-4 py-3 text-center">{summary.vacant}</td>
                <td className="px-4 py-3 text-center text-purple-600">{summary.arrivals}</td>
                <td className="px-4 py-3 text-center text-orange-600">{summary.departures}</td>
                <td className="px-4 py-3 text-center">
                  {summary.vip > 0 && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-medium">
                      {summary.vip}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-gray-100 border-t border-gray-300">
          <tr className="font-semibold">
            <td className="px-4 py-3">Total</td>
            <td className="px-4 py-3 text-center">{rooms.length}</td>
            <td className="px-4 py-3 text-center text-green-600">
              {rooms.filter((r) => r.roomStatus === "clean").length}
            </td>
            <td className="px-4 py-3 text-center text-red-600">
              {rooms.filter((r) => r.roomStatus === "dirty").length}
            </td>
            <td className="px-4 py-3 text-center text-yellow-600">
              {rooms.filter((r) => r.roomStatus === "pickup").length}
            </td>
            <td className="px-4 py-3 text-center text-blue-600">
              {rooms.filter((r) => r.foStatus === "occupied").length}
            </td>
            <td className="px-4 py-3 text-center">
              {rooms.filter((r) => r.foStatus === "vacant").length}
            </td>
            <td className="px-4 py-3 text-center text-purple-600">
              {rooms.filter((r) => r.foStatus === "arrival").length}
            </td>
            <td className="px-4 py-3 text-center text-orange-600">
              {rooms.filter((r) => r.foStatus === "due_out").length}
            </td>
            <td className="px-4 py-3 text-center">
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-medium">
                {rooms.filter((r) => r.isVip).length}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// VIP Arrivals Report
function VIPArrivalsReport({ rooms }: { rooms: Room[] }) {
  const vipRooms = rooms.filter((r) => r.isVip && r.foStatus === "arrival");

  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-[14px] font-semibold text-gray-900">
          VIP Arrivals Report
        </h3>
        <p className="text-[12px] text-gray-500 mt-1">
          {vipRooms.length} VIP arrivals expected today
        </p>
      </div>

      {vipRooms.length === 0 ? (
        <div className="p-8 text-center">
          <Star size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-[14px] text-gray-600">No VIP arrivals today</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {vipRooms.map((room) => (
            <div key={room.roomNumber} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-center">
                    <div className="text-[24px] font-bold text-gray-900">{room.roomNumber}</div>
                    <div className="text-[10px] text-gray-500">Floor {room.floor}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold">{room.guestName}</span>
                      <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">
                        {room.vipCode}
                      </span>
                    </div>
                    <div className="text-[12px] text-gray-600 mt-1">{room.categoryLabel}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {room.view.charAt(0).toUpperCase() + room.view.slice(1)} View | {room.sqm}m&sup2;
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={room.roomStatus} />
                  <div className="text-[11px] text-gray-500 mt-2">
                    {room.roomStatus === "clean" || room.roomStatus === "inspected"
                      ? "Ready for arrival"
                      : "Needs attention"}
                  </div>
                </div>
              </div>
              {room.features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {room.features.slice(0, 5).map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    clean: "bg-green-100 text-green-700",
    dirty: "bg-red-100 text-red-700",
    pickup: "bg-yellow-100 text-yellow-700",
    inspected: "bg-emerald-100 text-emerald-700",
    ooo: "bg-gray-200 text-gray-600",
    oos: "bg-purple-100 text-purple-700",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
