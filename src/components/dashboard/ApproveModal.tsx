"use client";

import { useState } from "react";
import { X, Check, Zap } from "lucide-react";
import Button from "@/components/ui/Button";

interface DepartmentChange {
  dept: string;
  change: number;
  cost: number;
}

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const departmentChanges: DepartmentChange[] = [
  { dept: "Housekeeping", change: -2, cost: -180 },
  { dept: "Food & Beverage", change: 3, cost: 270 },
  { dept: "Front Office", change: 0, cost: 0 },
  { dept: "Spa & Recreation", change: 1, cost: 90 },
  { dept: "Concierge", change: 0, cost: 0 },
];

export default function ApproveModal({ isOpen, onClose }: ApproveModalProps) {
  const [isPushing, setIsPushing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const netChange = departmentChanges.reduce((sum, d) => sum + d.change, 0);
  const updatedDepartments = departmentChanges.filter((d) => d.change !== 0).length;

  const handlePush = () => {
    setIsPushing(true);
    // Simulate API call
    setTimeout(() => {
      setIsPushing(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsPushing(false);
    onClose();
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
        <div className="relative w-full max-w-md rounded-sm border border-gray-300 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2E7D32]">
                <Check size={14} className="text-white" />
              </div>
              <h3 className="text-[17px] font-semibold text-black">Schedule Published</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check size={32} className="text-[#2E7D32]" />
              </div>
            </div>

            <p className="text-center text-[15px] text-gray-700 mb-6">
              Schedule successfully pushed to Fourth
            </p>

            <div className="space-y-3 text-[14px] text-gray-600">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-[#2E7D32]" />
                <span>{updatedDepartments} department schedules updated</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-[#2E7D32]" />
                <span>Managers notified via Fourth app</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-[#2E7D32]" />
                <span>Changes effective: Today, Feb 15</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main approval state
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative w-full max-w-lg rounded-sm border border-gray-300 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-[17px] font-semibold text-black">Approve Schedule Changes</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-[15px] text-gray-700 mb-4">
            The AI-optimized schedule will adjust:
          </p>

          {/* Changes Table */}
          <div className="rounded-sm border border-gray-200 overflow-hidden mb-4">
            <table className="w-full">
              <tbody>
                {departmentChanges.map((item) => (
                  <tr key={item.dept} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 text-[14px] text-gray-700">{item.dept}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-[14px] font-semibold ${
                          item.change > 0
                            ? "text-[#2E7D32]"
                            : item.change < 0
                            ? "text-[#ED6C02]"
                            : "text-gray-400"
                        }`}
                      >
                        {item.change > 0 ? `+${item.change}` : item.change} staff
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right w-24">
                      <span
                        className={`text-[14px] ${
                          item.cost > 0
                            ? "text-[#C62828]"
                            : item.cost < 0
                            ? "text-[#2E7D32]"
                            : "text-gray-400"
                        }`}
                      >
                        {item.cost > 0 ? `+£${item.cost}` : item.cost < 0 ? `-£${Math.abs(item.cost)}` : "£0"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-between text-[15px] mb-4">
            <div>
              <span className="text-gray-600">Net Change: </span>
              <span className={`font-semibold ${netChange >= 0 ? "text-[#2E7D32]" : "text-[#ED6C02]"}`}>
                {netChange >= 0 ? `+${netChange}` : netChange} staff
              </span>
            </div>
            <div>
              <span className="text-gray-600">Projected Daily Savings: </span>
              <span className="font-semibold text-[#2E7D32]">£2,400</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 rounded-sm bg-amber-50 border border-amber-200 p-4">
            <Zap size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-[13px] text-amber-800">
              This will sync to Fourth and notify department managers automatically.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePush} disabled={isPushing}>
            {isPushing ? "Pushing..." : "Push to Fourth"}
          </Button>
        </div>
      </div>
    </div>
  );
}
