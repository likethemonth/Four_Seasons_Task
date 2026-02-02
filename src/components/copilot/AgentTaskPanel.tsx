"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Loader2,
  Play,
  X,
  ChevronRight,
  Sparkles,
  Clock,
  AlertCircle,
  ArrowRight,
  Zap,
  Users,
  Building2,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  type: "api_call" | "notification" | "update" | "query" | "action";
  target?: string;
  result?: string;
  duration?: number;
}

export interface TaskPlan {
  id: string;
  query: string;
  reasoning: string;
  tasks: AgentTask[];
  status: "pending_approval" | "executing" | "completed" | "cancelled";
  estimatedTime: number;
  createdAt: Date;
}

interface AgentTaskPanelProps {
  plan: TaskPlan | null;
  onApprove: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export default function AgentTaskPanel({
  plan,
  onApprove,
  onCancel,
  onClose,
}: AgentTaskPanelProps) {
  if (!plan) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6">
        <Sparkles className="w-12 h-12 mb-3 opacity-50" />
        <p className="text-sm text-center">
          Ask the AI assistant to perform tasks.<br />
          Task plans will appear here for approval.
        </p>
      </div>
    );
  }

  const completedCount = plan.tasks.filter((t) => t.status === "completed").length;
  const isExecuting = plan.status === "executing";
  const isComplete = plan.status === "completed";
  const isPending = plan.status === "pending_approval";

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-gray-900">Task Execution</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isComplete ? "bg-green-500" : "bg-amber-500"
              }`}
              style={{ width: `${(completedCount / plan.tasks.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {completedCount}/{plan.tasks.length}
          </span>
        </div>
      </div>

      {/* Query Summary */}
      <div className="px-4 py-3 border-b border-gray-100 bg-amber-50/50">
        <div className="text-xs text-amber-700 font-medium mb-1">Request</div>
        <div className="text-sm text-gray-800">{plan.query}</div>
      </div>

      {/* AI Reasoning */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI Analysis
        </div>
        <div className="text-xs text-gray-600">{plan.reasoning}</div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">
          Execution Plan ({plan.tasks.length} tasks)
        </div>

        <div className="space-y-2">
          {plan.tasks.map((task, idx) => (
            <TaskItem key={task.id} task={task} index={idx} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        {isPending && (
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onApprove}
              className="flex-1 px-4 py-2 bg-[#1a1a1a] text-white rounded-md text-sm font-medium hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Execute Tasks
            </button>
          </div>
        )}

        {isExecuting && (
          <div className="flex items-center justify-center gap-2 py-2 text-amber-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Executing tasks...</span>
          </div>
        )}

        {isComplete && (
          <div className="flex items-center justify-center gap-2 py-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">All tasks completed</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskItem({ task, index }: { task: AgentTask; index: number }) {
  const getIcon = () => {
    switch (task.type) {
      case "api_call":
        return <Zap className="w-3.5 h-3.5" />;
      case "notification":
        return <Mail className="w-3.5 h-3.5" />;
      case "update":
        return <Building2 className="w-3.5 h-3.5" />;
      case "query":
        return <Users className="w-3.5 h-3.5" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5" />;
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        task.status === "completed"
          ? "bg-green-50 border-green-200"
          : task.status === "running"
          ? "bg-amber-50 border-amber-200 shadow-sm"
          : task.status === "failed"
          ? "bg-red-50 border-red-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className="shrink-0 mt-0.5">{getStatusIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
            <div className={`p-1 rounded ${
              task.status === "running" ? "bg-amber-100" : "bg-gray-100"
            }`}>
              {getIcon()}
            </div>
            <span className="text-sm font-medium text-gray-900 truncate">
              {task.title}
            </span>
          </div>
          <div className="text-xs text-gray-600 mb-1">{task.description}</div>

          {task.target && (
            <div className="text-xs text-gray-400">
              Target: <span className="text-gray-600">{task.target}</span>
            </div>
          )}

          {task.result && (
            <div className={`mt-2 text-xs p-2 rounded ${
              task.status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {task.result}
            </div>
          )}

          {task.duration !== undefined && task.status === "completed" && (
            <div className="mt-1 text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.duration}ms
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to generate task plans from user queries
export function generateTaskPlan(query: string): TaskPlan | null {
  const lowerQuery = query.toLowerCase();

  // Optimize housekeeping
  if (lowerQuery.includes("optimize") && (lowerQuery.includes("housekeeping") || lowerQuery.includes("cleaning"))) {
    return {
      id: `plan_${Date.now()}`,
      query,
      reasoning: "I'll analyze the current room status, check VIP arrivals and checkout times, then generate an optimized cleaning route that minimizes floor changes and prioritizes urgent rooms.",
      tasks: [
        {
          id: "t1",
          title: "Fetch Room Status",
          description: "Query OPERA PMS for current room statuses across all floors",
          status: "pending",
          type: "api_call",
          target: "OPERA PMS API",
        },
        {
          id: "t2",
          title: "Get VIP Arrivals",
          description: "Identify VIP guests arriving today with their expected check-in times",
          status: "pending",
          type: "query",
          target: "Guest Intelligence DB",
        },
        {
          id: "t3",
          title: "Calculate Optimal Routes",
          description: "Run floor-zone optimization algorithm to minimize elevator trips",
          status: "pending",
          type: "action",
        },
        {
          id: "t4",
          title: "Generate Staff Assignments",
          description: "Assign housekeepers to floor zones based on workload balance",
          status: "pending",
          type: "action",
        },
        {
          id: "t5",
          title: "Update Task Queue",
          description: "Push optimized assignments to housekeeping task queue",
          status: "pending",
          type: "update",
          target: "Housekeeping System",
        },
        {
          id: "t6",
          title: "Notify Staff",
          description: "Send updated assignments to housekeeping staff devices",
          status: "pending",
          type: "notification",
        },
      ],
      status: "pending_approval",
      estimatedTime: 45,
      createdAt: new Date(),
    };
  }

  // Prepare VIP arrival
  if (lowerQuery.includes("vip") && (lowerQuery.includes("prepare") || lowerQuery.includes("arrival"))) {
    const guestMatch = query.match(/(?:for|guest)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    const guestName = guestMatch ? guestMatch[1] : "the VIP guest";

    return {
      id: `plan_${Date.now()}`,
      query,
      reasoning: `I'll coordinate all departments to prepare for ${guestName}'s arrival, including room preparation, amenity setup, and staff briefing.`,
      tasks: [
        {
          id: "t1",
          title: "Retrieve Guest Profile",
          description: `Fetch complete guest intelligence for ${guestName}`,
          status: "pending",
          type: "query",
          target: "Guest Intelligence DB",
        },
        {
          id: "t2",
          title: "Check Room Readiness",
          description: "Verify assigned room status and special setup requirements",
          status: "pending",
          type: "api_call",
          target: "Housekeeping System",
        },
        {
          id: "t3",
          title: "Coordinate Amenities",
          description: "Trigger pre-arrival amenity setup based on guest preferences",
          status: "pending",
          type: "action",
        },
        {
          id: "t4",
          title: "Brief Front Desk",
          description: "Send guest preferences and special requests to front desk team",
          status: "pending",
          type: "notification",
          target: "Front Desk Staff",
        },
        {
          id: "t5",
          title: "Alert F&B Team",
          description: "Notify restaurant of dietary requirements and dining preferences",
          status: "pending",
          type: "notification",
          target: "F&B Department",
        },
        {
          id: "t6",
          title: "Schedule GM Welcome",
          description: "Add GM welcome call to today's schedule if VIP status requires",
          status: "pending",
          type: "update",
          target: "Management Calendar",
        },
      ],
      status: "pending_approval",
      estimatedTime: 30,
      createdAt: new Date(),
    };
  }

  // Send guest communication
  if (lowerQuery.includes("send") && (lowerQuery.includes("email") || lowerQuery.includes("message"))) {
    return {
      id: `plan_${Date.now()}`,
      query,
      reasoning: "I'll compose and send a personalized message to the guest, using their preferences and stay history to customize the content.",
      tasks: [
        {
          id: "t1",
          title: "Load Guest Profile",
          description: "Retrieve guest preferences and communication history",
          status: "pending",
          type: "query",
          target: "Guest Intelligence DB",
        },
        {
          id: "t2",
          title: "Generate Personalized Content",
          description: "Create message using guest's name, preferences, and context",
          status: "pending",
          type: "action",
        },
        {
          id: "t3",
          title: "Review Message",
          description: "Validate message tone and accuracy before sending",
          status: "pending",
          type: "action",
        },
        {
          id: "t4",
          title: "Send Communication",
          description: "Deliver message via guest's preferred channel",
          status: "pending",
          type: "notification",
          target: "Communication System",
        },
        {
          id: "t5",
          title: "Log Interaction",
          description: "Record communication in guest history for future reference",
          status: "pending",
          type: "update",
          target: "Guest Intelligence DB",
        },
      ],
      status: "pending_approval",
      estimatedTime: 20,
      createdAt: new Date(),
    };
  }

  // Room assignment
  if (lowerQuery.includes("assign") && lowerQuery.includes("room")) {
    return {
      id: `plan_${Date.now()}`,
      query,
      reasoning: "I'll find the optimal room assignment based on guest preferences, VIP status, and current availability, then update the reservation.",
      tasks: [
        {
          id: "t1",
          title: "Fetch Guest Preferences",
          description: "Load room preferences from guest intelligence profile",
          status: "pending",
          type: "query",
          target: "Guest Intelligence DB",
        },
        {
          id: "t2",
          title: "Check Room Inventory",
          description: "Query available rooms matching guest requirements",
          status: "pending",
          type: "api_call",
          target: "OPERA PMS",
        },
        {
          id: "t3",
          title: "Score Room Options",
          description: "Rank available rooms by preference match score",
          status: "pending",
          type: "action",
        },
        {
          id: "t4",
          title: "Update Reservation",
          description: "Assign best-matching room to the reservation",
          status: "pending",
          type: "update",
          target: "OPERA PMS",
        },
        {
          id: "t5",
          title: "Notify Housekeeping",
          description: "Alert housekeeping of new room assignment priority",
          status: "pending",
          type: "notification",
          target: "Housekeeping System",
        },
      ],
      status: "pending_approval",
      estimatedTime: 25,
      createdAt: new Date(),
    };
  }

  return null;
}
