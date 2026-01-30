"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={goToPreviousDay}
        className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-300 bg-white hover:border-black transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      <div className="flex items-center gap-2 rounded-sm border border-gray-300 bg-white px-4 py-2">
        <Calendar size={14} className="text-gray-500" />
        <span className="text-[14px] font-medium">{formatDate(selectedDate)}</span>
      </div>
      <button
        onClick={goToNextDay}
        className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-300 bg-white hover:border-black transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
