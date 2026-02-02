"use client";

import { useCopilot } from "@/context/CopilotContext";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function CopilotTrigger() {
  const { isOpen, toggle } = useCopilot();
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);

  // Show tooltip hint after 2 seconds on first load
  useEffect(() => {
    if (!hasShownOnce && !isOpen) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        setHasShownOnce(true);
        // Hide after 5 seconds
        setTimeout(() => setShowTooltip(false), 5000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasShownOnce, isOpen]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  // Don't show trigger when sidebar is open
  if (isOpen) return null;

  return (
    <>
      {/* Tooltip */}
      {showTooltip && (
        <div className="fixed bottom-24 right-6 z-50 animate-fade-in">
          <div className="bg-black text-white px-3 py-2 rounded-lg shadow-lg text-[12px] max-w-[200px]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-medium">Try Copilot</span>
              <button
                onClick={() => setShowTooltip(false)}
                className="p-0.5 hover:bg-gray-700 rounded"
              >
                <X size={12} />
              </button>
            </div>
            <p className="text-gray-300 text-[11px]">
              Get instant guest intel, arrivals briefing, and housekeeping priorities.
            </p>
            <div className="mt-2 text-[10px] text-gray-400">
              Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">⌘K</kbd> to toggle
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black" />
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggle}
        onMouseEnter={() => setShowTooltip(false)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 group"
        aria-label="Open Copilot"
      >
        <Sparkles size={24} className="text-white group-hover:animate-pulse" />

        {/* Keyboard hint on hover */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-900 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap">
            ⌘K
          </div>
        </div>
      </button>
    </>
  );
}
