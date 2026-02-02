"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Sparkles,
  TrendingDown,
  Clock,
  Route,
  Zap,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Play,
  RotateCcw,
} from "lucide-react";

interface Room {
  id: string;
  x: number;
  y: number;
  status: "dirty" | "clean" | "in_progress";
  priority: number;
  floor: number;
}

interface OptimizationStats {
  distanceSaved: number;
  timeSaved: number;
  costSaved: number;
  efficiencyGain: number;
}

const FLOORS = [
  { floor: 9, label: "Floor 9 - Penthouse", rooms: 6 },
  { floor: 8, label: "Floor 8 - Executive", rooms: 12 },
  { floor: 7, label: "Floor 7 - Premier", rooms: 16 },
  { floor: 6, label: "Floor 6 - Deluxe", rooms: 18 },
  { floor: 5, label: "Floor 5 - Superior", rooms: 18 },
];

export default function AIOptimizationPanel({ onClose }: { onClose: () => void }) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeRoute, setActiveRoute] = useState<number[]>([]);
  const [stats, setStats] = useState<OptimizationStats>({
    distanceSaved: 0,
    timeSaved: 0,
    costSaved: 0,
    efficiencyGain: 0,
  });

  // Generate rooms for visualization
  const generateRooms = useCallback((floor: number, count: number): Room[] => {
    const rooms: Room[] = [];
    const cols = Math.min(count, 6);
    const rows = Math.ceil(count / cols);

    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      rooms.push({
        id: `${floor}${String(i + 1).padStart(2, "0")}`,
        x: 60 + col * 80,
        y: 40 + row * 50,
        status: Math.random() > 0.6 ? "dirty" : "clean",
        priority: Math.floor(Math.random() * 3) + 1,
        floor,
      });
    }
    return rooms;
  }, []);

  const [floorRooms] = useState(() =>
    FLOORS.reduce((acc, f) => {
      acc[f.floor] = generateRooms(f.floor, f.rooms);
      return acc;
    }, {} as Record<number, Room[]>)
  );

  const [selectedFloor, setSelectedFloor] = useState(7);

  const runOptimization = () => {
    setIsOptimizing(true);
    setOptimizationComplete(false);
    setCurrentStep(0);
    setActiveRoute([]);

    // Simulate optimization steps
    const steps = [
      { step: 1, label: "Analyzing room states...", duration: 800 },
      { step: 2, label: "Calculating optimal routes...", duration: 1000 },
      { step: 3, label: "Prioritizing VIP arrivals...", duration: 600 },
      { step: 4, label: "Minimizing travel distance...", duration: 900 },
      { step: 5, label: "Generating assignment plan...", duration: 700 },
    ];

    let totalDelay = 0;
    steps.forEach((s, idx) => {
      setTimeout(() => {
        setCurrentStep(s.step);
      }, totalDelay);
      totalDelay += s.duration;
    });

    // Show route animation
    setTimeout(() => {
      const dirtyRooms = floorRooms[selectedFloor]
        .map((r, i) => (r.status === "dirty" ? i : -1))
        .filter((i) => i !== -1);

      // Animate route discovery
      dirtyRooms.forEach((roomIdx, i) => {
        setTimeout(() => {
          setActiveRoute((prev) => [...prev, roomIdx]);
        }, i * 300);
      });
    }, totalDelay);

    // Complete optimization
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationComplete(true);
      setStats({
        distanceSaved: 847,
        timeSaved: 42,
        costSaved: 156,
        efficiencyGain: 23,
      });
    }, totalDelay + 2000);
  };

  const resetOptimization = () => {
    setOptimizationComplete(false);
    setCurrentStep(0);
    setActiveRoute([]);
    setStats({
      distanceSaved: 0,
      timeSaved: 0,
      costSaved: 0,
      efficiencyGain: 0,
    });
  };

  const rooms = floorRooms[selectedFloor] || [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">AI Route Optimization</h2>
              <p className="text-violet-200 text-sm">Intelligent task queuing for maximum efficiency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Panel - Floor Plan Visualization */}
            <div className="col-span-2">
              {/* Floor Selector */}
              <div className="flex gap-2 mb-4">
                {FLOORS.map((f) => (
                  <button
                    key={f.floor}
                    onClick={() => {
                      setSelectedFloor(f.floor);
                      resetOptimization();
                    }}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      selectedFloor === f.floor
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Floor {f.floor}
                  </button>
                ))}
              </div>

              {/* Floor Plan SVG */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 relative overflow-hidden">
                <div className="absolute top-2 left-2 text-xs text-gray-500 font-medium">
                  {FLOORS.find((f) => f.floor === selectedFloor)?.label}
                </div>

                <svg viewBox="0 0 560 200" className="w-full h-auto">
                  {/* Corridor */}
                  <rect
                    x="30"
                    y="85"
                    width="500"
                    height="30"
                    fill="#f3f4f6"
                    stroke="#d1d5db"
                    strokeWidth="1"
                  />
                  <text x="280" y="104" textAnchor="middle" className="text-[10px] fill-gray-400">
                    CORRIDOR
                  </text>

                  {/* Elevator */}
                  <rect
                    x="10"
                    y="75"
                    width="20"
                    height="50"
                    fill="#6366f1"
                    rx="2"
                  />
                  <text x="20" y="105" textAnchor="middle" className="text-[8px] fill-white font-medium">
                    ELV
                  </text>

                  {/* Rooms */}
                  {rooms.map((room, idx) => {
                    const isInRoute = activeRoute.includes(idx);
                    const routeOrder = activeRoute.indexOf(idx);
                    const yOffset = idx < rooms.length / 2 ? 0 : 70;
                    const adjustedY = yOffset === 0 ? room.y - 30 : room.y + 60;

                    return (
                      <g key={room.id}>
                        {/* Room Rectangle */}
                        <rect
                          x={room.x}
                          y={adjustedY}
                          width="60"
                          height="40"
                          rx="4"
                          fill={
                            room.status === "dirty"
                              ? isInRoute
                                ? "#fef3c7"
                                : "#fee2e2"
                              : "#dcfce7"
                          }
                          stroke={
                            room.status === "dirty"
                              ? isInRoute
                                ? "#f59e0b"
                                : "#ef4444"
                              : "#22c55e"
                          }
                          strokeWidth={isInRoute ? "2" : "1"}
                          className="transition-all duration-300"
                        />

                        {/* Room Number */}
                        <text
                          x={room.x + 30}
                          y={adjustedY + 18}
                          textAnchor="middle"
                          className="text-[11px] font-semibold fill-gray-700"
                        >
                          {room.id}
                        </text>

                        {/* Status Label */}
                        <text
                          x={room.x + 30}
                          y={adjustedY + 32}
                          textAnchor="middle"
                          className={`text-[8px] ${
                            room.status === "dirty" ? "fill-red-500" : "fill-green-600"
                          }`}
                        >
                          {room.status.toUpperCase()}
                        </text>

                        {/* Route Order Badge */}
                        {isInRoute && (
                          <g>
                            <circle
                              cx={room.x + 55}
                              cy={adjustedY + 5}
                              r="10"
                              fill="#6366f1"
                            />
                            <text
                              x={room.x + 55}
                              y={adjustedY + 9}
                              textAnchor="middle"
                              className="text-[9px] font-bold fill-white"
                            >
                              {routeOrder + 1}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* Route Lines */}
                  {activeRoute.length > 1 && (
                    <g>
                      {activeRoute.slice(0, -1).map((fromIdx, i) => {
                        const toIdx = activeRoute[i + 1];
                        const fromRoom = rooms[fromIdx];
                        const toRoom = rooms[toIdx];
                        const fromYOffset = fromIdx < rooms.length / 2 ? 0 : 70;
                        const toYOffset = toIdx < rooms.length / 2 ? 0 : 70;
                        const fromY = fromYOffset === 0 ? fromRoom.y - 10 : fromRoom.y + 80;
                        const toY = toYOffset === 0 ? toRoom.y - 10 : toRoom.y + 80;

                        return (
                          <line
                            key={`route-${i}`}
                            x1={fromRoom.x + 30}
                            y1={fromY}
                            x2={toRoom.x + 30}
                            y2={toY}
                            stroke="#6366f1"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            className="animate-pulse"
                          />
                        );
                      })}
                    </g>
                  )}
                </svg>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-green-100 border border-green-500" />
                    Clean
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-red-100 border border-red-500" />
                    Needs Cleaning
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-amber-100 border-2 border-amber-500" />
                    In Optimized Route
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[8px] flex items-center justify-center font-bold">1</span>
                    Route Order
                  </span>
                </div>
              </div>
            </div>

            {/* Right Panel - Controls & Stats */}
            <div className="space-y-4">
              {/* Optimization Button */}
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg p-4 border border-indigo-100">
                {!isOptimizing && !optimizationComplete && (
                  <button
                    onClick={runOptimization}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200"
                  >
                    <Play className="w-5 h-5" />
                    Run AI Optimization
                  </button>
                )}

                {isOptimizing && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium text-indigo-700">Optimizing...</span>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((step) => (
                        <div
                          key={step}
                          className={`flex items-center gap-2 text-xs transition-all ${
                            currentStep >= step ? "text-indigo-600" : "text-gray-400"
                          }`}
                        >
                          {currentStep > step ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : currentStep === step ? (
                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300" />
                          )}
                          <span>
                            {step === 1 && "Analyzing room states"}
                            {step === 2 && "Calculating optimal routes"}
                            {step === 3 && "Prioritizing VIP arrivals"}
                            {step === 4 && "Minimizing travel distance"}
                            {step === 5 && "Generating assignment plan"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {optimizationComplete && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Optimization Complete</span>
                    </div>
                    <button
                      onClick={resetOptimization}
                      className="w-full bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                )}
              </div>

              {/* Savings Stats */}
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-green-500" />
                    Projected Savings
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <StatBox
                      icon={<Route className="w-4 h-4" />}
                      label="Distance"
                      value={`${stats.distanceSaved}m`}
                      color="blue"
                    />
                    <StatBox
                      icon={<Clock className="w-4 h-4" />}
                      label="Time"
                      value={`${stats.timeSaved} min`}
                      color="amber"
                    />
                    <StatBox
                      icon={<DollarSign className="w-4 h-4" />}
                      label="Cost"
                      value={`$${stats.costSaved}`}
                      color="green"
                    />
                    <StatBox
                      icon={<Zap className="w-4 h-4" />}
                      label="Efficiency"
                      value={`+${stats.efficiencyGain}%`}
                      color="violet"
                    />
                  </div>
                </div>

                {/* How It Works */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">How It Works</h3>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                      <span>AI analyzes all room states, VIP arrivals, and checkout times</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                      <span>Calculates shortest path using traveling salesman algorithm</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                      <span>Assigns rooms to attendants based on proximity and workload</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">4</span>
                      <span>Reduces walking time by up to 40%, saving labor costs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              {optimizationComplete && (
                <button
                  onClick={onClose}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Apply Optimized Route
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "amber" | "green" | "violet";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    green: "bg-green-50 text-green-600 border-green-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
  };

  return (
    <div className={`p-3 rounded-lg border ${colors[color]}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wide font-medium opacity-70">{label}</span>
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
