"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ApproveModal from "./ApproveModal";

interface DepartmentDemandProps {
  selectedDate: Date;
}

interface Department {
  name: string;
  scheduled: number;
  recommended: number;
  demandLevel: number;
  demandStatus: "high" | "medium" | "normal";
  action: {
    type: "add" | "reduce" | "standard";
    count?: number;
  };
  details: {
    peakHours: string;
    keyInsights: string[];
  };
}

function generateDepartments(date: Date): Department[] {
  const dayOfWeek = date.getDay();
  const dateNum = date.getDate();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isFriday = dayOfWeek === 5;

  const baseMultiplier = isWeekend ? 1.2 : isFriday ? 1.1 : 1.0;

  return [
  {
    name: "Housekeeping",
    scheduled: Math.round(20 + dateNum % 5),
    recommended: Math.round((18 + dateNum % 4) * baseMultiplier),
    demandLevel: Math.round(55 + (isWeekend ? 15 : 0) + dateNum % 10),
    demandStatus: isWeekend ? "medium" : "normal",
    action: isWeekend ? { type: "add", count: 2 } : { type: "reduce", count: 2 },
    details: {
      peakHours: "9:00 AM - 2:00 PM",
      keyInsights: [
        `${35 + dateNum % 15} early checkouts (before 9am)`,
        `${20 + dateNum % 12} late checkouts (after 2pm)`,
        `${10 + dateNum % 8} DND patterns expected`,
      ],
    },
  },
  {
    name: "Food & Beverage",
    scheduled: Math.round(16 + dateNum % 4),
    recommended: Math.round((18 + (isWeekend ? 5 : 2)) * baseMultiplier),
    demandLevel: Math.round(70 + (isWeekend ? 22 : isFriday ? 15 : 5) + dateNum % 8),
    demandStatus: isWeekend || isFriday ? "high" : "medium",
    action: { type: "add", count: isWeekend ? 4 : isFriday ? 3 : 1 },
    details: {
      peakHours: "7:00 PM - 10:00 PM",
      keyInsights: [
        `${150 + dateNum * 3} high F&B users (${50 + dateNum % 10}%)`,
        `${100 + dateNum * 2} restaurant reservations`,
        `${70 + dateNum} room service orders predicted`,
      ],
    },
  },
  {
    name: "Front Office",
    scheduled: 8,
    recommended: Math.round(7 + (isWeekend ? 2 : 1)),
    demandLevel: Math.round(60 + (isWeekend ? 15 : 5) + dateNum % 10),
    demandStatus: "normal",
    action: { type: "standard" },
    details: {
      peakHours: "2:00 PM - 6:00 PM",
      keyInsights: [
        `${120 + dateNum * 2} arrivals expected`,
        `${30 + dateNum % 10} VIP check-ins requiring GM presence`,
        "Peak arrival window: 3-5pm",
      ],
    },
  },
  {
    name: "Spa & Recreation",
    scheduled: Math.round(5 + dateNum % 2),
    recommended: Math.round((6 + (isWeekend ? 2 : 1)) * baseMultiplier),
    demandLevel: Math.round(65 + (isWeekend ? 18 : 8) + dateNum % 10),
    demandStatus: isWeekend ? "high" : "medium",
    action: { type: "add", count: isWeekend ? 2 : 1 },
    details: {
      peakHours: "10:00 AM - 4:00 PM",
      keyInsights: [
        `${80 + dateNum} guests with spa history (${25 + dateNum % 8}%)`,
        `${35 + dateNum % 10} pre-booked appointments`,
        `${12 + dateNum % 8}-${18 + dateNum % 8} walk-ins expected`,
      ],
    },
  },
  {
    name: "Concierge",
    scheduled: 4,
    recommended: Math.round(4 + (isWeekend ? 1 : 0)),
    demandLevel: Math.round(45 + (isWeekend ? 15 : 5) + dateNum % 10),
    demandStatus: "normal",
    action: isWeekend ? { type: "add", count: 1 } : { type: "standard" },
    details: {
      peakHours: "10:00 AM - 8:00 PM",
      keyInsights: [
        `${20 + dateNum % 8} high-touch guests`,
        `${30 + dateNum % 10} theater/restaurant requests likely`,
        `${15 + dateNum % 5} transport arrangements`,
      ],
    },
  },
];
}

function DemandBar({ level, status }: { level: number; status: string }) {
  const colors = {
    high: "bg-[#C62828]",
    medium: "bg-[#ED6C02]",
    normal: "bg-[#2E7D32]",
  };

  return (
    <div className="w-28 h-2 rounded-full bg-gray-200 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${colors[status as keyof typeof colors]}`}
        style={{ width: `${level}%` }}
      />
    </div>
  );
}

function ActionBadge({ action }: { action: Department["action"] }) {
  const styles = {
    add: "bg-green-100 text-[#2E7D32]",
    reduce: "bg-orange-100 text-[#ED6C02]",
    standard: "bg-gray-100 text-gray-600",
  };

  const labels = {
    add: `+${action.count} Staff`,
    reduce: `-${action.count} Staff`,
    standard: "Standard",
  };

  return (
    <span className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${styles[action.type]}`}>
      {labels[action.type]}
    </span>
  );
}

export default function DepartmentDemand({ selectedDate }: DepartmentDemandProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const departments = generateDepartments(selectedDate);

  return (
    <Card>
      <CardHeader title="Department Demand Forecast" action="View Details" />
      <CardBody className="p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                Department
              </th>
              <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                Scheduled
              </th>
              <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                Recommended
              </th>
              <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                Demand Level
              </th>
              <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.name} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-6 py-5">
                  <div className="text-[15px] font-semibold text-black">{dept.name}</div>
                  <div className="mt-1 text-[13px] text-gray-500">
                    Peak: {dept.details.peakHours}
                  </div>
                </td>
                <td className="px-6 py-5 font-display text-[22px]">{dept.scheduled}</td>
                <td className="px-6 py-5 font-display text-[22px]">{dept.recommended}</td>
                <td className="px-6 py-5">
                  <DemandBar level={dept.demandLevel} status={dept.demandStatus} />
                  <div className="mt-1 text-[13px] text-gray-500">{dept.demandLevel}%</div>
                </td>
                <td className="px-6 py-5">
                  <ActionBadge action={dept.action} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter>
        <Button variant="secondary">Export to Fourth</Button>
        <Button variant="accent" onClick={() => setIsModalOpen(true)}>
          Approve Recommendations
        </Button>
      </CardFooter>

      <ApproveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Card>
  );
}
