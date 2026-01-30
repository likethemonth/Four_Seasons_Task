"use client";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import {
  UtensilsCrossed,
  Sparkles,
  Clock,
  Baby,
  Leaf,
  Plane,
  Crown,
  Repeat,
} from "lucide-react";

interface GuestStat {
  icon: React.ReactNode;
  label: string;
  value: string;
  percentage?: number;
  trend?: "up" | "down";
}

const guestStats: GuestStat[] = [
  {
    icon: <UtensilsCrossed size={16} />,
    label: "High F&B Users",
    value: "180 guests",
    percentage: 56,
  },
  {
    icon: <Sparkles size={16} />,
    label: "Spa History",
    value: "95 guests",
    percentage: 30,
  },
  {
    icon: <Clock size={16} />,
    label: "Early Checkout Pattern",
    value: "45 rooms",
  },
  {
    icon: <Clock size={16} />,
    label: "Late Checkout Pattern",
    value: "28 rooms",
  },
  {
    icon: <Baby size={16} />,
    label: "Families with Children",
    value: "12 families",
  },
  {
    icon: <Leaf size={16} />,
    label: "Dietary Restrictions",
    value: "20 guests",
  },
  {
    icon: <Plane size={16} />,
    label: "Business Travelers",
    value: "68 guests",
    percentage: 48,
  },
  {
    icon: <Repeat size={16} />,
    label: "Repeat Guests",
    value: "112 guests",
    percentage: 35,
  },
];

const guestSegments = [
  { label: "Leisure", value: 52, color: "bg-[#2E7D32]" },
  { label: "Business", value: 48, color: "bg-[#0288D1]" },
];

const loyaltyBreakdown = [
  { tier: "Elite", count: 8, color: "bg-[#B8860B]" },
  { tier: "Preferred", count: 22, color: "bg-gray-700" },
  { tier: "VIP", count: 8, color: "bg-gray-500" },
  { tier: "First Stay", count: 104, color: "bg-gray-300" },
];

export default function GuestIntelligence() {
  return (
    <Card>
      <CardHeader title="Guest Intelligence" action="View All" />
      <CardBody className="space-y-6">
        {/* Key Stats */}
        <div className="space-y-3">
          {guestStats.slice(0, 6).map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
            >
              <div className="flex items-center gap-2 text-[13px] text-gray-700">
                <span className="text-gray-400">{stat.icon}</span>
                {stat.label}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-black">{stat.value}</span>
                {stat.percentage && (
                  <span className="text-[11px] text-gray-500">({stat.percentage}%)</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Travel Purpose */}
        <div>
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            Travel Purpose
          </div>
          <div className="flex h-3 overflow-hidden rounded-full">
            {guestSegments.map((segment) => (
              <div
                key={segment.label}
                className={`${segment.color}`}
                style={{ width: `${segment.value}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px]">
            {guestSegments.map((segment) => (
              <span key={segment.label} className="text-gray-600">
                {segment.label}: {segment.value}%
              </span>
            ))}
          </div>
        </div>

        {/* Loyalty Breakdown */}
        <div>
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            Loyalty Breakdown
          </div>
          <div className="grid grid-cols-2 gap-2">
            {loyaltyBreakdown.map((tier) => (
              <div key={tier.tier} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-sm ${tier.color}`} />
                <span className="text-[12px] text-gray-600">
                  {tier.tier}: <span className="font-medium text-black">{tier.count}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
