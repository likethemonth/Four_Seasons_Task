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

interface GuestIntelligenceProps {
  selectedDate: Date;
}

function generateGuestData(date: Date) {
  const dayOfWeek = date.getDay();
  const dateNum = date.getDate();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const baseGuests = 280 + (isWeekend ? 40 : 0) + (dateNum % 30);
  const fbUsers = Math.round(baseGuests * (0.55 + (dateNum % 5) * 0.01));
  const spaGuests = Math.round(baseGuests * (0.28 + (isWeekend ? 0.08 : 0) + (dateNum % 3) * 0.01));

  const guestStats = [
    {
      icon: <UtensilsCrossed size={18} />,
      label: "High F&B Users",
      value: `${fbUsers} guests`,
      percentage: Math.round((fbUsers / baseGuests) * 100),
    },
    {
      icon: <Sparkles size={18} />,
      label: "Spa History",
      value: `${spaGuests} guests`,
      percentage: Math.round((spaGuests / baseGuests) * 100),
    },
    {
      icon: <Clock size={18} />,
      label: "Early Checkout Pattern",
      value: `${35 + (dateNum % 15)} rooms`,
    },
    {
      icon: <Clock size={18} />,
      label: "Late Checkout Pattern",
      value: `${20 + (isWeekend ? 12 : 0) + (dateNum % 10)} rooms`,
    },
    {
      icon: <Baby size={18} />,
      label: "Families with Children",
      value: `${8 + (isWeekend ? 8 : 0) + (dateNum % 6)} families`,
    },
    {
      icon: <Leaf size={18} />,
      label: "Dietary Restrictions",
      value: `${15 + (dateNum % 10)} guests`,
    },
    {
      icon: <Plane size={18} />,
      label: "Business Travelers",
      value: `${isWeekend ? 30 + (dateNum % 10) : 60 + (dateNum % 15)} guests`,
      percentage: isWeekend ? 25 + (dateNum % 8) : 45 + (dateNum % 10),
    },
    {
      icon: <Repeat size={18} />,
      label: "Repeat Guests",
      value: `${100 + (dateNum % 20)} guests`,
      percentage: 32 + (dateNum % 8),
    },
  ];

  const leisurePercent = isWeekend ? 65 + (dateNum % 10) : 48 + (dateNum % 8);
  const guestSegments = [
    { label: "Leisure", value: leisurePercent, color: "bg-[#2E7D32]" },
    { label: "Business", value: 100 - leisurePercent, color: "bg-[#0288D1]" },
  ];

  const totalLoyalty = 130 + (dateNum % 20);
  const eliteCount = 6 + (dateNum % 4);
  const preferredCount = 18 + (dateNum % 8);
  const vipCount = 6 + (dateNum % 4);
  const firstStayCount = totalLoyalty - eliteCount - preferredCount - vipCount;

  const loyaltyBreakdown = [
    { tier: "Elite", count: eliteCount, color: "bg-black" },
    { tier: "Preferred", count: preferredCount, color: "bg-gray-700" },
    { tier: "VIP", count: vipCount, color: "bg-gray-500" },
    { tier: "First Stay", count: firstStayCount, color: "bg-gray-300" },
  ];

  return { guestStats, guestSegments, loyaltyBreakdown };
}

export default function GuestIntelligence({ selectedDate }: GuestIntelligenceProps) {
  const { guestStats, guestSegments, loyaltyBreakdown } = generateGuestData(selectedDate);
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
              <div className="flex items-center gap-2 text-[15px] text-gray-700">
                <span className="text-gray-400">{stat.icon}</span>
                {stat.label}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black">{stat.value}</span>
                {stat.percentage && (
                  <span className="text-[13px] text-gray-500">({stat.percentage}%)</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Travel Purpose */}
        <div>
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-gray-500">
            Travel Purpose
          </div>
          <div className="flex h-4 overflow-hidden rounded-full">
            {guestSegments.map((segment) => (
              <div
                key={segment.label}
                className={`${segment.color}`}
                style={{ width: `${segment.value}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[13px]">
            {guestSegments.map((segment) => (
              <span key={segment.label} className="text-gray-600">
                {segment.label}: {segment.value}%
              </span>
            ))}
          </div>
        </div>

        {/* Loyalty Breakdown */}
        <div>
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-gray-500">
            Loyalty Breakdown
          </div>
          <div className="grid grid-cols-2 gap-3">
            {loyaltyBreakdown.map((tier) => (
              <div key={tier.tier} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-sm ${tier.color}`} />
                <span className="text-[14px] text-gray-600">
                  {tier.tier}: <span className="font-semibold text-black">{tier.count}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
