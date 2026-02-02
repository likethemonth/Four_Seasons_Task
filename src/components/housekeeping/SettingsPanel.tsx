"use client";

import { useState } from "react";
import {
  Settings,
  Users,
  Building2,
  Clock,
  Bell,
  Zap,
  Shield,
  Globe,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export default function SettingsPanel() {
  const [activeSection, setActiveSection] = useState("status");

  const sections: SettingSection[] = [
    { id: "status", title: "Room Status", icon: <Building2 size={18} /> },
    { id: "assignment", title: "Auto-Assignment", icon: <Zap size={18} /> },
    { id: "scheduling", title: "Scheduling", icon: <Clock size={18} /> },
    { id: "notifications", title: "Notifications", icon: <Bell size={18} /> },
    { id: "staff", title: "Staff Settings", icon: <Users size={18} /> },
    { id: "integration", title: "OPERA Integration", icon: <Globe size={18} /> },
  ];

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64 bg-white border border-gray-200 rounded-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-[14px] font-semibold text-gray-900">Settings</h2>
          <p className="text-[11px] text-gray-500 mt-1">
            Configure housekeeping module
          </p>
        </div>
        <nav className="p-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-[13px] transition-all ${
                activeSection === section.id
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {section.icon}
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeSection === "status" && <RoomStatusSettings />}
        {activeSection === "assignment" && <AutoAssignmentSettings />}
        {activeSection === "scheduling" && <SchedulingSettings />}
        {activeSection === "notifications" && <NotificationSettings />}
        {activeSection === "staff" && <StaffSettings />}
        {activeSection === "integration" && <IntegrationSettings />}
      </div>
    </div>
  );
}

// Room Status Settings
function RoomStatusSettings() {
  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-[14px] font-semibold text-gray-900">
          Room Status Configuration
        </h3>
        <p className="text-[12px] text-gray-500 mt-1">
          Configure which room statuses are enabled for housekeeping
        </p>
      </div>
      <div className="p-4 space-y-4">
        <SettingToggle
          label="Inspected Status"
          description="Enable room inspection status after cleaning"
          enabled={true}
          details="Rooms must be inspected by supervisor before marked ready"
        />
        <SettingToggle
          label="Pickup/Touch-up Status"
          description="Enable quick touch-up status for stayover rooms"
          enabled={true}
          details="Used for minor cleaning tasks during guest stay"
        />
        <SettingToggle
          label="Turndown Service"
          description="Track evening turndown service status"
          enabled={false}
          details="Enable to track turndown service completion"
        />
        <SettingToggle
          label="Do Not Disturb Tracking"
          description="Track and respect DND status from OPERA"
          enabled={true}
          details="Automatically delays room service when DND is active"
        />
        <SettingToggle
          label="Make Up Room (MUR)"
          description="Track guest requests for room service"
          enabled={true}
          details="Prioritizes rooms where guest has requested service"
        />
        <SettingToggle
          label="Out of Order (OOO)"
          description="Track rooms that are out of order"
          enabled={true}
          details="Rooms marked OOO are excluded from assignments"
        />
        <SettingToggle
          label="Out of Service (OOS)"
          description="Track rooms that are temporarily out of service"
          enabled={true}
          details="Rooms marked OOS may need maintenance attention"
        />
      </div>
    </div>
  );
}

// Auto-Assignment Settings
function AutoAssignmentSettings() {
  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-[14px] font-semibold text-gray-900">
          Auto-Assignment Rules
        </h3>
        <p className="text-[12px] text-gray-500 mt-1">
          Configure intelligent room assignment algorithms
        </p>
      </div>
      <div className="p-4 space-y-4">
        <SettingToggle
          label="Same Floor Priority"
          description="Prioritize attendants already on the same floor"
          enabled={true}
          priority={50}
          details="Reduces travel time between rooms"
        />
        <SettingToggle
          label="VIP Room Priority"
          description="Auto-prioritize VIP arrivals in queue"
          enabled={true}
          priority={20}
          details="VIP arrivals are bumped to top of queue"
        />
        <SettingToggle
          label="Suite Double Assignment"
          description="Automatically assign 2 attendants to suites"
          enabled={true}
          details="Ensures faster turnover for large suites"
        />
        <SettingToggle
          label="Early Arrival Priority"
          description="Prioritize rooms with arrivals within 2 hours"
          enabled={true}
          priority={20}
          details="Ensures rooms are ready for early check-ins"
        />
        <SettingToggle
          label="Credit-Based Distribution"
          description="Distribute rooms based on attendant credits"
          enabled={false}
          details="Balances workload based on room credit values"
        />
        <SettingToggle
          label="Skill-Based Assignment"
          description="Match room types to attendant specializations"
          enabled={true}
          details="Senior attendants handle VIP and suite rooms"
        />

        {/* Priority Score Preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-sm">
          <h4 className="text-[12px] font-semibold text-gray-700 mb-3">
            Priority Score Calculation
          </h4>
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Score</span>
              <span className="font-medium">10 points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Suite Room</span>
              <span className="font-medium text-purple-600">+30 points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VIP Arrival</span>
              <span className="font-medium text-amber-600">+20 points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Arrival &lt; 2 hours</span>
              <span className="font-medium text-blue-600">+20 points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Same Floor Bonus</span>
              <span className="font-medium text-green-600">+50 points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Scheduling Settings
function SchedulingSettings() {
  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-[14px] font-semibold text-gray-900">
          Scheduling Configuration
        </h3>
        <p className="text-[12px] text-gray-500 mt-1">
          Configure shift times and scheduling rules
        </p>
      </div>
      <div className="p-4 space-y-6">
        {/* Shift Configuration */}
        <div>
          <h4 className="text-[12px] font-semibold text-gray-700 mb-3">
            Shift Configuration
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                AM Shift Start
              </label>
              <input
                type="time"
                defaultValue="07:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                AM Shift End
              </label>
              <input
                type="time"
                defaultValue="15:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                PM Shift Start
              </label>
              <input
                type="time"
                defaultValue="15:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                PM Shift End
              </label>
              <input
                type="time"
                defaultValue="23:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px]"
              />
            </div>
          </div>
        </div>

        {/* Break Configuration */}
        <div>
          <h4 className="text-[12px] font-semibold text-gray-700 mb-3">
            Break Configuration
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Breaks Per Shift
              </label>
              <input
                type="number"
                defaultValue="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px]"
              />
            </div>
          </div>
        </div>

        {/* Room Credits */}
        <div>
          <h4 className="text-[12px] font-semibold text-gray-700 mb-3">
            Room Credits (Target per Shift)
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Standard Room
              </label>
              <input
                type="number"
                defaultValue="1.0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Deluxe Room
              </label>
              <input
                type="number"
                defaultValue="1.2"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Suite
              </label>
              <input
                type="number"
                defaultValue="2.0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px]"
              />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">
            Target: 14-16 credits per 8-hour shift
          </p>
        </div>
      </div>
    </div>
  );
}

// Notification Settings
function NotificationSettings() {
  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-[14px] font-semibold text-gray-900">
          Notification Preferences
        </h3>
        <p className="text-[12px] text-gray-500 mt-1">
          Configure alerts and notifications
        </p>
      </div>
      <div className="p-4 space-y-4">
        <SettingToggle
          label="VIP Arrival Alerts"
          description="Notify supervisors when VIP rooms need attention"
          enabled={true}
        />
        <SettingToggle
          label="Rush Room Alerts"
          description="Alert when room is needed within 30 minutes"
          enabled={true}
        />
        <SettingToggle
          label="Discrepancy Alerts"
          description="Notify when FO and HK status conflict"
          enabled={true}
        />
        <SettingToggle
          label="Break Reminders"
          description="Remind attendants to take scheduled breaks"
          enabled={false}
        />
        <SettingToggle
          label="Shift End Warnings"
          description="Alert 30 minutes before shift ends"
          enabled={true}
        />
        <SettingToggle
          label="Guest Request Notifications"
          description="Push notifications for MUR requests"
          enabled={true}
        />

        {/* Notification Channels */}
        <div className="mt-6">
          <h4 className="text-[12px] font-semibold text-gray-700 mb-3">
            Notification Channels
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-sm">
              <div className="flex items-center gap-3">
                <Smartphone size={18} className="text-gray-400" />
                <div>
                  <div className="text-[13px] font-medium">Mobile Push</div>
                  <div className="text-[11px] text-gray-500">
                    Push to mobile devices
                  </div>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-medium rounded">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-sm">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-400" />
                <div>
                  <div className="text-[13px] font-medium">Dashboard Alerts</div>
                  <div className="text-[11px] text-gray-500">
                    Show in-app notifications
                  </div>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-medium rounded">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Staff Settings
function StaffSettings() {
  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-[14px] font-semibold text-gray-900">
          Staff Configuration
        </h3>
        <p className="text-[12px] text-gray-500 mt-1">
          Configure staff roles and permissions
        </p>
      </div>
      <div className="p-4 space-y-6">
        {/* Roles */}
        <div>
          <h4 className="text-[12px] font-semibold text-gray-700 mb-3">
            Staff Roles
          </h4>
          <div className="space-y-3">
            <RoleCard
              role="Room Attendant"
              count={10}
              permissions={["View assignments", "Update room status", "Request assistance"]}
            />
            <RoleCard
              role="Floor Supervisor"
              count={2}
              permissions={[
                "All attendant permissions",
                "Reassign rooms",
                "Inspect rooms",
                "Approve breaks",
              ]}
            />
            <RoleCard
              role="Executive Housekeeper"
              count={1}
              permissions={[
                "All supervisor permissions",
                "Manage staff",
                "View reports",
                "Configure settings",
              ]}
            />
          </div>
        </div>

        {/* Workload Settings */}
        <div>
          <h4 className="text-[12px] font-semibold text-gray-700 mb-3">
            Workload Settings
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Max Rooms per Attendant
              </label>
              <input
                type="number"
                defaultValue="16"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Max Suites per Attendant
              </label>
              <input
                type="number"
                defaultValue="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Integration Settings
function IntegrationSettings() {
  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-[14px] font-semibold text-gray-900">
          OPERA PMS Integration
        </h3>
        <p className="text-[12px] text-gray-500 mt-1">
          Configure connection to Oracle OPERA Cloud
        </p>
      </div>
      <div className="p-4 space-y-6">
        {/* Connection Status */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-sm flex items-center justify-center">
              <Globe size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-medium text-blue-800">
                  OPERA Cloud Connection
                </div>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-medium rounded">
                  Demo Mode
                </span>
              </div>
              <div className="text-[11px] text-blue-600 mt-2">
                In production, this system connects to OPERA Cloud via OHIP APIs
                for real-time room status sync, checkout events, and guest data.
              </div>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div>
          <h4 className="text-[12px] font-semibold text-gray-700 mb-3">
            API Configuration
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                OPERA Cloud URL
              </label>
              <input
                type="text"
                placeholder="https://opera-cloud.example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px] bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Property ID
              </label>
              <input
                type="text"
                value="PARK_LANE"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px] bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                API Key
              </label>
              <input
                type="password"
                value="••••••••••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-[13px] bg-gray-50"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Sync Settings */}
        <div>
          <h4 className="text-[12px] font-semibold text-gray-700 mb-3">
            Data Sync Settings
          </h4>
          <div className="space-y-3">
            <SettingToggle
              label="Real-time Room Status"
              description="Sync room status changes instantly"
              enabled={true}
            />
            <SettingToggle
              label="Checkout Events"
              description="Receive checkout notifications from OPERA"
              enabled={true}
            />
            <SettingToggle
              label="Guest Preferences"
              description="Pull guest preferences from profile"
              enabled={true}
            />
            <SettingToggle
              label="VIP Codes"
              description="Sync VIP status from reservations"
              enabled={true}
            />
            <SettingToggle
              label="Write-back Status"
              description="Update OPERA when room status changes"
              enabled={false}
            />
          </div>
        </div>

        {/* Sync Status */}
        <div className="p-4 bg-gray-50 rounded-sm">
          <h4 className="text-[12px] font-semibold text-gray-700 mb-3">
            Last Sync Status
          </h4>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Room Status</span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle size={12} />
                Synced 2 min ago
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reservations</span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle size={12} />
                Synced 5 min ago
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Guest Profiles</span>
              <span className="flex items-center gap-1 text-amber-600">
                <AlertTriangle size={12} />
                Demo data
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Role Card Component
function RoleCard({
  role,
  count,
  permissions,
}: {
  role: string;
  count: number;
  permissions: string[];
}) {
  return (
    <div className="p-3 border border-gray-200 rounded-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-medium text-gray-900">{role}</div>
        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">
          {count} staff
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {permissions.map((perm) => (
          <span
            key={perm}
            className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded"
          >
            {perm}
          </span>
        ))}
      </div>
    </div>
  );
}

// Setting Toggle Component
function SettingToggle({
  label,
  description,
  enabled,
  priority,
  details,
}: {
  label: string;
  description: string;
  enabled: boolean;
  priority?: number;
  details?: string;
}) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  return (
    <div className="flex items-start justify-between p-3 border border-gray-200 rounded-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="text-[13px] font-medium text-gray-800">{label}</div>
          {priority && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-medium rounded">
              +{priority} pts
            </span>
          )}
        </div>
        <div className="text-[11px] text-gray-500 mt-0.5">{description}</div>
        {details && (
          <div className="flex items-start gap-1 mt-2 text-[10px] text-gray-400">
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            {details}
          </div>
        )}
      </div>
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
          isEnabled ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
            isEnabled ? "left-5" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
