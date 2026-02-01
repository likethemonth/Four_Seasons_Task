"use client";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { User, MapPin } from "lucide-react";

interface Housekeeper {
  id: string;
  name: string;
  currentFloor: number;
  assignedRooms: number;
  status: "available" | "busy" | "break";
}

interface StaffStatusProps {
  staff: Housekeeper[];
}

const statusColors = {
  available: "bg-green-100 text-green-700 border-green-200",
  busy: "bg-blue-100 text-blue-700 border-blue-200",
  break: "bg-gray-100 text-gray-500 border-gray-200",
};

const statusDot = {
  available: "bg-green-500",
  busy: "bg-blue-500",
  break: "bg-gray-400",
};

export default function StaffStatus({ staff }: StaffStatusProps) {
  // Group by status
  const available = staff.filter((s) => s.status === "available");
  const busy = staff.filter((s) => s.status === "busy");
  const onBreak = staff.filter((s) => s.status === "break");

  // Group by floor for better visualization
  const byFloor = staff.reduce((acc, hk) => {
    const floor = hk.currentFloor;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(hk);
    return acc;
  }, {} as Record<number, Housekeeper[]>);

  return (
    <Card>
      <CardHeader title="Housekeeping Staff" />
      <CardBody>
        {/* Summary badges */}
        <div className="flex gap-3 mb-4">
          <div className="flex items-center gap-1.5 rounded-sm bg-green-50 px-3 py-1.5 text-[13px]">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-green-700">{available.length} Available</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-sm bg-blue-50 px-3 py-1.5 text-[13px]">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-blue-700">{busy.length} Busy</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-sm bg-gray-50 px-3 py-1.5 text-[13px]">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            <span className="text-gray-500">{onBreak.length} On Break</span>
          </div>
        </div>

        {/* Staff by floor */}
        <div className="space-y-4">
          {Object.keys(byFloor)
            .sort((a, b) => Number(a) - Number(b))
            .map((floor) => (
              <div key={floor}>
                <div className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  <MapPin size={14} />
                  Floor {floor}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {byFloor[Number(floor)].map((hk) => (
                    <div
                      key={hk.id}
                      className={`rounded-sm border p-3 ${statusColors[hk.status]}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-gray-600">
                            {hk.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="text-[14px] font-medium">{hk.name}</div>
                            <div className="text-[12px] opacity-75">
                              {hk.assignedRooms > 0
                                ? `${hk.assignedRooms} room${hk.assignedRooms > 1 ? "s" : ""} assigned`
                                : hk.status === "break"
                                ? "On break"
                                : "Ready for assignment"}
                            </div>
                          </div>
                        </div>
                        <span className={`h-2.5 w-2.5 rounded-full ${statusDot[hk.status]}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </CardBody>
    </Card>
  );
}
