"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface SummaryCardData {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtext?: string;
}

const summaryData: SummaryCardData[] = [
  {
    label: "Occupancy",
    value: "85%",
    change: "+12% vs last Saturday",
    trend: "up",
  },
  {
    label: "Arriving Guests",
    value: "142",
    subtext: "38 VIP / Repeat Guests",
  },
  {
    label: "Projected Labor Cost",
    value: "£42,800",
    change: "-£2,400 vs standard schedule",
    trend: "up",
  },
  {
    label: "Forecast Accuracy",
    value: "94%",
    subtext: "Last 30 days average",
  },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {summaryData.map((card) => (
        <div
          key={card.label}
          className="rounded-sm border border-gray-300 bg-white p-5"
        >
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            {card.label}
          </div>
          <div className="font-display text-[32px] font-normal text-black mb-1">
            {card.value}
          </div>
          {card.change && (
            <div
              className={`flex items-center gap-1 text-[12px] ${
                card.trend === "up" ? "text-[#2E7D32]" : card.trend === "down" ? "text-[#C62828]" : "text-gray-600"
              }`}
            >
              {card.trend === "up" && <TrendingUp size={12} />}
              {card.trend === "down" && <TrendingDown size={12} />}
              {card.change}
            </div>
          )}
          {card.subtext && (
            <div className="text-[12px] text-gray-600">{card.subtext}</div>
          )}
        </div>
      ))}
    </div>
  );
}
