"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight, Clock, PoundSterling, AlertTriangle, Users } from "lucide-react";
import ShiftTimeline, { Shift } from "./ShiftTimeline";

interface DaySchedule {
  dayName: string;
  date: number;
  month: string;
  staffCount: number;
  variance: number;
  isToday?: boolean;
  occupancy: number;
  departments: {
    housekeeping: number;
    fnb: number;
    frontOffice: number;
    spa: number;
    concierge: number;
  };
  metrics: {
    scheduledHours: number;
    budgetHours: number;
    laborCost: number;
    budgetCost: number;
    overtimeHours: number;
    maxOvertime: number;
    openShifts: number;
  };
  coverageByHour: {
    hour: number;
    required: number;
    scheduled: number;
  }[];
  shifts: Shift[];
}

const weekData: DaySchedule[] = [
  {
    dayName: "Thu",
    date: 13,
    month: "Feb",
    staffCount: 58,
    variance: -1800,
    occupancy: 72,
    departments: { housekeeping: 20, fnb: 16, frontOffice: 8, spa: 6, concierge: 4 },
    metrics: { scheduledHours: 464, budgetHours: 500, laborCost: 6960, budgetCost: 7500, overtimeHours: 4, maxOvertime: 10, openShifts: 1 },
    coverageByHour: generateCoverage(58, 72),
    shifts: generateShifts("Thu"),
  },
  {
    dayName: "Fri",
    date: 14,
    month: "Feb",
    staffCount: 62,
    variance: -2100,
    occupancy: 78,
    departments: { housekeeping: 22, fnb: 18, frontOffice: 8, spa: 6, concierge: 4 },
    metrics: { scheduledHours: 496, budgetHours: 520, laborCost: 7440, budgetCost: 7800, overtimeHours: 6, maxOvertime: 10, openShifts: 0 },
    coverageByHour: generateCoverage(62, 78),
    shifts: generateShifts("Fri"),
  },
  {
    dayName: "Sat",
    date: 15,
    month: "Feb",
    staffCount: 60,
    variance: -2400,
    isToday: true,
    occupancy: 85,
    departments: { housekeeping: 22, fnb: 21, frontOffice: 8, spa: 7, concierge: 4 },
    metrics: { scheduledHours: 480, budgetHours: 520, laborCost: 7200, budgetCost: 7800, overtimeHours: 3, maxOvertime: 10, openShifts: 2 },
    coverageByHour: generateCoverage(60, 85),
    shifts: generateShifts("Sat"),
  },
  {
    dayName: "Sun",
    date: 16,
    month: "Feb",
    staffCount: 52,
    variance: -1500,
    occupancy: 80,
    departments: { housekeeping: 18, fnb: 16, frontOffice: 6, spa: 6, concierge: 4 },
    metrics: { scheduledHours: 416, budgetHours: 450, laborCost: 6240, budgetCost: 6750, overtimeHours: 2, maxOvertime: 10, openShifts: 1 },
    coverageByHour: generateCoverage(52, 80),
    shifts: generateShifts("Sun"),
  },
  {
    dayName: "Mon",
    date: 17,
    month: "Feb",
    staffCount: 48,
    variance: -900,
    occupancy: 65,
    departments: { housekeeping: 18, fnb: 14, frontOffice: 6, spa: 5, concierge: 3 },
    metrics: { scheduledHours: 384, budgetHours: 400, laborCost: 5760, budgetCost: 6000, overtimeHours: 1, maxOvertime: 10, openShifts: 0 },
    coverageByHour: generateCoverage(48, 65),
    shifts: generateShifts("Mon"),
  },
  {
    dayName: "Tue",
    date: 18,
    month: "Feb",
    staffCount: 46,
    variance: -750,
    occupancy: 62,
    departments: { housekeeping: 16, fnb: 14, frontOffice: 6, spa: 5, concierge: 3 },
    metrics: { scheduledHours: 368, budgetHours: 380, laborCost: 5520, budgetCost: 5700, overtimeHours: 0, maxOvertime: 10, openShifts: 0 },
    coverageByHour: generateCoverage(46, 62),
    shifts: generateShifts("Tue"),
  },
  {
    dayName: "Wed",
    date: 19,
    month: "Feb",
    staffCount: 50,
    variance: -1200,
    occupancy: 68,
    departments: { housekeeping: 18, fnb: 15, frontOffice: 6, spa: 5, concierge: 4 },
    metrics: { scheduledHours: 400, budgetHours: 420, laborCost: 6000, budgetCost: 6300, overtimeHours: 2, maxOvertime: 10, openShifts: 1 },
    coverageByHour: generateCoverage(50, 68),
    shifts: generateShifts("Wed"),
  },
];

function generateCoverage(staffCount: number, occupancy: number) {
  const baseRequired = Math.round(staffCount * (occupancy / 100) * 1.1);
  return Array.from({ length: 19 }, (_, i) => {
    const hour = i + 6;
    // Peak hours: 8-10am (breakfast), 2-4pm (check-in), 7-9pm (dinner)
    let multiplier = 0.5;
    if (hour >= 8 && hour <= 10) multiplier = 0.9;
    else if (hour >= 14 && hour <= 16) multiplier = 1.0;
    else if (hour >= 19 && hour <= 21) multiplier = 0.95;
    else if (hour >= 11 && hour <= 13) multiplier = 0.7;
    else if (hour >= 17 && hour <= 18) multiplier = 0.8;
    else if (hour >= 22) multiplier = 0.4;

    const required = Math.round(baseRequired * multiplier);
    const variance = Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0;
    return { hour, required, scheduled: required + variance };
  });
}

function generateShifts(day: string): Shift[] {
  const baseShifts: Shift[] = [
    // Front Office
    { id: `${day}-1`, employeeName: "Sarah Mitchell", employeeInitials: "SM", role: "Front Desk Agent", department: "frontOffice", startHour: 7, endHour: 15, breakStartHour: 11, breakEndHour: 11.5, status: "confirmed" },
    { id: `${day}-2`, employeeName: "James Liu", employeeInitials: "JL", role: "Concierge", department: "frontOffice", startHour: 15, endHour: 23, breakStartHour: 19, breakEndHour: 19.5, status: "confirmed" },
    { id: `${day}-3`, employeeName: "Emma Watson", employeeInitials: "EW", role: "Guest Relations", department: "frontOffice", startHour: 9, endHour: 17, status: "confirmed" },
    { id: `${day}-4`, employeeName: "", employeeInitials: "", role: "Night Auditor", department: "frontOffice", startHour: 23, endHour: 7, isOpen: true, status: "open" },

    // Housekeeping
    { id: `${day}-5`, employeeName: "Maria Garcia", employeeInitials: "MG", role: "Room Attendant", department: "housekeeping", startHour: 8, endHour: 16, status: "confirmed" },
    { id: `${day}-6`, employeeName: "Ana Petrova", employeeInitials: "AP", role: "Room Attendant", department: "housekeeping", startHour: 8, endHour: 16, status: "confirmed" },
    { id: `${day}-7`, employeeName: "John Smith", employeeInitials: "JS", role: "Housekeeping Supervisor", department: "housekeeping", startHour: 7, endHour: 15, status: "confirmed" },
    { id: `${day}-8`, employeeName: "Lisa Chen", employeeInitials: "LC", role: "Laundry Attendant", department: "housekeeping", startHour: 6, endHour: 14, status: "confirmed" },
    { id: `${day}-9`, employeeName: "Robert Johnson", employeeInitials: "RJ", role: "Houseman", department: "housekeeping", startHour: 14, endHour: 22, status: "pending" },

    // F&B
    { id: `${day}-10`, employeeName: "Michael Brown", employeeInitials: "MB", role: "Server", department: "fnb", startHour: 6, endHour: 14, status: "confirmed" },
    { id: `${day}-11`, employeeName: "Sophie Taylor", employeeInitials: "ST", role: "Server", department: "fnb", startHour: 17, endHour: 23, status: "confirmed" },
    { id: `${day}-12`, employeeName: "David Kim", employeeInitials: "DK", role: "Bartender", department: "fnb", startHour: 16, endHour: 24, status: "confirmed" },
    { id: `${day}-13`, employeeName: "Rachel Green", employeeInitials: "RG", role: "Host", department: "fnb", startHour: 11, endHour: 19, status: "confirmed" },
    { id: `${day}-14`, employeeName: "Tom Wilson", employeeInitials: "TW", role: "Room Service", department: "fnb", startHour: 6, endHour: 14, status: "confirmed" },
    { id: `${day}-15`, employeeName: "", employeeInitials: "", role: "Server (Evening)", department: "fnb", startHour: 18, endHour: 23, isOpen: day === "Sat", status: day === "Sat" ? "open" : "confirmed" },

    // Spa
    { id: `${day}-16`, employeeName: "Jennifer Adams", employeeInitials: "JA", role: "Massage Therapist", department: "spa", startHour: 9, endHour: 17, status: "confirmed" },
    { id: `${day}-17`, employeeName: "Nicole Park", employeeInitials: "NP", role: "Esthetician", department: "spa", startHour: 10, endHour: 18, status: "confirmed" },
    { id: `${day}-18`, employeeName: "Amanda Lee", employeeInitials: "AL", role: "Spa Receptionist", department: "spa", startHour: 8, endHour: 16, status: "confirmed" },

    // Concierge
    { id: `${day}-19`, employeeName: "William Davis", employeeInitials: "WD", role: "Head Concierge", department: "concierge", startHour: 8, endHour: 16, status: "confirmed" },
    { id: `${day}-20`, employeeName: "Oliver Martinez", employeeInitials: "OM", role: "Bellhop", department: "concierge", startHour: 7, endHour: 15, status: "confirmed" },
    { id: `${day}-21`, employeeName: "Henry Thompson", employeeInitials: "HT", role: "Valet", department: "concierge", startHour: 14, endHour: 22, status: "confirmed" },
  ];

  return baseShifts;
}

const tabs = ["All Departments", "Housekeeping", "F&B", "Front Office", "Spa"];

export default function WeeklySchedule() {
  const [activeTab, setActiveTab] = useState("All Departments");
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(
    weekData.find((d) => d.isToday) || null
  );
  const [showDetailView, setShowDetailView] = useState(true);

  const maxCoverage = selectedDay
    ? Math.max(...selectedDay.coverageByHour.map((c) => Math.max(c.required, c.scheduled)))
    : 0;

  return (
    <Card className="col-span-full">
      <CardHeader title="7-Day Schedule Overview" action="Manage Schedule" />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-4 text-[15px] border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-black text-black font-semibold"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <CardBody>
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button className="flex items-center gap-1 text-[14px] text-gray-600 hover:text-black">
            <ChevronLeft size={18} />
            Previous Week
          </button>
          <span className="text-[16px] font-semibold">February 13 - 19, 2026</span>
          <button className="flex items-center gap-1 text-[14px] text-gray-600 hover:text-black">
            Next Week
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-sm overflow-hidden">
          {weekData.map((day) => (
            <button
              key={day.date}
              onClick={() => setSelectedDay(day)}
              className={`p-5 text-center transition-colors ${
                day.isToday
                  ? "bg-amber-50"
                  : selectedDay?.date === day.date
                  ? "bg-gray-100"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                {day.dayName}
              </div>
              <div
                className={`font-display text-[24px] mb-2 ${
                  day.isToday ? "text-black font-medium" : "text-black"
                }`}
              >
                {day.date}
              </div>
              <div className="text-[13px] text-gray-600 mb-1">
                {day.staffCount} staff
              </div>
              <div
                className={`text-[12px] font-semibold ${
                  day.variance < 0 ? "text-[#2E7D32]" : "text-[#C62828]"
                }`}
              >
                {day.variance < 0 ? "" : "+"}£{Math.abs(day.variance).toLocaleString()}
              </div>
              <div className="mt-2 text-[12px] text-gray-400">
                {day.occupancy}% occ
              </div>
            </button>
          ))}
        </div>

        {/* Selected Day Details */}
        {selectedDay && (
          <div className="mt-6 p-5 bg-gray-50 rounded-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[16px] font-semibold text-black">
                  {selectedDay.dayName}, {selectedDay.month} {selectedDay.date}
                </span>
                {selectedDay.isToday && (
                  <span className="ml-2 rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold text-white">
                    TODAY
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-[15px]">
                  <span className="text-gray-600">Occupancy: </span>
                  <span className="font-semibold text-black">{selectedDay.occupancy}%</span>
                </div>
                <button
                  onClick={() => setShowDetailView(!showDetailView)}
                  className="text-[13px] text-gray-600 hover:text-black underline"
                >
                  {showDetailView ? "Simple View" : "Detailed View"}
                </button>
              </div>
            </div>

            {!showDetailView ? (
              /* Simple department count view */
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(selectedDay.departments).map(([dept, count]) => {
                  const labels: Record<string, string> = {
                    housekeeping: "Housekeeping",
                    fnb: "F&B",
                    frontOffice: "Front Office",
                    spa: "Spa",
                    concierge: "Concierge",
                  };
                  return (
                    <div key={dept} className="text-center p-4 bg-white rounded-sm border border-gray-200">
                      <div className="text-[13px] text-gray-500 mb-1">{labels[dept]}</div>
                      <div className="font-display text-[24px] text-black">{count}</div>
                      <div className="text-[12px] text-gray-400">staff</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Detailed view with metrics, coverage, and shifts */
              <>
                {/* Labor Metrics */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <Clock size={16} />
                      <span className="text-[12px] uppercase tracking-wider">Scheduled Hours</span>
                    </div>
                    <div className="font-display text-[24px] text-black">
                      {selectedDay.metrics.scheduledHours}
                      <span className="text-[14px] text-gray-400 font-normal">
                        {" "}/ {selectedDay.metrics.budgetHours}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2E7D32] rounded-full"
                        style={{ width: `${(selectedDay.metrics.scheduledHours / selectedDay.metrics.budgetHours) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <PoundSterling size={16} />
                      <span className="text-[12px] uppercase tracking-wider">Labor Cost</span>
                    </div>
                    <div className="font-display text-[24px] text-black">
                      £{selectedDay.metrics.laborCost.toLocaleString()}
                      <span className="text-[14px] text-gray-400 font-normal">
                        {" "}/ £{selectedDay.metrics.budgetCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2E7D32] rounded-full"
                        style={{ width: `${(selectedDay.metrics.laborCost / selectedDay.metrics.budgetCost) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <AlertTriangle size={16} />
                      <span className="text-[12px] uppercase tracking-wider">Overtime</span>
                    </div>
                    <div className={`font-display text-[24px] ${selectedDay.metrics.overtimeHours > selectedDay.metrics.maxOvertime * 0.8 ? "text-[#ED6C02]" : "text-black"}`}>
                      {selectedDay.metrics.overtimeHours}h
                      <span className="text-[14px] text-gray-400 font-normal">
                        {" "}/ {selectedDay.metrics.maxOvertime}h max
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${selectedDay.metrics.overtimeHours > selectedDay.metrics.maxOvertime * 0.8 ? "bg-[#ED6C02]" : "bg-[#2E7D32]"}`}
                        style={{ width: `${(selectedDay.metrics.overtimeHours / selectedDay.metrics.maxOvertime) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <Users size={16} />
                      <span className="text-[12px] uppercase tracking-wider">Open Shifts</span>
                    </div>
                    <div className={`font-display text-[24px] ${selectedDay.metrics.openShifts > 0 ? "text-[#C62828]" : "text-[#2E7D32]"}`}>
                      {selectedDay.metrics.openShifts}
                      <span className="text-[14px] text-gray-400 font-normal"> unfilled</span>
                    </div>
                    {selectedDay.metrics.openShifts > 0 && (
                      <button className="mt-2 text-[12px] text-[#C62828] hover:underline">
                        View & Fill →
                      </button>
                    )}
                  </div>
                </div>

                {/* Coverage Graph */}
                <div className="bg-white rounded-sm border border-gray-200 p-4 mb-4">
                  <div className="text-[14px] font-semibold text-black mb-3">Hourly Coverage</div>
                  <div className="flex items-end gap-1 h-20">
                    {selectedDay.coverageByHour.map((c) => {
                      const requiredHeight = (c.required / maxCoverage) * 100;
                      const scheduledHeight = (c.scheduled / maxCoverage) * 100;
                      const isUnder = c.scheduled < c.required;
                      const isOver = c.scheduled > c.required;

                      return (
                        <div key={c.hour} className="flex-1 flex flex-col items-center gap-0.5">
                          <div className="w-full flex items-end justify-center gap-px" style={{ height: "60px" }}>
                            {/* Required bar (outline) */}
                            <div
                              className="w-2 border border-gray-300 rounded-t-sm bg-transparent"
                              style={{ height: `${requiredHeight}%` }}
                            />
                            {/* Scheduled bar */}
                            <div
                              className={`w-2 rounded-t-sm ${
                                isUnder ? "bg-[#ED6C02]" : isOver ? "bg-[#C62828]" : "bg-[#2E7D32]"
                              }`}
                              style={{ height: `${scheduledHeight}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-gray-400">
                            {c.hour % 3 === 0 ? `${c.hour > 12 ? c.hour - 12 : c.hour}${c.hour >= 12 ? "p" : "a"}` : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-3 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 border border-gray-300 rounded-sm" />
                      <span className="text-gray-500">Required</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#2E7D32] rounded-sm" />
                      <span className="text-gray-500">Correct</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#ED6C02] rounded-sm" />
                      <span className="text-gray-500">Under</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#C62828] rounded-sm" />
                      <span className="text-gray-500">Over</span>
                    </div>
                  </div>
                </div>

                {/* Shift Timeline */}
                <div className="bg-white rounded-sm border border-gray-200 p-4">
                  <ShiftTimeline shifts={selectedDay.shifts} department={activeTab} />
                </div>
              </>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
