import WeeklySchedule from "@/components/dashboard/WeeklySchedule";
import DateSelector from "@/components/dashboard/DateSelector";

export default function SchedulePage() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-[34px] font-medium text-black mb-2">
            Schedule Overview
          </h1>
          <p className="text-[16px] text-gray-600">
            Manage staff schedules and view shift assignments
          </p>
        </div>
        <DateSelector />
      </div>

      {/* Full Schedule Component */}
      <WeeklySchedule />
    </div>
  );
}
