import SummaryCards from "@/components/dashboard/SummaryCards";
import AlertBanner from "@/components/dashboard/AlertBanner";
import DepartmentDemand from "@/components/dashboard/DepartmentDemand";
import GuestIntelligence from "@/components/dashboard/GuestIntelligence";
import VIPArrivals from "@/components/dashboard/VIPArrivals";
import CostProjection from "@/components/dashboard/CostProjection";
import WeeklySchedule from "@/components/dashboard/WeeklySchedule";
import DeploymentChart from "@/components/dashboard/DeploymentChart";
import DateSelector from "@/components/dashboard/DateSelector";

export default function Dashboard() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-[34px] font-medium text-black mb-2">
            Daily Demand Overview
          </h1>
          <p className="text-[16px] text-gray-600">
            Guest-informed staffing recommendations for your property
          </p>
        </div>
        <DateSelector />
      </div>

      {/* Alert Banner */}
      <AlertBanner />

      {/* Summary Cards */}
      <SummaryCards />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Full Width - Deployment Chart */}
        <div className="col-span-3">
          <DeploymentChart />
        </div>

        {/* Full Width - Weekly Schedule */}
        <div className="col-span-3">
          <WeeklySchedule />
        </div>

        {/* Left Column - Department Demand (2 cols) */}
        <div className="col-span-2">
          <DepartmentDemand />
        </div>

        {/* Right Column - Guest Intelligence */}
        <div className="col-span-1">
          <GuestIntelligence />
        </div>

        {/* Second Row */}
        <div className="col-span-2">
          <VIPArrivals />
        </div>

        <div className="col-span-1">
          <CostProjection />
        </div>
      </div>
    </div>
  );
}
