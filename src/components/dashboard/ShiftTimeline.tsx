"use client";

import { User } from "lucide-react";

export interface Shift {
  id: string;
  employeeName: string;
  employeeInitials: string;
  role: string;
  department: "frontOffice" | "housekeeping" | "fnb" | "spa" | "concierge";
  startHour: number; // 0-23
  endHour: number;   // 0-23
  breakStartHour?: number;
  breakEndHour?: number;
  isOpen?: boolean;
  status: "confirmed" | "pending" | "open";
}

interface ShiftTimelineProps {
  shifts: Shift[];
  department?: string;
}

const departmentColors: Record<string, { bg: string; border: string; text: string }> = {
  frontOffice: { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-700" },
  housekeeping: { bg: "bg-green-100", border: "border-green-400", text: "text-green-700" },
  fnb: { bg: "bg-orange-100", border: "border-orange-400", text: "text-orange-700" },
  spa: { bg: "bg-purple-100", border: "border-purple-400", text: "text-purple-700" },
  concierge: { bg: "bg-slate-100", border: "border-slate-400", text: "text-slate-700" },
};

const departmentLabels: Record<string, string> = {
  frontOffice: "Front Office",
  housekeeping: "Housekeeping",
  fnb: "F&B",
  spa: "Spa",
  concierge: "Concierge",
};

// Time grid from 6am to midnight (18 hours)
const hours = Array.from({ length: 19 }, (_, i) => i + 6); // 6 to 24

function formatHour(hour: number): string {
  if (hour === 0 || hour === 24) return "12am";
  if (hour === 12) return "12pm";
  if (hour < 12) return `${hour}am`;
  return `${hour - 12}pm`;
}

function getShiftPosition(startHour: number, endHour: number) {
  const gridStart = 6; // 6am
  const gridEnd = 24;  // midnight
  const totalHours = gridEnd - gridStart;

  // Handle overnight shifts
  const adjustedEnd = endHour < startHour ? 24 : endHour;

  const left = ((startHour - gridStart) / totalHours) * 100;
  const width = ((adjustedEnd - startHour) / totalHours) * 100;

  return { left: `${Math.max(0, left)}%`, width: `${Math.min(100 - left, width)}%` };
}

export default function ShiftTimeline({ shifts, department }: ShiftTimelineProps) {
  const filteredShifts = department && department !== "All Departments"
    ? shifts.filter(s => departmentLabels[s.department] === department)
    : shifts;

  return (
    <div className="mt-6">
      <div className="text-[14px] font-semibold text-black mb-3">Shift Schedule</div>

      {/* Time header */}
      <div className="flex border-b border-gray-200 mb-2">
        <div className="w-44 flex-shrink-0" /> {/* Employee column spacer */}
        <div className="flex-1 flex">
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex-1 text-[10px] text-gray-400 text-center"
            >
              {hour % 2 === 0 ? formatHour(hour) : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Shifts */}
      <div className="space-y-2">
        {filteredShifts.map((shift) => {
          const colors = departmentColors[shift.department];
          const position = getShiftPosition(shift.startHour, shift.endHour);

          return (
            <div key={shift.id} className="flex items-center">
              {/* Employee info */}
              <div className="w-44 flex-shrink-0 flex items-center gap-3 pr-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                    shift.isOpen
                      ? "bg-gray-200 text-gray-500 border-2 border-dashed border-gray-400"
                      : `${colors.bg} ${colors.text}`
                  }`}
                >
                  {shift.isOpen ? <User size={14} /> : shift.employeeInitials}
                </div>
                <div className="min-w-0">
                  <div className={`text-[13px] font-medium truncate ${shift.isOpen ? "text-gray-500" : "text-black"}`}>
                    {shift.isOpen ? "Open Shift" : shift.employeeName}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">{shift.role}</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex-1 relative h-10">
                {/* Grid lines */}
                <div className="absolute inset-0 flex">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="flex-1 border-l border-gray-100 first:border-l-0"
                    />
                  ))}
                </div>

                {/* Shift bar */}
                <div
                  className={`absolute top-1 bottom-1 rounded-sm flex items-center px-2 transition-all ${
                    shift.isOpen
                      ? "bg-gray-100 border-2 border-dashed border-gray-400"
                      : `${colors.bg} border ${colors.border}`
                  }`}
                  style={{ left: position.left, width: position.width }}
                >
                  <span className={`text-[11px] font-medium truncate ${shift.isOpen ? "text-gray-500" : colors.text}`}>
                    {formatHour(shift.startHour)} - {formatHour(shift.endHour === 24 ? 0 : shift.endHour)}
                  </span>
                  {shift.status === "pending" && (
                    <span className="ml-2 text-[9px] bg-amber-200 text-amber-700 px-1.5 py-0.5 rounded">
                      Pending
                    </span>
                  )}
                  {shift.isOpen && (
                    <span className="ml-auto text-[10px] text-red-600 font-semibold">
                      Unfilled
                    </span>
                  )}
                </div>

                {/* Break indicator (if exists) */}
                {shift.breakStartHour && shift.breakEndHour && (
                  <div
                    className="absolute top-1 bottom-1 bg-white/60"
                    style={{
                      left: getShiftPosition(shift.breakStartHour, shift.breakEndHour).left,
                      width: getShiftPosition(shift.breakStartHour, shift.breakEndHour).width,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}

        {filteredShifts.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-[14px]">
            No shifts scheduled for this department
          </div>
        )}
      </div>
    </div>
  );
}
