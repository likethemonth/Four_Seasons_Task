"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { TaskPlan, generateTaskPlan } from "./AgentTaskPanel";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  taskPlan?: TaskPlan;
}

interface AgentChatProps {
  onTaskPlanGenerated: (plan: TaskPlan) => void;
  currentPlan: TaskPlan | null;
}

const SUGGESTED_PROMPTS = [
  "Optimize housekeeping routes for today",
  "Prepare VIP arrival for Piper Kiser",
  "Assign best room for Marcus Chen",
  "Send pre-arrival email to all VIPs",
];

export default function AgentChat({ onTaskPlanGenerated, currentPlan }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your Four Seasons AI assistant. I can help you optimize operations, prepare for guest arrivals, and automate tasks across departments. What would you like me to help with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Try to generate a task plan
    const plan = generateTaskPlan(userMessage.content);

    let assistantContent: string;
    if (plan) {
      assistantContent = `I've analyzed your request and created an execution plan with ${plan.tasks.length} tasks. Please review the tasks in the panel on the right and approve to begin execution.`;
      onTaskPlanGenerated(plan);
    } else {
      // Generic responses for non-actionable queries
      assistantContent = getGenericResponse(userMessage.content);
    }

    const assistantMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content: assistantContent,
      timestamp: new Date(),
      taskPlan: plan || undefined,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">AI Assistant</div>
            <div className="text-xs text-gray-400">Four Seasons Intelligence</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                message.role === "user"
                  ? "bg-gray-200"
                  : "bg-gradient-to-br from-amber-400 to-orange-500"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-gray-600" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[80%] ${
                message.role === "user"
                  ? "bg-[#1a1a1a] text-white rounded-2xl rounded-tr-md"
                  : "bg-gray-100 text-gray-800 rounded-2xl rounded-tl-md"
              } px-4 py-2.5`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.taskPlan && (
                <div className="mt-2 pt-2 border-t border-gray-200/50">
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <Lightbulb className="w-3 h-3" />
                    <span>Task plan ready for review</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="text-xs text-gray-500 mb-2">Suggested actions:</div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedPrompt(prompt)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to do something..."
            className="flex-1 px-4 py-2.5 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
          >
            {isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function getGenericResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("hello") || lowerQuery.includes("hi")) {
    return "Hello! How can I assist you today? I can help with housekeeping optimization, guest preparation, room assignments, and more.";
  }

  if (lowerQuery.includes("thank")) {
    return "You're welcome! Let me know if there's anything else I can help with.";
  }

  if (lowerQuery.includes("help") || lowerQuery.includes("what can")) {
    return `I can help you with:

• **Housekeeping Optimization** - Generate efficient cleaning routes that minimize floor changes
• **VIP Preparation** - Coordinate all departments for guest arrivals
• **Room Assignments** - Match guests to rooms based on preferences
• **Guest Communications** - Send personalized messages
• **Task Automation** - Execute multi-step workflows across systems

Try asking me to "optimize housekeeping routes" or "prepare VIP arrival for [guest name]"`;
  }

  if (lowerQuery.includes("status") || lowerQuery.includes("today")) {
    return `Here's today's overview:

• **8 arrivals** scheduled (2 VIPs, 1 anniversary)
• **46 rooms** need cleaning (12 departures, 34 stayovers)
• **3 action items** flagged as high priority
• **All systems** operational

What would you like me to help you with?`;
  }

  return "I understand you want help with that. To execute tasks, try being more specific. For example:\n\n• \"Optimize housekeeping routes for today\"\n• \"Prepare VIP arrival for [guest name]\"\n• \"Assign best room for [guest name]\"\n\nI'll break down the request into executable tasks for your approval.";
}
