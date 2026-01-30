"use client";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { TrendingDown, Calendar, Target, Award } from "lucide-react";

interface CostLine {
  label: string;
  value: number;
  isSavings?: boolean;
}

interface CostProjectionProps {
  selectedDate: Date;
}

function generateCostData(date: Date) {
  const dateNum = date.getDate();
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const standardCost = 42000 + (isWeekend ? 5000 : 0) + (dateNum * 100);
  const optimizedCost = Math.round(standardCost * (0.94 + (dateNum % 3) * 0.005));
  const savings = standardCost - optimizedCost;

  const todayCosts: CostLine[] = [
    { label: "Standard Schedule", value: standardCost },
    { label: "Optimized Schedule", value: optimizedCost },
    { label: "Projected Savings", value: savings, isSavings: true },
  ];

  const weekSavings = savings * 7 + (dateNum % 5) * 500;
  const mtdSavings = savings * dateNum + (dateNum % 3) * 2000;
  const ytdSavings = mtdSavings * 12 + (dateNum % 4) * 10000;

  const periodSavings = [
    { period: "Today", amount: savings, percentage: Number(((savings / standardCost) * 100).toFixed(1)) },
    { period: "This Week", amount: weekSavings, percentage: 4.6 + (dateNum % 5) * 0.2 },
    { period: "MTD", amount: mtdSavings, percentage: 4.8 + (dateNum % 4) * 0.15 },
    { period: "YTD", amount: ytdSavings, percentage: 4.7 + (dateNum % 3) * 0.2 },
  ];

  const deptMultiplier = 1 + (dateNum % 5) * 0.05;
  const departmentSavings = [
    { dept: "Housekeeping", saved: Math.round(7500 * deptMultiplier), target: 10000 },
    { dept: "F&B", saved: Math.round(11000 * deptMultiplier), target: 15000 },
    { dept: "Front Office", saved: Math.round(2800 * deptMultiplier), target: 4000 },
    { dept: "Spa", saved: Math.round(4200 * deptMultiplier), target: 6000 },
    { dept: "Concierge", saved: Math.round(1800 * deptMultiplier), target: 3000 },
  ];

  const annualProjection = (ytdSavings / dateNum) * 365;

  return { todayCosts, periodSavings, departmentSavings, standardCost, annualProjection };
}

export default function CostProjection({ selectedDate }: CostProjectionProps) {
  const { todayCosts, periodSavings, departmentSavings, standardCost, annualProjection } = generateCostData(selectedDate);
  return (
    <Card>
      <CardHeader title="Cost Projection" />
      <CardBody className="space-y-6">
        {/* Today's Costs */}
        <div className="space-y-3">
          {todayCosts.map((line) => (
            <div
              key={line.label}
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
            >
              <span className="text-[13px] text-gray-700">{line.label}</span>
              <span
                className={`font-display text-[16px] ${
                  line.isSavings ? "text-[#2E7D32] font-medium" : "text-black"
                }`}
              >
                {line.isSavings && "-"}£{line.value.toLocaleString()}
                {line.isSavings && (
                  <span className="ml-1 text-[12px]">
                    ({((line.value / standardCost) * 100).toFixed(1)}%)
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Period Savings Grid */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            <Calendar size={12} />
            Savings by Period
          </div>
          <div className="grid grid-cols-2 gap-3">
            {periodSavings.map((period) => (
              <div
                key={period.period}
                className="rounded-sm bg-green-50 p-3 border border-green-100"
              >
                <div className="text-[11px] text-gray-600 mb-1">{period.period}</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-[18px] text-[#2E7D32]">
                    £{period.amount.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-green-600">
                    ({period.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Progress */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            <Target size={12} />
            MTD by Department
          </div>
          <div className="space-y-3">
            {departmentSavings.map((dept) => {
              const progress = (dept.saved / dept.target) * 100;
              return (
                <div key={dept.dept}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-gray-700">{dept.dept}</span>
                    <span className="text-gray-500">
                      £{dept.saved.toLocaleString()} / £{dept.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        progress >= 80 ? "bg-[#2E7D32]" : progress >= 50 ? "bg-[#ED6C02]" : "bg-gray-400"
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Annual Projection */}
        <div className="rounded-sm bg-gray-900 p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-white" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
              Projected Annual Savings
            </span>
          </div>
          <div className="font-display text-[28px] text-white">
            £{(annualProjection / 1000000).toFixed(1)}M
          </div>
          <div className="text-[12px] text-gray-400 mt-1">
            Based on current optimization rate
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
