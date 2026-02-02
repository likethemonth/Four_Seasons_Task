"use client";

import { useState } from "react";
import HousekeepingBoard from "@/components/housekeeping/HousekeepingBoard";
import QueuePanel from "@/components/housekeeping/QueuePanel";
import StaffStatus from "@/components/housekeeping/StaffStatus";
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  FileText,
  Users,
  Building2,
  Cog,
} from "lucide-react";

type TabType = "board" | "queue" | "reports" | "settings";

export default function HousekeepingPage() {
  const [activeTab, setActiveTab] = useState<TabType>("board");

  return (
    <div className="min-h-screen">
      {/* Sub-Header with Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-sm">
              System Online
            </span>
            <span>Last sync: {new Date().toLocaleTimeString()}</span>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Cog size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("board")}
            className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium transition-all border-b-2 ${
              activeTab === "board"
                ? "text-[#0d9488] border-[#0d9488]"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            <LayoutDashboard size={16} />
            Room Board
          </button>
          <button
            onClick={() => setActiveTab("queue")}
            className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium transition-all border-b-2 ${
              activeTab === "queue"
                ? "text-[#0d9488] border-[#0d9488]"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            <ClipboardList size={16} />
            Task Queue
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium transition-all border-b-2 ${
              activeTab === "reports"
                ? "text-[#0d9488] border-[#0d9488]"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            <FileText size={16} />
            Reports
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium transition-all border-b-2 ${
              activeTab === "settings"
                ? "text-[#0d9488] border-[#0d9488]"
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

        {activeTab === "reports" && (
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-[16px] font-semibold text-gray-900 mb-4">
              Housekeeping Reports
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <ReportCard
                title="Housekeeping Details Report"
                description="Room status information for all or selected rooms"
                icon={<Building2 size={20} />}
              />
              <ReportCard
                title="Attendant Productivity"
                description="Credits and rooms cleaned by attendant"
                icon={<Users size={20} />}
              />
              <ReportCard
                title="Room Discrepancy Report"
                description="FO and Housekeeping status conflicts"
                icon={<FileText size={20} />}
              />
              <ReportCard
                title="Task Assignment Sheet"
                description="Daily task sheets for housekeeping staff"
                icon={<ClipboardList size={20} />}
              />
              <ReportCard
                title="Room Statistics"
                description="Compiled room status and reservation data"
                icon={<LayoutDashboard size={20} />}
              />
              <ReportCard
                title="VIP Arrivals Report"
                description="Rooms with VIP guests arriving today"
                icon={<Users size={20} />}
              />
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-[16px] font-semibold text-gray-900 mb-4">
              Housekeeping Settings
            </h2>
            <div className="space-y-6">
              {/* Status Configuration */}
              <div>
                <h3 className="text-[14px] font-medium text-gray-800 mb-3">
                  Room Status Configuration
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <SettingToggle
                    label="Inspected Rooms"
                    description="Enable room inspection status"
                    enabled={true}
                  />
                  <SettingToggle
                    label="Pickup Rooms"
                    description="Enable pickup/touch-up status"
                    enabled={true}
                  />
                  <SettingToggle
                    label="Turndown Service"
                    description="Track turndown status"
                    enabled={false}
                  />
                  <SettingToggle
                    label="Guest Service Status"
                    description="DND and Make Up Room tracking"
                    enabled={true}
                  />
                </div>
              </div>

              {/* Auto-Assignment */}
              <div>
                <h3 className="text-[14px] font-medium text-gray-800 mb-3">
                  Auto-Assignment Rules
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <SettingToggle
                    label="Same Floor Priority"
                    description="Prioritize attendants on same floor"
                    enabled={true}
                  />
                  <SettingToggle
                    label="VIP Room Priority"
                    description="Auto-prioritize VIP arrivals"
                    enabled={true}
                  />
                  <SettingToggle
                    label="Suite Double Assignment"
                    description="Assign 2 attendants to suites"
                    enabled={true}
                  />
                  <SettingToggle
                    label="Credit-Based Distribution"
                    description="Distribute by attendant credits"
                    enabled={false}
                  />
                </div>
              </div>

              {/* OPERA Integration */}
              <div>
                <h3 className="text-[14px] font-medium text-gray-800 mb-3">
                  OPERA PMS Integration
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-sm flex items-center justify-center">
                      <Settings size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-blue-800">
                        OPERA Cloud Connection
                      </div>
                      <div className="text-[12px] text-blue-600 mt-1">
                        Status: <span className="font-medium">Demo Mode</span>
                      </div>
                      <div className="text-[11px] text-blue-500 mt-2">
                        In production, this system connects to OPERA Cloud via OHIP APIs
                        for real-time room status sync, checkout events, and guest data.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Report Card Component
function ReportCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <button className="flex items-start gap-3 p-4 border border-gray-200 rounded-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-left">
      <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <div>
        <div className="text-[13px] font-medium text-gray-900">{title}</div>
        <div className="text-[12px] text-gray-500 mt-0.5">{description}</div>
      </div>
    </button>
  );
}

// Setting Toggle Component
function SettingToggle({
  label,
  description,
  enabled,
}: {
  label: string;
  description: string;
  enabled: boolean;
}) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-sm">
      <div>
        <div className="text-[13px] font-medium text-gray-800">{label}</div>
        <div className="text-[11px] text-gray-500">{description}</div>
      </div>
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          isEnabled ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            isEnabled ? "left-5" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
