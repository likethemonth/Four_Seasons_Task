"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  },
  {
    dayName: "Fri",
    date: 14,
    month: "Feb",
    staffCount: 62,
    variance: -2100,
    occupancy: 78,
    departments: { housekeeping: 22, fnb: 18, frontOffice: 8, spa: 6, concierge: 4 },
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
  },
  {
    dayName: "Sun",
    date: 16,
    month: "Feb",
    staffCount: 52,
    variance: -1500,
    occupancy: 80,
    departments: { housekeeping: 18, fnb: 16, frontOffice: 6, spa: 6, concierge: 4 },
  },
  {
    dayName: "Mon",
    date: 17,
    month: "Feb",
    staffCount: 48,
    variance: -900,
    occupancy: 65,
    departments: { housekeeping: 18, fnb: 14, frontOffice: 6, spa: 5, concierge: 3 },
  },
  {
    dayName: "Tue",
    date: 18,
    month: "Feb",
    staffCount: 46,
    variance: -750,
    occupancy: 62,
    departments: { housekeeping: 16, fnb: 14, frontOffice: 6, spa: 5, concierge: 3 },
  },
  {
    dayName: "Wed",
    date: 19,
    month: "Feb",
    staffCount: 50,
    variance: -1200,
    occupancy: 68,
    departments: { housekeeping: 18, fnb: 15, frontOffice: 6, spa: 5, concierge: 4 },
  },
];

const tabs = ["All Departments", "Housekeeping", "F&B", "Front Office", "Spa"];

export default function WeeklySchedule() {
  const [activeTab, setActiveTab] = useState("All Departments");
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(
    weekData.find((d) => d.isToday) || null
  );

  return (
    <Card className="col-span-full">
      <CardHeader title="7-Day Schedule Overview" action="Manage Schedule" />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-4 text-[13px] border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-[#B8860B] text-black font-medium"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <CardBody>
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center gap-1 text-[13px] text-gray-600 hover:text-black">
            <ChevronLeft size={16} />
            Previous Week
          </button>
          <span className="text-[14px] font-medium">February 13 - 19, 2026</span>
          <button className="flex items-center gap-1 text-[13px] text-gray-600 hover:text-black">
            Next Week
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-sm overflow-hidden">
          {weekData.map((day) => (
            <button
              key={day.date}
              onClick={() => setSelectedDay(day)}
              className={`p-4 text-center transition-colors ${
                day.isToday
                  ? "bg-amber-50"
                  : selectedDay?.date === day.date
                  ? "bg-gray-100"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="text-[10px] font-medium uppercase tracking-wider text-gray-500 mb-1">
                {day.dayName}
              </div>
              <div
                className={`font-display text-[20px] mb-2 ${
                  day.isToday ? "text-[#B8860B] font-medium" : "text-black"
                }`}
              >
                {day.date}
              </div>
              <div className="text-[11px] text-gray-600 mb-1">
                {day.staffCount} staff
              </div>
              <div
                className={`text-[10px] font-medium ${
                  day.variance < 0 ? "text-[#2E7D32]" : "text-[#C62828]"
                }`}
              >
                {day.variance < 0 ? "" : "+"}£{Math.abs(day.variance).toLocaleString()}
              </div>
              <div className="mt-2 text-[10px] text-gray-400">
                {day.occupancy}% occ
              </div>
            </button>
          ))}
        </div>

        {/* Selected Day Details */}
        {selectedDay && (
          <div className="mt-6 p-4 bg-gray-50 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-medium text-black">
                  {selectedDay.dayName}, {selectedDay.month} {selectedDay.date}
                </span>
                {selectedDay.isToday && (
                  <span className="ml-2 rounded-full bg-[#B8860B] px-2 py-0.5 text-[10px] font-medium text-black">
                    TODAY
                  </span>
                )}
              </div>
              <div className="text-[13px]">
                <span className="text-gray-600">Occupancy: </span>
                <span className="font-medium text-black">{selectedDay.occupancy}%</span>
              </div>
            </div>

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
                  <div key={dept} className="text-center p-3 bg-white rounded-sm border border-gray-200">
                    <div className="text-[11px] text-gray-500 mb-1">{labels[dept]}</div>
                    <div className="font-display text-[20px] text-black">{count}</div>
                    <div className="text-[10px] text-gray-400">staff</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
