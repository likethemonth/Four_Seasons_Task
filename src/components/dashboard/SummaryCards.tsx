"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface SummaryCardData {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtext?: string;
}

interface SummaryCardsProps {
  selectedDate: Date;
}

function generateDataForDate(date: Date): SummaryCardData[] {
  const dayOfWeek = date.getDay();
  const dateNum = date.getDate();

  // Base values that vary by day
  const baseOccupancy = 70 + (dayOfWeek === 6 ? 15 : dayOfWeek === 5 ? 10 : dayOfWeek === 0 ? 8 : 0) + (dateNum % 5);
  const baseGuests = 100 + (dayOfWeek === 6 ? 42 : dayOfWeek === 5 ? 30 : dayOfWeek === 0 ? 25 : 10) + (dateNum % 10);
  const baseVIP = Math.round(baseGuests * 0.25);
  const baseCost = 38000 + (baseOccupancy - 70) * 500 + (dateNum % 3) * 1000;
  const costSavings = 1800 + (dateNum % 5) * 200;
  const accuracy = 92 + (dateNum % 4);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const prevDayName = dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1];

  return [
    {
      label: "Occupancy",
      value: `${baseOccupancy}%`,
      change: `+${8 + (dateNum % 6)}% vs last ${dayNames[dayOfWeek]}`,
      trend: "up",
    },
    {
      label: "Arriving Guests",
      value: baseGuests.toString(),
      subtext: `${baseVIP} VIP / Repeat Guests`,
    },
    {
      label: "Projected Labor Cost",
      value: `£${baseCost.toLocaleString()}`,
      change: `-£${costSavings.toLocaleString()} vs standard schedule`,
      trend: "up",
    },
    {
      label: "Forecast Accuracy",
      value: `${accuracy}%`,
      subtext: "Last 30 days average",
    },
  ];
}

export default function SummaryCards({ selectedDate }: SummaryCardsProps) {
  const summaryData = generateDataForDate(selectedDate);

  return (
    <div className="grid grid-cols-4 gap-5 mb-6">
      {summaryData.map((card) => (
        <div
          key={card.label}
          className="rounded-sm border border-gray-300 bg-white p-6"
        >
          <div className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-gray-500">
            {card.label}
          </div>
          <div className="font-display text-[38px] font-normal text-black mb-1">
            {card.value}
          </div>
          {card.change && (
            <div
              className={`flex items-center gap-1 text-[14px] ${
                card.trend === "up" ? "text-[#2E7D32]" : card.trend === "down" ? "text-[#C62828]" : "text-gray-600"
              }`}
            >
              {card.trend === "up" && <TrendingUp size={14} />}
              {card.trend === "down" && <TrendingDown size={14} />}
              {card.change}
            </div>
          )}
          {card.subtext && (
            <div className="text-[14px] text-gray-600">{card.subtext}</div>
          )}
        </div>
      ))}
    </div>
  );
}
