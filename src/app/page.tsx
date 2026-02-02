"use client";

import { useState } from "react";
import SummaryCards from "@/components/dashboard/SummaryCards";
import AlertBanner from "@/components/dashboard/AlertBanner";
import DepartmentDemand from "@/components/dashboard/DepartmentDemand";
import GuestIntelligence from "@/components/dashboard/GuestIntelligence";
import VIPArrivals from "@/components/dashboard/VIPArrivals";
import CostProjection from "@/components/dashboard/CostProjection";
import DeploymentChart from "@/components/dashboard/DeploymentChart";
import DateSelector from "@/components/dashboard/DateSelector";

export default function Dashboard() {
  // Default to February 15, 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 15));

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-[34px] font-medium text-black mb-2">
            Daily Demand Overview
          </h1>
          <p className="text-[16px] text-gray-600">
            Guest-informed staffing recommendations for your property
          </p>
        </div>
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Alert Banner */}
      <AlertBanner selectedDate={selectedDate} />

      {/* Summary Cards */}
      <SummaryCards selectedDate={selectedDate} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Full Width - Deployment Chart */}
        <div className="col-span-3">
          <DeploymentChart selectedDate={selectedDate} />
        </div>

        {/* Left Column - Department Demand (2 cols) */}
        <div className="col-span-2">
          <DepartmentDemand selectedDate={selectedDate} />
        </div>

        {/* Right Column - Guest Intelligence */}
        <div className="col-span-1">
          <GuestIntelligence selectedDate={selectedDate} />
        </div>

        {/* Second Row */}
        <div className="col-span-2">
          <VIPArrivals selectedDate={selectedDate} />
        </div>

        <div className="col-span-1">
          <CostProjection selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}
