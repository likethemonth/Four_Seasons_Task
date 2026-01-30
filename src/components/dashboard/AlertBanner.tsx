"use client";

import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

interface Alert {
  id: string;
  type: "warning" | "info" | "error";
  title: string;
  message: string;
  action?: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "Staffing Alert",
    message: "High F&B demand predicted for Saturday evening. Current schedule may be understaffed by 2 servers.",
    action: "Review Recommendation",
  },
];

export default function AlertBanner() {
  const [visibleAlerts, setVisibleAlerts] = useState(alerts);

  const dismissAlert = (id: string) => {
    setVisibleAlerts(visibleAlerts.filter((alert) => alert.id !== id));
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center gap-4 rounded-sm border px-6 py-4 ${
            alert.type === "warning"
              ? "border-amber-300 bg-amber-50"
              : alert.type === "error"
              ? "border-red-300 bg-red-50"
              : "border-blue-300 bg-blue-50"
          }`}
        >
          <AlertCircle
            size={22}
            className={
              alert.type === "warning"
                ? "text-amber-600"
                : alert.type === "error"
                ? "text-red-600"
                : "text-blue-600"
            }
          />
          <span className="flex-1 text-[15px] text-gray-800">
            <strong>{alert.title}:</strong> {alert.message}
          </span>
          {alert.action && (
            <button className="text-[14px] font-semibold text-black hover:underline">
              {alert.action}
            </button>
          )}
          <button
            onClick={() => dismissAlert(alert.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
