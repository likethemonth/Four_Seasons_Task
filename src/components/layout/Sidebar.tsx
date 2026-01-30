"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  BarChart3,
  PieChart,
  Building2,
  UtensilsCrossed,
  ConciergeBell,
  Sparkles,
  DoorOpen,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
      { label: "Guest Intelligence", href: "/guests", icon: <Users size={18} /> },
    ],
  },
  {
    title: "Scheduling",
    items: [
      { label: "Schedule Overview", href: "/schedule", icon: <Calendar size={18} /> },
      { label: "Demand Forecast", href: "/forecast", icon: <TrendingUp size={18} /> },
      { label: "Recommendations", href: "/recommendations", icon: <Settings size={18} /> },
    ],
  },
  {
    title: "Departments",
    items: [
      { label: "Housekeeping", href: "/dept/housekeeping", icon: <Building2 size={18} /> },
      { label: "Food & Beverage", href: "/dept/fnb", icon: <UtensilsCrossed size={18} /> },
      { label: "Front Office", href: "/dept/front-office", icon: <DoorOpen size={18} /> },
      { label: "Spa & Recreation", href: "/dept/spa", icon: <Sparkles size={18} /> },
      { label: "Concierge", href: "/dept/concierge", icon: <ConciergeBell size={18} /> },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Labor Cost Analysis", href: "/analytics/labor", icon: <BarChart3 size={18} /> },
      { label: "Performance Reports", href: "/analytics/performance", icon: <PieChart size={18} /> },
    ],
  },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("/");

  return (
    <nav className="fixed left-0 top-24 bottom-0 w-60 overflow-y-auto border-r border-gray-300 bg-white py-6">
      {navigation.map((section) => (
        <div key={section.title} className="mb-6">
          <div className="mb-3 px-5 text-[12px] font-semibold uppercase tracking-wider text-gray-500">
            {section.title}
          </div>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setActiveItem(item.href)}
              className={`flex items-center gap-3 px-5 py-3 text-[15px] transition-all ${
                activeItem === item.href
                  ? "border-l-[3px] border-black bg-gray-100 font-semibold text-black"
                  : "text-gray-700 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <span className="opacity-70">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
