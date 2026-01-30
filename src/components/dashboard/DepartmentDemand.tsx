"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ApproveModal from "./ApproveModal";

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

const departments: Department[] = [
  {
    name: "Housekeeping",
    scheduled: 24,
    recommended: 22,
    demandLevel: 65,
    demandStatus: "normal",
    action: { type: "reduce", count: 2 },
    details: {
      peakHours: "9:00 AM - 2:00 PM",
      keyInsights: [
        "45 early checkouts (before 9am)",
        "28 late checkouts (after 2pm)",
        "15 DND patterns expected",
      ],
    },
  },
  {
    name: "Food & Beverage",
    scheduled: 18,
    recommended: 21,
    demandLevel: 92,
    demandStatus: "high",
    action: { type: "add", count: 3 },
    details: {
      peakHours: "7:00 PM - 10:00 PM",
      keyInsights: [
        "180 high F&B users (56%)",
        "120 restaurant reservations",
        "85 room service orders predicted",
      ],
    },
  },
  {
    name: "Front Office",
    scheduled: 8,
    recommended: 8,
    demandLevel: 70,
    demandStatus: "normal",
    action: { type: "standard" },
    details: {
      peakHours: "2:00 PM - 6:00 PM",
      keyInsights: [
        "142 arrivals expected",
        "38 VIP check-ins requiring GM presence",
        "Peak arrival window: 3-5pm",
      ],
    },
  },
  {
    name: "Spa & Recreation",
    scheduled: 6,
    recommended: 7,
    demandLevel: 78,
    demandStatus: "medium",
    action: { type: "add", count: 1 },
    details: {
      peakHours: "10:00 AM - 4:00 PM",
      keyInsights: [
        "95 guests with spa history (30%)",
        "40 pre-booked appointments",
        "15-20 walk-ins expected",
      ],
    },
  },
  {
    name: "Concierge",
    scheduled: 4,
    recommended: 4,
    demandLevel: 55,
    demandStatus: "normal",
    action: { type: "standard" },
    details: {
      peakHours: "10:00 AM - 8:00 PM",
      keyInsights: [
        "25 high-touch guests",
        "35 theater/restaurant requests likely",
        "18 transport arrangements",
      ],
    },
  },
];

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

export default function DepartmentDemand() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
