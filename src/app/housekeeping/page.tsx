"use client";

import { useState, useEffect } from "react";
import HousekeepingBoard from "@/components/housekeeping/HousekeepingBoard";
import QueuePanel from "@/components/housekeeping/QueuePanel";
import ReportsPanel from "@/components/housekeeping/ReportsPanel";
import SettingsPanel from "@/components/housekeeping/SettingsPanel";
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  FileText,
  Cog,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";

type TabType = "board" | "queue" | "reports" | "settings";

export default function HousekeepingPage() {
  const [activeTab, setActiveTab] = useState<TabType>("board");
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isOnline, setIsOnline] = useState(true);

  // Simulate real-time sync
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Sub-Header with Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3 text-[12px]">
            <div className="flex items-center gap-1.5">
              {isOnline ? (
                <Wifi size={14} className="text-green-600" />
              ) : (
                <WifiOff size={14} className="text-red-600" />
              )}
              <span
                className={`px-2 py-0.5 rounded-sm ${
                  isOnline
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isOnline ? "System Online" : "Offline"}
              </span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500 flex items-center gap-1">
              <RefreshCw size={12} />
              Last sync: {lastSync.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500">
              Four Seasons Park Lane
            </span>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <Cog size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("board")}
            className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-all border-b-2 ${
              activeTab === "board"
                ? "text-gray-900 border-gray-900"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            <LayoutDashboard size={16} />
            Room Board
          </button>
          <button
            onClick={() => setActiveTab("queue")}
            className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-all border-b-2 ${
              activeTab === "queue"
                ? "text-gray-900 border-gray-900"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            <ClipboardList size={16} />
            Task Queue
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-all border-b-2 ${
              activeTab === "reports"
                ? "text-gray-900 border-gray-900"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            <FileText size={16} />
            Reports
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-all border-b-2 ${
              activeTab === "settings"
                ? "text-gray-900 border-gray-900"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {activeTab === "board" && <HousekeepingBoard />}
        {activeTab === "queue" && <QueuePanel />}
        {activeTab === "reports" && <ReportsPanel />}
        {activeTab === "settings" && <SettingsPanel />}
      </div>
    </div>
  );
}
