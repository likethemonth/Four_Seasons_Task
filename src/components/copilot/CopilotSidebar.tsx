"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCopilot } from "@/context/CopilotContext";
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
  CheckCircle2,
  Bed,
  Utensils,
  Mail,
  Phone,
  AlertCircle,
  Trash2,
  Loader2,
  Play,
  Circle,
  Zap,
  ArrowRight,
} from "lucide-react";

// Step types for agentic workflow visualization
type StepType = "read" | "write" | "think" | "action" | "notify";

interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  stepType: StepType;
  target?: string;
  result?: string;
  autoApprove?: boolean;
  // Navigation actions - the agent will navigate to pages
  navigateTo?: string | null; // e.g., "/housekeeping", "/guests", "/schedule"
}

interface TaskPlan {
  id: string;
  query: string;
  reasoning: string;
  tasks: AgentTask[];
  status: "pending_approval" | "executing" | "completed" | "cancelled";
  summary?: string;
}

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

// Generate task plan from user query with page navigation
function generateTaskPlan(query: string): TaskPlan | null {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("optimize") && (lowerQuery.includes("housekeeping") || lowerQuery.includes("cleaning") || lowerQuery.includes("queue"))) {
    return {
      id: `plan_${Date.now()}`,
      query,
      reasoning: "I'll analyze the current room inventory, cross-reference with VIP arrival times, and calculate the most efficient cleaning routes to minimize staff travel time.",
      tasks: [
        { id: "t1", title: "Read Room Inventory", description: "Fetching current room statuses from OPERA PMS", status: "pending", stepType: "read", target: "OPERA PMS", autoApprove: true, navigateTo: "/housekeeping" },
        { id: "t2", title: "Read VIP Schedule", description: "Loading today's VIP arrivals and checkout times", status: "pending", stepType: "read", target: "Guest Intelligence", autoApprove: true, navigateTo: "/guests" },
        { id: "t3", title: "Analyze Priorities", description: "Calculating urgency scores based on arrival windows", status: "pending", stepType: "think", autoApprove: true },
        { id: "t4", title: "Compute Optimal Routes", description: "Running floor-zone optimization to minimize elevator trips", status: "pending", stepType: "think", autoApprove: true, navigateTo: "/housekeeping" },
        { id: "t5", title: "Update Queue Order", description: "Reordering cleaning queue with optimized assignments", status: "pending", stepType: "write", target: "Housekeeping System", autoApprove: true, navigateTo: "/housekeeping" },
        { id: "t6", title: "Notify Staff", description: "Pushing updated assignments to staff devices", status: "pending", stepType: "notify", autoApprove: true },
      ],
      status: "pending_approval",
      summary: "Housekeeping queue optimized with 23% reduction in floor changes",
    };
  }

  if ((lowerQuery.includes("prepare") || lowerQuery.includes("setup")) && (lowerQuery.includes("vip") || lowerQuery.includes("arrival") || lowerQuery.includes("guest"))) {
    const guestMatch = query.match(/(?:for|guest)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    const guestName = guestMatch ? guestMatch[1] : "VIP guest";
    return {
      id: `plan_${Date.now()}`,
      query,
      reasoning: `Coordinating a personalized arrival experience for ${guestName}. I'll pull their full profile, verify room readiness, and brief all relevant departments.`,
      tasks: [
        { id: "t1", title: "Read Guest Profile", description: `Loading complete intelligence for ${guestName}`, status: "pending", stepType: "read", target: "Guest Database", autoApprove: true, navigateTo: "/guests" },
        { id: "t2", title: "Analyze Preferences", description: "Cross-referencing past stays with current room setup", status: "pending", stepType: "think", autoApprove: true },
        { id: "t3", title: "Check Room Status", description: "Verifying room readiness and special setup completion", status: "pending", stepType: "read", target: "Housekeeping", autoApprove: true, navigateTo: "/housekeeping" },
        { id: "t4", title: "Prepare Amenities", description: "Triggering personalized amenity setup workflow", status: "pending", stepType: "action", autoApprove: true },
        { id: "t5", title: "Brief Front Desk", description: "Sending guest preferences and check-in notes", status: "pending", stepType: "notify", target: "Front Desk", autoApprove: true, navigateTo: "/" },
        { id: "t6", title: "Alert F&B Team", description: "Notifying of dietary restrictions and dining preferences", status: "pending", stepType: "notify", target: "F&B", autoApprove: true },
      ],
      status: "pending_approval",
      summary: `${guestName}'s arrival preparation complete - all departments briefed`,
    };
  }

  if (lowerQuery.includes("assign") && lowerQuery.includes("room")) {
    const guestMatch = query.match(/(?:for|guest)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    const guestName = guestMatch ? guestMatch[1] : "the guest";
    return {
      id: `plan_${Date.now()}`,
      query,
      reasoning: `Finding the optimal room for ${guestName} based on their historical preferences and current availability.`,
      tasks: [
        { id: "t1", title: "Read Guest Preferences", description: "Loading room preference history", status: "pending", stepType: "read", target: "Guest Intelligence", autoApprove: true, navigateTo: "/guests" },
        { id: "t2", title: "Read Room Inventory", description: "Querying available rooms matching requirements", status: "pending", stepType: "read", target: "OPERA PMS", autoApprove: true, navigateTo: "/housekeeping" },
        { id: "t3", title: "Score Room Options", description: "Ranking available rooms by preference match percentage", status: "pending", stepType: "think", autoApprove: true },
        { id: "t4", title: "Assign Room", description: "Updating reservation with best matching room", status: "pending", stepType: "write", target: "OPERA PMS", autoApprove: true, navigateTo: "/guests" },
        { id: "t5", title: "Prioritize Cleaning", description: "Alerting housekeeping of room priority", status: "pending", stepType: "notify", target: "Housekeeping", autoApprove: true, navigateTo: "/housekeeping" },
      ],
      status: "pending_approval",
      summary: `Room assigned with 94% preference match for ${guestName}`,
    };
  }

  if (lowerQuery.includes("send") && (lowerQuery.includes("email") || lowerQuery.includes("message") || lowerQuery.includes("notify"))) {
    return {
      id: `plan_${Date.now()}`,
      query,
      reasoning: "Composing a personalized pre-arrival message using the guest's profile and communication preferences.",
      tasks: [
        { id: "t1", title: "Read Guest Profile", description: "Loading communication history and preferences", status: "pending", stepType: "read", target: "Guest Database", autoApprove: true, navigateTo: "/guests" },
        { id: "t2", title: "Analyze Context", description: "Determining optimal message content and timing", status: "pending", stepType: "think", autoApprove: true },
        { id: "t3", title: "Generate Message", description: "Creating personalized content from template", status: "pending", stepType: "action", autoApprove: true },
        { id: "t4", title: "Send Communication", description: "Delivering via guest's preferred channel", status: "pending", stepType: "notify", autoApprove: true },
        { id: "t5", title: "Log Interaction", description: "Recording in guest communication history", status: "pending", stepType: "write", target: "Guest Database", autoApprove: true, navigateTo: "/guests" },
      ],
      status: "pending_approval",
      summary: "Pre-arrival message sent successfully",
    };
  }

  return null;
}

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

  const router = useRouter();
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestIntelligence | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [taskPlan, setTaskPlan] = useState<TaskPlan | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab, taskPlan]);

  const getContextDescription = () => {
    const parts: string[] = [];
    if (pageContext.page) {
      parts.push(`Viewing: ${pageContext.page}`);
    }
    if (pageContext.selectedRoom) {
      parts.push(`Room ${pageContext.selectedRoom.roomNumber}`);
    }
    if (pageContext.selectedGuest) {
      parts.push(`Guest: ${pageContext.selectedGuest.name}`);
    }
    return parts.length > 0 ? parts.join(" | ") : null;
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    addMessage("user", userMessage);
    setIsSending(true);

    await new Promise((r) => setTimeout(r, 800));

    // Try to generate a task plan
    const plan = generateTaskPlan(userMessage);
    if (plan) {
      setTaskPlan(plan);
      addMessage("assistant", `I've created an execution plan with ${plan.tasks.length} tasks. Review and approve below to execute.`);
    } else {
      // Fallback text response
      const lowerQuery = userMessage.toLowerCase();
      let response = "";
      if (lowerQuery.includes("vip") || lowerQuery.includes("arrival")) {
        response = "Today we have 3 arrivals including 2 VIPs. Try: **\"Prepare VIP arrival for Piper Kiser\"** to execute automated preparation.";
      } else if (lowerQuery.includes("housekeeping") || lowerQuery.includes("clean")) {
        response = "There are 4 rooms in the queue. Try: **\"Optimize housekeeping queue\"** to run automated route optimization.";
      } else {
        response = "I can execute tasks for you. Try:\n\n• \"Optimize housekeeping queue\"\n• \"Prepare VIP arrival for [name]\"\n• \"Assign room for [guest]\"\n• \"Send pre-arrival email\"";
      }
      addMessage("assistant", response);
    }
    setIsSending(false);
  };

  const handleApproveTaskPlan = () => {
    if (!taskPlan) return;
    setTaskPlan({ ...taskPlan, status: "executing" });

    let idx = 0;
    const runNext = () => {
      if (idx >= taskPlan.tasks.length) {
        setTaskPlan((p) => p ? { ...p, status: "completed" } : null);
        addMessage("assistant", "All tasks completed successfully!");
        return;
      }

      const currentTask = taskPlan.tasks[idx];

      // Navigate to the relevant page when task starts
      if (currentTask.navigateTo) {
        router.push(currentTask.navigateTo);
      }

      setTaskPlan((p) => {
        if (!p) return null;
        const tasks = [...p.tasks];
        tasks[idx] = { ...tasks[idx], status: "running" };
        return { ...p, tasks };
      });

      // Simulate task execution with varying durations
      const duration = currentTask.stepType === "think" ? 1200 + Math.random() * 800 : 600 + Math.random() * 600;

      setTimeout(() => {
        setTaskPlan((p) => {
          if (!p) return null;
          const tasks = [...p.tasks];
          tasks[idx] = { ...tasks[idx], status: "completed", result: getTaskResult(currentTask) };
          return { ...p, tasks };
        });
        idx++;
        runNext();
      }, duration);
    };
    runNext();
  };

  // Generate realistic task results
  const getTaskResult = (task: AgentTask): string => {
    switch (task.stepType) {
      case "read":
        if (task.target?.includes("PMS") || task.target?.includes("Housekeeping")) return "Retrieved 47 room records";
        if (task.target?.includes("Guest") || task.target?.includes("Intelligence")) return "Loaded guest profile with 23 preferences";
        return "Data loaded successfully";
      case "write":
        return "Updated successfully";
      case "think":
        if (task.title.includes("Priorities")) return "Scored 12 high-priority rooms";
        if (task.title.includes("Routes") || task.title.includes("Optimal")) return "Optimized route saves 23% travel time";
        if (task.title.includes("Score")) return "Best match: Room 801 (94% match)";
        return "Analysis complete";
      case "action":
        return "Action completed";
      case "notify":
        return "Notification sent";
      default:
        return "Completed";
    }
  };

  const handleCancelTaskPlan = () => {
    setTaskPlan(null);
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed right-0 top-[96px] bottom-0 w-12 bg-[#1a1a1a] flex flex-col items-center py-4 z-40 shadow-lg">
        <button onClick={() => setIsMinimized(false)} className="p-2 hover:bg-gray-700 rounded transition-colors mb-4">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <div className="flex-1 flex flex-col items-center gap-3">
          <button onClick={() => { setIsMinimized(false); setActiveTab("chat"); }} className={`p-2 rounded transition-colors ${activeTab === "chat" ? "bg-white/20" : "hover:bg-gray-700"}`}>
            <MessageSquare size={18} className="text-white" />
          </button>
          <button onClick={() => { setIsMinimized(false); setActiveTab("arrivals"); }} className={`p-2 rounded transition-colors ${activeTab === "arrivals" ? "bg-white/20" : "hover:bg-gray-700"}`}>
            <Users size={18} className="text-white" />
          </button>
          <button onClick={() => { setIsMinimized(false); setActiveTab("housekeeping"); }} className={`p-2 rounded transition-colors ${activeTab === "housekeeping" ? "bg-white/20" : "hover:bg-gray-700"}`}>
            <Building2 size={18} className="text-white" />
          </button>
        </div>
        <Sparkles size={20} className="text-white/70 mt-auto" />
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-[96px] bottom-0 w-[400px] bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1a1a] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-white" />
          <span className="text-[14px] font-semibold text-white">Copilot</span>
          {getContextDescription() && (
            <span className="text-[11px] text-gray-400 ml-2 truncate max-w-[150px]">{getContextDescription()}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-gray-700 rounded transition-colors">
            <ChevronRight size={16} className="text-white" />
          </button>
          <button onClick={close} className="p-1.5 hover:bg-gray-700 rounded transition-colors">
            <X size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button onClick={() => setActiveTab("chat")} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-medium transition-colors ${activeTab === "chat" ? "text-black border-b-2 border-black bg-white" : "text-gray-500 hover:text-gray-700"}`}>
          <MessageSquare size={14} />
          Chat
        </button>
        <button onClick={() => { setActiveTab("arrivals"); setSelectedGuest(null); }} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-medium transition-colors ${activeTab === "arrivals" ? "text-black border-b-2 border-black bg-white" : "text-gray-500 hover:text-gray-700"}`}>
          <Users size={14} />
          Arrivals
        </button>
        <button onClick={() => setActiveTab("housekeeping")} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-medium transition-colors ${activeTab === "housekeeping" ? "text-black border-b-2 border-black bg-white" : "text-gray-500 hover:text-gray-700"}`}>
          <Building2 size={14} />
          HK Queue
        </button>
      </div>

      {/* Agent Status Bar - Shows when executing */}
      {taskPlan?.status === "executing" && (
        <AgentStatusBar taskPlan={taskPlan} />
      )}

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
            onClear={() => { clearMessages(); setTaskPlan(null); }}
            messagesEndRef={messagesEndRef}
            taskPlan={taskPlan}
            onApprove={handleApproveTaskPlan}
            onCancel={handleCancelTaskPlan}
            onNavigate={(path) => router.push(path)}
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

// Get page display name
function getPageName(path: string | null | undefined): string | null {
  if (!path) return null;
  switch (path) {
    case "/": return "Dashboard";
    case "/housekeeping": return "Housekeeping";
    case "/guests": return "Guest Intelligence";
    case "/schedule": return "Schedule";
    case "/copilot": return "Copilot";
    default: return path;
  }
}

// Agent Status Bar - Shows current action when executing
function AgentStatusBar({ taskPlan }: { taskPlan: TaskPlan }) {
  const runningTask = taskPlan.tasks.find(t => t.status === "running");
  const completedCount = taskPlan.tasks.filter(t => t.status === "completed").length;
  const totalCount = taskPlan.tasks.length;

  if (!runningTask) return null;

  const getActionVerb = (stepType: StepType | string | undefined) => {
    switch (stepType) {
      case "read": return "Reading";
      case "write": return "Writing to";
      case "think": return "Analyzing";
      case "action": return "Executing";
      case "notify": return "Notifying";
      default: return "Processing";
    }
  };

  const pageName = getPageName(runningTask.navigateTo);

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-2.5 flex items-center gap-3 border-b border-gray-700">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" />
        <div className="text-[11px] text-white font-medium truncate">
          {getActionVerb(runningTask.stepType)} {runningTask.target || runningTask.title}
        </div>
        {pageName && (
          <div className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0">
            <ArrowRight className="w-3 h-3" />
            <span className="text-white">{pageName}</span>
          </div>
        )}
      </div>
      <div className="text-[10px] text-gray-400 shrink-0">
        Step {completedCount + 1}/{totalCount}
      </div>
    </div>
  );
}

// Step type badge component
function StepTypeBadge({ type, status }: { type: StepType | string | undefined | null; status: string }) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    read: { label: "READ", bg: "bg-gray-100", text: "text-gray-700" },
    write: { label: "WRITE", bg: "bg-gray-100", text: "text-gray-700" },
    think: { label: "THINK", bg: "bg-gray-100", text: "text-gray-700" },
    action: { label: "ACTION", bg: "bg-gray-100", text: "text-gray-700" },
    notify: { label: "NOTIFY", bg: "bg-gray-100", text: "text-gray-700" },
    // Fallbacks for old type system
    api_call: { label: "API", bg: "bg-gray-100", text: "text-gray-700" },
    query: { label: "READ", bg: "bg-gray-100", text: "text-gray-700" },
    update: { label: "WRITE", bg: "bg-gray-100", text: "text-gray-700" },
    notification: { label: "NOTIFY", bg: "bg-gray-100", text: "text-gray-700" },
  };
  const defaultConfig = { label: "TASK", bg: "bg-gray-100", text: "text-gray-700" };
  const stepConfig = (type && typeof type === "string" && config[type]) ? config[type] : defaultConfig;
  const isActive = status === "running";
  return (
    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${isActive ? "bg-gray-900 text-white" : stepConfig.bg + " " + stepConfig.text}`}>
      {stepConfig.label}
    </span>
  );
}

// Chat View with Task Execution
function ChatView({
  messages,
  chatInput,
  setChatInput,
  onSend,
  isSending,
  onClear,
  messagesEndRef,
  taskPlan,
  onApprove,
  onCancel,
  onNavigate,
}: {
  messages: { id: string; role: string; content: string; timestamp: Date }[];
  chatInput: string;
  setChatInput: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
  onClear: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  taskPlan: TaskPlan | null;
  onApprove: () => void;
  onCancel: () => void;
  onNavigate: (path: string) => void;
}) {
  const completedCount = taskPlan?.tasks.filter(t => t.status === "completed").length || 0;
  const totalCount = taskPlan?.tasks.length || 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles size={32} className="mx-auto mb-3 text-gray-300" />
            <div className="text-[14px] text-gray-500 mb-2">AI Task Assistant</div>
            <div className="text-[12px] text-gray-400 mb-4">
              I can execute tasks across hotel systems.
            </div>
            <div className="space-y-2 text-left max-w-[280px] mx-auto">
              {["Optimize housekeeping queue", "Prepare VIP arrival for Piper Kiser", "Assign room for Marcus Chen"].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setChatInput(prompt)}
                  className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-[12px] text-gray-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-[13px] ${msg.role === "user" ? "bg-[#1a1a1a] text-white" : "bg-gray-100 text-gray-800"}`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div className={`text-[10px] mt-1 ${msg.role === "user" ? "text-gray-400" : "text-gray-500"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
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
          </>
        )}

        {/* Enhanced Task Plan UI */}
        {taskPlan && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mt-2 shadow-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-[12px] font-semibold text-white">Execution Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  {taskPlan.status === "completed" ? (
                    <span className="flex items-center gap-1 text-[10px] text-green-400">
                      <CheckCircle2 className="w-3 h-3" /> Complete
                    </span>
                  ) : taskPlan.status === "executing" ? (
                    <span className="text-[10px] text-amber-400">{completedCount}/{totalCount} steps</span>
                  ) : (
                    <span className="text-[10px] text-gray-400">{totalCount} steps</span>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              {(taskPlan.status === "executing" || taskPlan.status === "completed") && (
                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${taskPlan.status === "completed" ? "bg-green-500" : "bg-gray-500"}`}
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Reasoning */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3 h-3 text-gray-700 mt-0.5 shrink-0" />
                <p className="text-[11px] text-gray-700 leading-relaxed">{taskPlan.reasoning}</p>
              </div>
            </div>

            {/* Tasks */}
            <div className="p-2 space-y-1">
              {taskPlan.tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className={`p-2 rounded-lg border transition-all ${
                    task.status === "completed"
                      ? "bg-green-50 border-green-200"
                      : task.status === "running"
                      ? "bg-amber-50 border-amber-300 shadow-sm"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {/* Status Icon */}
                    <div className="mt-0.5 shrink-0">
                    {task.status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : task.status === "running" ? (
                      <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StepTypeBadge type={task.stepType || (task as unknown as { type?: string }).type} status={task.status} />
                        <span className="text-[11px] font-medium text-gray-800">{task.title}</span>
                        {!task.autoApprove && task.status === "pending" && (
                          <span className="px-1 py-0.5 text-[8px] bg-gray-100 text-gray-600 rounded font-medium">
                            REVIEW
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">{task.description}</p>

                      {/* Target system */}
                      {task.target && (
                        <div className="text-[9px] text-gray-400 mt-1">
                          <ArrowRight className="w-2.5 h-2.5 inline mr-0.5" />
                          {task.target}
                        </div>
                      )}

                      {/* Navigation indicator when running */}
                      {task.status === "running" && task.navigateTo && (
                        <div className="mt-1.5 flex items-center gap-1 text-[9px] text-gray-600 font-medium animate-pulse">
                          <ArrowRight className="w-3 h-3" />
                          Navigating to {getPageName(task.navigateTo)}...
                        </div>
                      )}

                      {/* Navigation link when completed */}
                      {task.status === "completed" && task.navigateTo && (
                        <button
                          onClick={() => {
                            if (task.navigateTo) onNavigate(task.navigateTo);
                          }}
                          className="mt-1.5 text-[10px] text-gray-700 hover:text-gray-900 flex items-center gap-1"
                        >
                          <ArrowRight className="w-3 h-3" />
                          View {getPageName(task.navigateTo)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary (on completion) */}
            {taskPlan.status === "completed" && taskPlan.summary && (
              <div className="px-3 py-2 bg-green-50 border-t border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="text-[11px] text-green-800 font-medium">{taskPlan.summary}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            {taskPlan.status === "pending_approval" && (
              <div className="p-2 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={onCancel}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-md text-[11px] font-medium hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onApprove}
                    className="flex-1 px-3 py-2 bg-[#1a1a1a] text-white rounded-md text-[11px] font-medium hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3 h-3" /> Execute {totalCount} Steps
                  </button>
                </div>
              </div>
            )}

            {taskPlan.status === "executing" && (
              <div className="p-2 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-700">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing step {completedCount + 1} of {totalCount}...</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3">
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <button onClick={onClear} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600">
              <Trash2 size={12} /> Clear
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
            placeholder="Ask me to do something..."
            className="flex-1 rounded border border-gray-200 px-3 py-2 text-[13px] focus:border-gray-400 focus:outline-none"
            disabled={isSending}
          />
          <button onClick={onSend} disabled={!chatInput.trim() || isSending} className="rounded bg-[#1a1a1a] px-4 py-2 text-white hover:bg-[#2a2a2a] disabled:bg-gray-300 transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Arrivals View
function ArrivalsView({ arrivals, onSelectGuest }: { arrivals: GuestIntelligence[]; onSelectGuest: (g: GuestIntelligence) => void }) {
  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Today's Arrivals</div>
        <div className="text-[13px] text-gray-600">{arrivals.length} guests • {arrivals.filter(a => a.vipCode).length} VIPs</div>
      </div>
      <div className="space-y-3">
        {arrivals.map((guest) => (
          <button key={guest.id} onClick={() => onSelectGuest(guest)} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-gray-900">{guest.name}</span>
                  {guest.vipCode && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded">{guest.vipCode}</span>}
                </div>
                <div className="text-[11px] text-gray-500">{guest.stayCount > 1 ? `${guest.stayCount} stays` : "First visit"} • {guest.roomType}</div>
              </div>
              <ChevronRight size={16} className="text-gray-400 mt-1" />
            </div>
            {guest.occasion && <div className="flex items-center gap-1.5 text-[11px] text-rose-600 mb-1"><Heart size={12} />{guest.occasion}</div>}
            {guest.dietary.length > 0 && <div className="flex items-center gap-1.5 text-[11px] text-orange-600"><AlertTriangle size={12} />{guest.dietary.join(", ")}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

// Guest Detail View
function GuestDetailView({ guest, onBack }: { guest: GuestIntelligence; onBack: () => void }) {
  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center gap-1 text-[12px] text-gray-600 hover:text-black mb-3">
        <ChevronLeft size={14} /> Back
      </button>
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[18px] font-semibold text-gray-900">{guest.name}</span>
          {guest.vipCode && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">{guest.vipCode}</span>}
        </div>
        <div className="text-[12px] text-gray-500">{guest.roomType}{guest.assignedRoom && ` • Room ${guest.assignedRoom}`}</div>
        {guest.occasion && <div className="flex items-center gap-1.5 mt-2 text-[12px] text-rose-600"><Heart size={14} />{guest.occasion}</div>}
      </div>
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Action Items</div>
        <div className="space-y-2">
          {guest.actionItems.map((action, idx) => (
            <div key={idx} className={`flex items-start gap-2 p-2 rounded ${action.priority === "high" ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"}`}>
              <CheckCircle size={14} className={action.priority === "high" ? "text-red-500 mt-0.5" : "text-gray-400 mt-0.5"} />
              <div className="flex-1">
                <div className="text-[12px] text-gray-800">{action.action}</div>
                {action.assignedTo && <div className="text-[10px] text-gray-500">→ {action.assignedTo}</div>}
              </div>
            </div>
          ))}
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
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Smart Cleaning Queue</div>
        <div className="text-[13px] text-gray-600">Prioritized by arrival times</div>
      </div>
      <div className="space-y-2">
        {queue.map((room, idx) => (
          <div key={idx} className={`p-3 rounded-lg border ${room.priority === "URGENT" ? "bg-red-50 border-red-200" : room.priority === "HIGH" ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-bold text-gray-900">Room {room.room}</span>
                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${room.priority === "URGENT" ? "bg-red-500 text-white" : room.priority === "HIGH" ? "bg-orange-500 text-white" : "bg-gray-400 text-white"}`}>{room.priority}</span>
              </div>
              <span className="text-[11px] text-gray-500">{room.estimatedTime} min</span>
            </div>
            {room.nextGuest && <div className="text-[11px] text-amber-700 font-medium">{room.nextGuest}</div>}
            <div className="text-[11px] text-gray-700 mt-1">{room.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
