"use client";

import { useState, useCallback } from "react";
import AgentChat from "@/components/copilot/AgentChat";
import AgentTaskPanel, {
  TaskPlan,
  AgentTask,
} from "@/components/copilot/AgentTaskPanel";
import {
  Search,
  ChevronDown,
  Settings,
  HelpCircle,
  RefreshCw,
  MoreVertical,
  Star,
  AlertTriangle,
  Heart,
  Calendar,
  Users,
} from "lucide-react";

// Mock OPERA arrivals data with intelligence overlay
const operaArrivals = [
  {
    name: "Kiser, Piper",
    confirmation: "83924751",
    arrival: "02/15/2024",
    departure: "02/18/2024",
    nights: 3,
    roomType: "DXS",
    status: "Pre-Assigned",
    room: "801",
    vip: "VVIP",
    stayCount: 26,
    occasion: "Anniversary",
    dietary: null,
    intelligence: {
      preferences: ["High floor", "Extra pillows", "Turndown 9pm"],
      predicted: ["Spa booking day 2", "Late checkout"],
      actions: 3,
    },
  },
  {
    name: "Adams, Courtney",
    confirmation: "84012367",
    arrival: "02/15/2024",
    departure: "02/17/2024",
    nights: 2,
    roomType: "SUP",
    status: "Assign Room",
    room: null,
    vip: null,
    stayCount: 1,
    occasion: null,
    dietary: "Shellfish allergy",
    intelligence: {
      preferences: ["Quiet room"],
      predicted: ["Restaurant recommendation"],
      actions: 2,
    },
  },
  {
    name: "Chen, Marcus",
    confirmation: "83901122",
    arrival: "02/15/2024",
    departure: "02/16/2024",
    nights: 1,
    roomType: "EXE",
    status: "Pre-Assigned",
    room: "605",
    vip: "VIP",
    stayCount: 8,
    occasion: null,
    dietary: "Vegetarian",
    intelligence: {
      preferences: ["High floor", "City view", "Extra workspace"],
      predicted: ["Express checkout", "Wake-up 5:30am"],
      actions: 2,
    },
  },
  {
    name: "Bailey, Austin",
    confirmation: "84023891",
    arrival: "02/15/2024",
    departure: "02/16/2024",
    nights: 1,
    roomType: "DLX",
    status: "Assign Room",
    room: null,
    vip: null,
    stayCount: 3,
    occasion: null,
    dietary: null,
    intelligence: {
      preferences: ["Low floor", "Near elevator"],
      predicted: [],
      actions: 0,
    },
  },
  {
    name: "Martinez, Sofia",
    confirmation: "84031245",
    arrival: "02/15/2024",
    departure: "02/17/2024",
    nights: 2,
    roomType: "STD",
    status: "Assign Room",
    room: null,
    vip: null,
    stayCount: 1,
    occasion: "Birthday",
    dietary: null,
    intelligence: {
      preferences: [],
      predicted: ["Birthday amenity"],
      actions: 1,
    },
  },
  {
    name: "Thompson, David",
    confirmation: "84029876",
    arrival: "02/15/2024",
    departure: "02/16/2024",
    nights: 1,
    roomType: "SUP",
    status: "Assign Room",
    room: null,
    vip: null,
    stayCount: 5,
    occasion: null,
    dietary: "Gluten-free",
    intelligence: {
      preferences: ["Firm mattress"],
      predicted: ["In-room dining"],
      actions: 1,
    },
  },
];

export default function CopilotPage() {
  const [taskPlan, setTaskPlan] = useState<TaskPlan | null>(null);
  const [selectedArrival, setSelectedArrival] = useState<string | null>(null);

  const handleTaskPlanGenerated = useCallback((plan: TaskPlan) => {
    setTaskPlan(plan);
  }, []);

  const handleApprove = useCallback(() => {
    if (!taskPlan) return;

    // Start execution
    setTaskPlan((prev) =>
      prev ? { ...prev, status: "executing" } : null
    );

    // Simulate task execution
    const tasks = taskPlan.tasks;
    let currentIndex = 0;

    const executeNext = () => {
      if (currentIndex >= tasks.length) {
        // All done
        setTaskPlan((prev) =>
          prev ? { ...prev, status: "completed" } : null
        );
        return;
      }

      // Set current task to running
      setTaskPlan((prev) => {
        if (!prev) return null;
        const newTasks = [...prev.tasks];
        newTasks[currentIndex] = { ...newTasks[currentIndex], status: "running" };
        return { ...prev, tasks: newTasks };
      });

      // Simulate execution time
      const delay = 800 + Math.random() * 1200;
      setTimeout(() => {
        // Complete the task
        setTaskPlan((prev) => {
          if (!prev) return null;
          const newTasks = [...prev.tasks];
          newTasks[currentIndex] = {
            ...newTasks[currentIndex],
            status: "completed",
            result: getTaskResult(newTasks[currentIndex]),
            duration: Math.round(delay),
          };
          return { ...prev, tasks: newTasks };
        });

        currentIndex++;
        executeNext();
      }, delay);
    };

    executeNext();
  }, [taskPlan]);

  const handleCancel = useCallback(() => {
    setTaskPlan((prev) =>
      prev ? { ...prev, status: "cancelled" } : null
    );
    setTimeout(() => setTaskPlan(null), 500);
  }, []);

  const handleClose = useCallback(() => {
    setTaskPlan(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#1a1a1a] h-12 flex items-center justify-between px-4 text-white shrink-0">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold">Four Seasons</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">Park Lane • Copilot</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">Monday, February 15, 2024</span>
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs">
            MC
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Chat */}
        <div className="w-96 shrink-0">
          <AgentChat
            onTaskPlanGenerated={handleTaskPlanGenerated}
            currentPlan={taskPlan}
          />
        </div>

        {/* Middle Column - Arrivals */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200">
          {/* Arrivals Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Today's Arrivals</h1>
                  <div className="text-xs text-gray-500">
                    {operaArrivals.length} guests • {operaArrivals.filter((a) => a.vip).length} VIPs • {operaArrivals.filter((a) => a.occasion).length} special occasions
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Arrivals List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {operaArrivals.map((arrival, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedArrival(arrival.confirmation)}
                  className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedArrival === arrival.confirmation
                      ? "border-amber-400 ring-2 ring-amber-100"
                      : "border-gray-200"
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-gray-900">
                          {arrival.name}
                        </span>
                        {arrival.vip && (
                          <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                            arrival.vip === "VVIP"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {arrival.vip}
                          </span>
                        )}
                        {arrival.stayCount > 1 && (
                          <span className="text-xs text-gray-400">
                            {arrival.stayCount} stays
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {arrival.roomType} • {arrival.nights} night{arrival.nights > 1 ? "s" : ""} • {arrival.status}
                        {arrival.room && <span className="text-gray-700 font-medium"> → Room {arrival.room}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">{arrival.confirmation}</div>
                      {arrival.intelligence.actions > 0 && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded">
                          {arrival.intelligence.actions} actions
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Intelligence Row */}
                  <div className="flex flex-wrap gap-2">
                    {arrival.occasion && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-700 rounded text-xs">
                        <Heart className="w-3 h-3" />
                        {arrival.occasion}
                      </div>
                    )}
                    {arrival.dietary && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        {arrival.dietary}
                      </div>
                    )}
                    {arrival.intelligence.preferences.slice(0, 2).map((pref, i) => (
                      <div key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {pref}
                      </div>
                    ))}
                    {arrival.intelligence.preferences.length > 2 && (
                      <div className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                        +{arrival.intelligence.preferences.length - 2} more
                      </div>
                    )}
                  </div>

                  {/* Predicted Needs */}
                  {arrival.intelligence.predicted.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                        Predicted needs
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {arrival.intelligence.predicted.map((need, i) => (
                          <span key={i} className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Task Execution Panel */}
        <div className="w-96 shrink-0 bg-gray-50 border-l border-gray-200">
          <AgentTaskPanel
            plan={taskPlan}
            onApprove={handleApprove}
            onCancel={handleCancel}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  );
}

// Helper to generate realistic task results
function getTaskResult(task: AgentTask): string {
  switch (task.type) {
    case "api_call":
      return "Successfully retrieved data from system";
    case "query":
      return "Found 8 matching records";
    case "notification":
      return "Notification sent successfully";
    case "update":
      return "System updated successfully";
    case "action":
      return "Action completed";
    default:
      return "Completed";
  }
}
