"use client";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";

interface HourlyData {
  hour: string;
  scheduled: number;
  required: number;
  guestDemand: number;
}

// Mock data for hourly staffing (6am - 10pm)
const hourlyData: HourlyData[] = [
  { hour: "6am", scheduled: 8, required: 6, guestDemand: 15 },
  { hour: "7am", scheduled: 12, required: 14, guestDemand: 30 },
  { hour: "8am", scheduled: 18, required: 18, guestDemand: 45 },
  { hour: "9am", scheduled: 22, required: 22, guestDemand: 55 },
  { hour: "10am", scheduled: 24, required: 26, guestDemand: 65 },
  { hour: "11am", scheduled: 26, required: 26, guestDemand: 70 },
  { hour: "12pm", scheduled: 28, required: 28, guestDemand: 80 },
  { hour: "1pm", scheduled: 26, required: 28, guestDemand: 75 },
  { hour: "2pm", scheduled: 24, required: 24, guestDemand: 70 },
  { hour: "3pm", scheduled: 26, required: 28, guestDemand: 85 },
  { hour: "4pm", scheduled: 28, required: 26, guestDemand: 90 },
  { hour: "5pm", scheduled: 30, required: 28, guestDemand: 95 },
  { hour: "6pm", scheduled: 28, required: 30, guestDemand: 100 },
  { hour: "7pm", scheduled: 26, required: 28, guestDemand: 95 },
  { hour: "8pm", scheduled: 24, required: 24, guestDemand: 85 },
  { hour: "9pm", scheduled: 18, required: 18, guestDemand: 60 },
  { hour: "10pm", scheduled: 12, required: 10, guestDemand: 35 },
];

const maxStaff = Math.max(...hourlyData.map((d) => Math.max(d.scheduled, d.required)));
const chartHeight = 200;

function getStatus(scheduled: number, required: number): "over" | "under" | "correct" {
  const tolerance = 1;
  if (scheduled > required + tolerance) return "over";
  if (scheduled < required - tolerance) return "under";
  return "correct";
}

function getStatusColor(status: "over" | "under" | "correct"): string {
  switch (status) {
    case "over":
      return "#C62828";
    case "under":
      return "#ED6C02";
    case "correct":
      return "#2E7D32";
  }
}

export default function DeploymentChart() {
  // Calculate totals
  const totalScheduled = hourlyData.reduce((sum, d) => sum + d.scheduled, 0);
  const totalRequired = hourlyData.reduce((sum, d) => sum + d.required, 0);

  const overHours = hourlyData.filter((d) => getStatus(d.scheduled, d.required) === "over").length;
  const underHours = hourlyData.filter((d) => getStatus(d.scheduled, d.required) === "under").length;
  const correctHours = hourlyData.filter((d) => getStatus(d.scheduled, d.required) === "correct").length;

  return (
    <Card>
      <CardHeader title="Deployment Chart" action="Today" />
      <CardBody>
        <div className="flex gap-6">
          {/* Chart Area */}
          <div className="flex-1">
            {/* Y-axis labels and chart */}
            <div className="flex">
              {/* Y-axis */}
              <div className="flex flex-col justify-between pr-3 text-right" style={{ height: chartHeight }}>
                <span className="text-[11px] text-gray-500">{maxStaff}</span>
                <span className="text-[11px] text-gray-500">{Math.round(maxStaff * 0.75)}</span>
                <span className="text-[11px] text-gray-500">{Math.round(maxStaff * 0.5)}</span>
                <span className="text-[11px] text-gray-500">{Math.round(maxStaff * 0.25)}</span>
                <span className="text-[11px] text-gray-500">0</span>
              </div>

              {/* Chart */}
              <div className="flex-1 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-gray-100 w-full" />
                  ))}
                </div>

                {/* Bars Container */}
                <div className="relative flex items-end justify-between gap-1" style={{ height: chartHeight }}>
                  {hourlyData.map((data, index) => {
                    const status = getStatus(data.scheduled, data.required);
                    const barHeight = (data.scheduled / maxStaff) * chartHeight;
                    const demandY = chartHeight - (data.guestDemand / 100) * chartHeight;

                    return (
                      <div key={data.hour} className="flex-1 relative group">
                        {/* Bar */}
                        <div
                          className="w-full rounded-t-sm transition-all hover:opacity-80"
                          style={{
                            height: barHeight,
                            backgroundColor: getStatusColor(status),
                          }}
                        />

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                          <div className="bg-gray-900 text-white text-[11px] rounded px-2 py-1 whitespace-nowrap">
                            <div>Scheduled: {data.scheduled}</div>
                            <div>Required: {data.required}</div>
                            <div>Demand: {data.guestDemand}%</div>
                          </div>
                        </div>

                        {/* Guest demand dot (positioned for the line) */}
                        {index < hourlyData.length && (
                          <div
                            className="absolute w-2 h-2 bg-black rounded-full left-1/2 -translate-x-1/2"
                            style={{ bottom: chartHeight - demandY - 4 }}
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Guest Demand Line (SVG overlay) */}
                  <svg
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: "100%", height: chartHeight }}
                    preserveAspectRatio="none"
                  >
                    <polyline
                      fill="none"
                      stroke="#000"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      points={hourlyData
                        .map((data, i) => {
                          const x = (i / (hourlyData.length - 1)) * 100;
                          const y = 100 - data.guestDemand;
                          return `${x}%,${y}%`;
                        })
                        .join(" ")}
                    />
                  </svg>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2">
                  {hourlyData.map((data, i) => (
                    <div
                      key={data.hour}
                      className={`text-[10px] text-gray-500 text-center flex-1 ${
                        i % 2 === 0 ? "" : "hidden sm:block"
                      }`}
                    >
                      {data.hour}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#2E7D32" }} />
                <span className="text-[12px] text-gray-600">Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#ED6C02" }} />
                <span className="text-[12px] text-gray-600">Under</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#C62828" }} />
                <span className="text-[12px] text-gray-600">Over</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 border-t-2 border-dashed border-black" />
                <span className="text-[12px] text-gray-600">Guest Demand</span>
              </div>
            </div>
          </div>

          {/* Totals Panel */}
          <div className="w-40 border-l border-gray-200 pl-6">
            <div className="mb-6">
              <div className="text-[12px] text-gray-500 uppercase tracking-wider mb-1">Totals</div>
              <div className="font-display text-[28px] text-black">
                {totalScheduled}/{totalRequired}
              </div>
              <div className="text-[12px] text-gray-500">Scheduled / Required</div>
            </div>

            <div className="mb-6">
              <div className="text-[12px] text-gray-500 uppercase tracking-wider mb-1">Savings</div>
              <div className="font-display text-[24px] text-[#2E7D32]">£2,400</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#C62828" }} />
                  <span className="text-[13px] text-gray-600">Over</span>
                </div>
                <span className="text-[13px] font-semibold">{overHours}h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ED6C02" }} />
                  <span className="text-[13px] text-gray-600">Under</span>
                </div>
                <span className="text-[13px] font-semibold">{underHours}h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#2E7D32" }} />
                  <span className="text-[13px] text-gray-600">Correct</span>
                </div>
                <span className="text-[13px] font-semibold">{correctHours}h</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
