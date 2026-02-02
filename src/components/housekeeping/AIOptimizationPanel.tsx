"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import {
  X,
  Clock,
  CheckCircle2,
  Play,
  ArrowRight,
  Star,
  User,
  AlertTriangle,
  Building2,
  Timer,
  Users,
  ChevronRight,
} from "lucide-react";

// Types
interface HousekeeperAssignment {
  id: string;
  name: string;
  initials: string;
  floor: number;
  rooms: RoomTask[];
  totalTime: number;
  floorChanges: number;
}

interface RoomTask {
  roomNumber: string;
  floor: number;
  type: "suite" | "deluxe" | "premier" | "superior";
  priority: "critical" | "high" | "medium";
  priorityReason: string;
  isVip: boolean;
  arrivalTime?: string;
  cleaningTime: number;
}

// Mock data based on Park Lane
const FLOORS = [
  { floor: 9, name: "Penthouse Level", rooms: 4, suites: 4 },
  { floor: 8, name: "Executive Level", rooms: 8, suites: 2 },
  { floor: 7, name: "Premier Level", rooms: 12, suites: 1 },
  { floor: 6, name: "Deluxe Level", rooms: 14, suites: 0 },
  { floor: 5, name: "Superior Level", rooms: 14, suites: 0 },
  { floor: 4, name: "Superior Level", rooms: 14, suites: 0 },
];

const HOUSEKEEPERS = [
  { id: "hk1", name: "Maria Santos", initials: "MS" },
  { id: "hk2", name: "Jun Park", initials: "JP" },
  { id: "hk3", name: "Elena Volkov", initials: "EV" },
  { id: "hk4", name: "David Chen", initials: "DC" },
];

// Generate realistic room tasks
function generateRoomTasks(): RoomTask[] {
  const tasks: RoomTask[] = [
    // Floor 9 - Penthouse (all suites, high priority)
    { roomNumber: "901", floor: 9, type: "suite", priority: "critical", priorityReason: "VIP arriving 2:00 PM", isVip: true, arrivalTime: "14:00", cleaningTime: 45 },
    { roomNumber: "902", floor: 9, type: "suite", priority: "high", priorityReason: "Suite - priority clean", isVip: false, cleaningTime: 45 },
    // Floor 8
    { roomNumber: "801", floor: 8, type: "suite", priority: "critical", priorityReason: "VIP arriving 1:30 PM", isVip: true, arrivalTime: "13:30", cleaningTime: 45 },
    { roomNumber: "805", floor: 8, type: "deluxe", priority: "high", priorityReason: "Early arrival 2:00 PM", isVip: false, arrivalTime: "14:00", cleaningTime: 30 },
    { roomNumber: "807", floor: 8, type: "deluxe", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 30 },
    { roomNumber: "808", floor: 8, type: "deluxe", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 30 },
    // Floor 7
    { roomNumber: "702", floor: 7, type: "premier", priority: "high", priorityReason: "VIP arriving 3:00 PM", isVip: true, arrivalTime: "15:00", cleaningTime: 35 },
    { roomNumber: "705", floor: 7, type: "premier", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 35 },
    { roomNumber: "708", floor: 7, type: "premier", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 35 },
    { roomNumber: "711", floor: 7, type: "premier", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 35 },
    // Floor 6
    { roomNumber: "603", floor: 6, type: "deluxe", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 30 },
    { roomNumber: "606", floor: 6, type: "deluxe", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 30 },
    { roomNumber: "609", floor: 6, type: "deluxe", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 30 },
    { roomNumber: "612", floor: 6, type: "deluxe", priority: "high", priorityReason: "Early arrival 2:30 PM", isVip: false, arrivalTime: "14:30", cleaningTime: 30 },
    // Floor 5
    { roomNumber: "502", floor: 5, type: "superior", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 25 },
    { roomNumber: "505", floor: 5, type: "superior", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 25 },
    { roomNumber: "508", floor: 5, type: "superior", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 25 },
    { roomNumber: "511", floor: 5, type: "superior", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 25 },
    // Floor 4
    { roomNumber: "403", floor: 4, type: "superior", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 25 },
    { roomNumber: "406", floor: 4, type: "superior", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 25 },
    { roomNumber: "409", floor: 4, type: "superior", priority: "high", priorityReason: "Early arrival 1:00 PM", isVip: false, arrivalTime: "13:00", cleaningTime: 25 },
    { roomNumber: "412", floor: 4, type: "superior", priority: "medium", priorityReason: "Standard checkout", isVip: false, cleaningTime: 25 },
  ];
  return tasks;
}

// Manual (inefficient) assignment - staff jumping between floors
function generateManualAssignment(tasks: RoomTask[]): HousekeeperAssignment[] {
  const assignments: HousekeeperAssignment[] = HOUSEKEEPERS.map((hk, idx) => ({
    id: hk.id,
    name: hk.name,
    initials: hk.initials,
    floor: 0,
    rooms: [],
    totalTime: 0,
    floorChanges: 0,
  }));

  // Distribute rooms round-robin (inefficient - causes floor jumping)
  tasks.forEach((task, idx) => {
    const assignee = assignments[idx % 4];
    assignee.rooms.push(task);
  });

  // Calculate floor changes and time
  assignments.forEach((a) => {
    let lastFloor = -1;
    a.rooms.forEach((room) => {
      if (lastFloor !== -1 && lastFloor !== room.floor) {
        a.floorChanges++;
      }
      lastFloor = room.floor;
      a.totalTime += room.cleaningTime;
    });
    // Add 10 min per floor change
    a.totalTime += a.floorChanges * 10;
    a.floor = a.rooms[0]?.floor || 0;
  });

  return assignments;
}

// Optimized assignment - staff stay on same/adjacent floors
function generateOptimizedAssignment(tasks: RoomTask[]): HousekeeperAssignment[] {
  const assignments: HousekeeperAssignment[] = HOUSEKEEPERS.map((hk, idx) => ({
    id: hk.id,
    name: hk.name,
    initials: hk.initials,
    floor: 0,
    rooms: [],
    totalTime: 0,
    floorChanges: 0,
  }));

  // Sort tasks by floor and priority
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.floor !== b.floor) return b.floor - a.floor; // Top floors first
    const priorityOrder = { critical: 0, high: 1, medium: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Assign by floor zones
  // Maria: Floor 9 + 8 (suites/executive)
  // Jun: Floor 7 (premier)
  // Elena: Floor 6 (deluxe)
  // David: Floor 5 + 4 (superior)
  const floorAssignments: Record<number, number> = {
    9: 0, 8: 0, 7: 1, 6: 2, 5: 3, 4: 3,
  };

  sortedTasks.forEach((task) => {
    const assigneeIdx = floorAssignments[task.floor] ?? 0;
    assignments[assigneeIdx].rooms.push(task);
  });

  // Calculate time (minimal floor changes)
  assignments.forEach((a) => {
    let lastFloor = -1;
    a.rooms.forEach((room) => {
      if (lastFloor !== -1 && lastFloor !== room.floor) {
        a.floorChanges++;
      }
      lastFloor = room.floor;
      a.totalTime += room.cleaningTime;
    });
    a.totalTime += a.floorChanges * 10;
    a.floor = a.rooms[0]?.floor || 0;
  });

  return assignments;
}

export default function AIOptimizationPanel({ onClose }: { onClose: () => void }) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showOptimized, setShowOptimized] = useState(false);

  const tasks = generateRoomTasks();
  const manualAssignments = generateManualAssignment(tasks);
  const optimizedAssignments = generateOptimizedAssignment(tasks);

  // Calculate totals
  const manualTotal = {
    time: manualAssignments.reduce((sum, a) => sum + a.totalTime, 0),
    floorChanges: manualAssignments.reduce((sum, a) => sum + a.floorChanges, 0),
  };
  const optimizedTotal = {
    time: optimizedAssignments.reduce((sum, a) => sum + a.totalTime, 0),
    floorChanges: optimizedAssignments.reduce((sum, a) => sum + a.floorChanges, 0),
  };

  const timeSaved = manualTotal.time - optimizedTotal.time;
  const floorChangesSaved = manualTotal.floorChanges - optimizedTotal.floorChanges;
  const hourlyRate = 18; // £18/hour baseline for housekeeping
  const costSaved = Math.round((timeSaved / 60) * hourlyRate);

  const runOptimization = () => {
    setIsOptimizing(true);
    setOptimizationComplete(false);
    setCurrentStep(0);
    setShowOptimized(false);

    const steps = [600, 800, 700, 600, 500];
    let delay = 0;
    steps.forEach((duration, idx) => {
      setTimeout(() => setCurrentStep(idx + 1), delay);
      delay += duration;
    });

    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationComplete(true);
      setShowOptimized(true);
    }, delay + 300);
  };

  const activeAssignments = showOptimized ? optimizedAssignments : manualAssignments;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
          <div>
            <h2 className="text-[16px] font-semibold text-black">Housekeeping Queue Optimization</h2>
            <p className="text-gray-600 text-[12px]">Floor-based staff allocation to minimize elevator travel</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Problem Statement */}
          <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] font-semibold text-amber-800">The Elevator Problem</div>
                <div className="text-[12px] text-amber-700 mt-1">
                  Each floor change costs ~10 minutes in elevator wait time. Manual dispatch often sends staff to different floors,
                  wasting up to 40+ minutes per shift. Optimized routing keeps staff on same floors.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left: Building Visualization */}
            <div className="col-span-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold text-gray-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Staff Assignments by Floor
                </h3>
                {optimizationComplete && (
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      onClick={() => setShowOptimized(false)}
                      className={`px-2 py-1 rounded-sm ${!showOptimized ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => setShowOptimized(true)}
                      className={`px-2 py-1 rounded-sm ${showOptimized ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      After
                    </button>
                  </div>
                )}
              </div>

              {/* Building Stack */}
              <div className="border border-gray-200 rounded-sm overflow-hidden">
                {FLOORS.map((floor, idx) => {
                  const floorTasks = tasks.filter((t) => t.floor === floor.floor);
                  const assignedStaff = activeAssignments.filter((a) =>
                    a.rooms.some((r) => r.floor === floor.floor)
                  );

                  return (
                    <div
                      key={floor.floor}
                      className={`border-b border-gray-200 last:border-b-0 ${
                        floor.suites > 0 ? "bg-amber-50/50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 px-4 py-3">
                        {/* Floor Number */}
                        <div className="w-10 h-10 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                          <span className="text-[16px] font-bold text-gray-700">{floor.floor}</span>
                        </div>

                        {/* Floor Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-medium text-gray-800">{floor.name}</div>
                          <div className="text-[10px] text-gray-500">
                            {floorTasks.length} rooms to clean
                            {floor.suites > 0 && (
                              <span className="ml-2 text-amber-600">• {floor.suites} suites</span>
                            )}
                          </div>
                        </div>

                        {/* Assigned Staff */}
                        <div className="flex items-center gap-1">
                          {assignedStaff.map((staff) => (
                            <div
                              key={staff.id}
                              className="w-7 h-7 rounded-full bg-[#1a1a1a] text-white text-[10px] font-medium flex items-center justify-center"
                              title={staff.name}
                            >
                              {staff.initials}
                            </div>
                          ))}
                          {assignedStaff.length === 0 && (
                            <span className="text-[10px] text-gray-400">No staff</span>
                          )}
                        </div>

                        {/* Room Count Badge */}
                        <div className={`px-2 py-1 rounded-sm text-[10px] font-medium ${
                          floorTasks.some((t) => t.priority === "critical")
                            ? "bg-red-100 text-red-700"
                            : floorTasks.some((t) => t.priority === "high")
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {floorTasks.length}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Elevator indicator */}
                <div className="bg-gray-100 px-4 py-2 flex items-center justify-center gap-2 text-[11px] text-gray-600">
                  <Timer className="w-3.5 h-3.5" />
                  <span>Elevator wait: ~10 min per floor change</span>
                </div>
              </div>

              {/* Staff Summary Cards */}
              <div className="mt-4 space-y-2">
                <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Staff Workload</h4>
                {activeAssignments.map((staff) => (
                  <div key={staff.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-sm border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white text-[11px] font-medium flex items-center justify-center">
                      {staff.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-gray-800">{staff.name}</div>
                      <div className="text-[10px] text-gray-500">
                        {staff.rooms.length} rooms • Floor{staff.rooms.length > 0 && staff.rooms.map(r => r.floor).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => b - a).join(", ")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px] font-semibold text-gray-800">{staff.totalTime} min</div>
                      {staff.floorChanges > 0 && (
                        <div className="text-[10px] text-red-600">
                          +{staff.floorChanges * 10} min travel
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle: Priority Queue */}
            <div className="col-span-4">
              <h3 className="text-[13px] font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Cleaning Priority Queue
              </h3>

              <div className="border border-gray-200 rounded-sm divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {[...tasks]
                  .sort((a, b) => {
                    const order = { critical: 0, high: 1, medium: 2 };
                    if (order[a.priority] !== order[b.priority]) {
                      return order[a.priority] - order[b.priority];
                    }
                    return b.floor - a.floor;
                  })
                  .map((task, idx) => (
                    <div key={task.roomNumber} className="p-3 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        {/* Queue Position */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          task.priority === "critical"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "high"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {idx + 1}
                        </div>

                        {/* Room Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-gray-800">
                              {task.roomNumber}
                            </span>
                            {task.isVip && (
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            )}
                            <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-medium uppercase border border-gray-300 bg-white text-gray-700 tracking-wide">
                              {task.type === 'suite'
                                ? 'Suite'
                                : task.type === 'deluxe'
                                ? 'Deluxe'
                                : task.type === 'premier'
                                ? 'Premier'
                                : 'Superior'}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Floor {task.floor} • {task.cleaningTime} min
                          </div>
                        </div>

                        {/* Priority Reason */}
                        <div className="text-right shrink-0">
                          <div className={`text-[10px] font-medium ${
                            task.priority === "critical"
                              ? "text-red-600"
                              : task.priority === "high"
                              ? "text-amber-600"
                              : "text-gray-500"
                          }`}>
                            {task.priorityReason}
                          </div>
                          {task.arrivalTime && (
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              Arrival: {task.arrivalTime}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Priority Legend */}
              <div className="mt-3 flex items-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-100 border border-red-300" />
                  Critical
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300" />
                  High
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300" />
                  Medium
                </span>
              </div>
            </div>

            {/* Right: Controls & Stats */}
            <div className="col-span-3 space-y-4">
              {/* Run Optimization */}
              <div className="bg-gray-50 rounded-sm p-4 border border-gray-200">
                {!isOptimizing && !optimizationComplete && (
                  <Button onClick={runOptimization} variant="primary" className="w-full py-3">
                    <Play className="w-4 h-4" /> Run Optimization
                  </Button>
                )}

                {isOptimizing && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[13px] font-medium text-gray-700">Optimizing...</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        "Analyzing checkout queue",
                        "Checking arrival times",
                        "Mapping staff locations",
                        "Calculating floor zones",
                        "Minimizing elevator trips",
                      ].map((step, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 text-[11px] transition-all ${
                            currentStep > idx + 1 ? "text-gray-800" : currentStep === idx + 1 ? "text-gray-700" : "text-gray-400"
                          }`}
                        >
                          {currentStep > idx + 1 ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          ) : currentStep === idx + 1 ? (
                            <div className="w-3.5 h-3.5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                          )}
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {optimizationComplete && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium text-[13px]">Optimization Complete</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Comparison Stats */}
              <div className="bg-white rounded-sm border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Comparison</h4>
                </div>

                <div className="divide-y divide-gray-100">
                  {/* Floor Changes */}
                  <div className="p-4">
                    <div className="text-[11px] text-gray-500 mb-2">Floor Changes</div>
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 text-center p-2 rounded-sm ${!showOptimized ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"}`}>
                        <div className="text-[18px] font-bold text-gray-800">{manualTotal.floorChanges}</div>
                        <div className="text-[9px] text-gray-500 uppercase">Manual</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <div className={`flex-1 text-center p-2 rounded-sm ${showOptimized ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}>
                        <div className="text-[18px] font-bold text-gray-800">{optimizedTotal.floorChanges}</div>
                        <div className="text-[9px] text-gray-500 uppercase">Optimized</div>
                      </div>
                    </div>
                  </div>

                  {/* Total Time */}
                  <div className="p-4">
                    <div className="text-[11px] text-gray-500 mb-2">Total Time</div>
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 text-center p-2 rounded-sm ${!showOptimized ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"}`}>
                        <div className="text-[18px] font-bold text-gray-800">{manualTotal.time}</div>
                        <div className="text-[9px] text-gray-500 uppercase">Minutes</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <div className={`flex-1 text-center p-2 rounded-sm ${showOptimized ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}>
                        <div className="text-[18px] font-bold text-gray-800">{optimizedTotal.time}</div>
                        <div className="text-[9px] text-gray-500 uppercase">Minutes</div>
                      </div>
                    </div>
                  </div>

                  {/* Savings */}
                  {optimizationComplete && (
                    <div className="p-4 bg-green-50">
                      <div className="text-[11px] text-green-700 font-medium mb-2">Savings</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <div className="text-[20px] font-bold text-green-700">-{floorChangesSaved}</div>
                          <div className="text-[9px] text-green-600 uppercase">Floor Changes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[20px] font-bold text-green-700">-{timeSaved}</div>
                          <div className="text-[9px] text-green-600 uppercase">Minutes</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-center gap-2 rounded-sm border border-green-200 bg-white p-2">
                        <span className="text-[11px] text-gray-600">Projected Cost Savings Today</span>
                        <span className="text-[14px] font-semibold text-green-700">£{costSaved.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Apply Button */}
              {optimizationComplete && (
                <Button onClick={onClose} variant="primary" className="w-full py-3">
                  <CheckCircle2 className="w-4 h-4" /> Apply Assignments
                </Button>
              )}

              {/* Key Insight */}
              <div className="p-3 bg-gray-50 rounded-sm border border-gray-200">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Key Insight</div>
                <div className="text-[11px] text-gray-700">
                  Staff assigned to floor zones instead of random rooms. Suites and VIP arrivals prioritized automatically.
                </div>
              </div>

              {/* Routing Visualization */}
              <div className="mt-4 border border-gray-200 rounded-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-white">
                  <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Routing Visualization</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Each column is an attendant; dots mark floors serviced. Fewer gaps = fewer elevator trips.</p>
                </div>
                <div className="p-3 overflow-x-auto bg-white">
                  <div className="grid" style={{ gridTemplateColumns: `80px repeat(${activeAssignments.length}, minmax(80px,1fr))` }}>
                    <div></div>
                    {activeAssignments.map((s) => (
                      <div key={`head-${s.id}`} className="flex items-center gap-2 px-2 pb-2 border-b border-gray-100">
                        <div className="w-7 h-7 rounded-full bg-[#1a1a1a] text-white text-[10px] font-medium flex items-center justify-center">
                          {s.initials}
                        </div>
                        <div className="text-[11px] text-gray-700 truncate">{s.name}</div>
                      </div>
                    ))}
                    {FLOORS.map((fl) => (
                      <>
                        <div key={`label-${fl.floor}`} className="py-2 pr-3 text-right text-[12px] text-gray-600 border-b border-gray-100">Floor {fl.floor}</div>
                        {activeAssignments.map((s) => {
                          const floorsWorked = Array.from(new Set(s.rooms.map((r) => r.floor)));
                          const onThisFloor = floorsWorked.includes(fl.floor);
                          return (
                            <div key={`${s.id}-${fl.floor}`} className="py-2 flex items-center justify-center border-b border-gray-100" title={`${s.name} ${onThisFloor ? 'services' : 'no tasks on'} floor ${fl.floor}`}>
                              <div className={`w-3 h-3 rounded-full ${onThisFloor ? 'bg-gray-900' : 'bg-gray-200'}`} />
                            </div>
                          );
                        })}
                      </>
                    ))}
                    <div></div>
                    {activeAssignments.map((s) => (
                      <div key={`sum-${s.id}`} className="pt-2 text-center text-[10px] text-gray-600">
                        {s.floorChanges > 0 ? `Transitions: ${s.floorChanges}` : 'Single-zone'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
