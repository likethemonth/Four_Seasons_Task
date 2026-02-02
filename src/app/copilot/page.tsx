"use client";

import { useState } from "react";
import IntelligenceSidebar from "@/components/copilot/IntelligenceSidebar";
import {
  Search,
  ChevronDown,
  Settings,
  HelpCircle,
  RefreshCw,
  Plus,
  MoreVertical,
} from "lucide-react";

// Mock OPERA arrivals data (what OPERA shows - just basic info)
const operaArrivals = [
  { name: "Adams, Courtney", confirmation: "84012367", arrival: "02/15/2024", departure: "02/17/2024", nights: 2, roomType: "SUP", status: "Assign Room" },
  { name: "Bailey, Austin", confirmation: "84023891", arrival: "02/15/2024", departure: "02/16/2024", nights: 1, roomType: "DLX", status: "Assign Room" },
  { name: "Chen, Marcus", confirmation: "83901122", arrival: "02/15/2024", departure: "02/16/2024", nights: 1, roomType: "EXE", status: "Pre-Assigned" },
  { name: "Dance Revolution", confirmation: "83890012", arrival: "02/15/2024", departure: "02/19/2024", nights: 4, roomType: "GRP", status: "7 Rooms" },
  { name: "Kiser, Piper", confirmation: "83924751", arrival: "02/15/2024", departure: "02/18/2024", nights: 3, roomType: "DXS", status: "Pre-Assigned" },
  { name: "Kiser, Piper", confirmation: "83924752", arrival: "02/18/2024", departure: "02/20/2024", nights: 2, roomType: "DXS", status: "Assign Room" },
  { name: "Martinez, Sofia", confirmation: "84031245", arrival: "02/15/2024", departure: "02/17/2024", nights: 2, roomType: "STD", status: "Assign Room" },
  { name: "Thompson, David", confirmation: "84029876", arrival: "02/15/2024", departure: "02/16/2024", nights: 1, roomType: "SUP", status: "Assign Room" },
];

export default function CopilotDemoPage() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* OPERA-style header simulation */}
      <div className="bg-[#1a1a1a] h-10 flex items-center justify-between px-4 text-white text-[12px]">
        <div className="flex items-center gap-4">
          <span className="font-semibold">OPERA Cloud</span>
          <span className="text-gray-400">|</span>
          <span>Four Seasons Park Lane</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Monday, February 15, 2024</span>
          <span>M. Cocuron</span>
        </div>
      </div>

      {/* OPERA navigation bar simulation */}
      <div className="bg-[#0d9488] h-9 flex items-center px-4 text-white text-[12px] gap-4">
        <span className="font-semibold">Front Desk</span>
        <span>▾</span>
        <span className="text-white/70">Arrivals</span>
      </div>

      {/* Page title bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-medium text-gray-900">Arrivals</h1>
          <div className="text-[12px] text-gray-500">
            Home / Front Desk / Arrivals
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-[12px] text-[#0d9488]">
            <HelpCircle size={14} />
            Help
          </button>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`px-3 py-1.5 rounded text-[12px] font-medium transition-all ${
              showSidebar
                ? "bg-[#0d9488] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {showSidebar ? "★ Intelligence ON" : "☆ Intelligence OFF"}
          </button>
        </div>
      </div>

      {/* Main content area with sidebar */}
      <div className={`transition-all duration-300 ${showSidebar ? "mr-96" : ""}`}>
        {/* Search Panel */}
        <div className="bg-[#e8e8e8] m-4 rounded">
          <div className="bg-gray-600 text-white px-4 py-2 text-[13px] font-medium rounded-t flex items-center justify-between">
            <span>Search</span>
            <ChevronDown size={16} />
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] text-gray-600 mb-1">Arrival Date</label>
                <input
                  type="text"
                  value="02/15/2024"
                  readOnly
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-[12px]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1">To Date</label>
                <input
                  type="text"
                  value="02/15/2024"
                  readOnly
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-[12px]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1">Reservation Status</label>
                <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-[12px]">
                  <option>Due In</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="px-4 py-1.5 bg-[#0d9488] text-white rounded text-[12px] font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results table - simulating OPERA arrivals list */}
        <div className="mx-4 bg-white rounded shadow">
          <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-700">
              Arrivals: {operaArrivals.length} reservations
            </span>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded">
                <RefreshCw size={14} className="text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded">
                <Settings size={14} className="text-gray-500" />
              </button>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Confirmation
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Arrival
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Departure
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Nights
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Room Type
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {operaArrivals.map((arrival, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-[13px] text-[#0d9488] font-medium cursor-pointer hover:underline">
                    {arrival.name}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-600">{arrival.confirmation}</td>
                  <td className="px-4 py-3 text-[13px] text-gray-600">{arrival.arrival}</td>
                  <td className="px-4 py-3 text-[13px] text-gray-600">{arrival.departure}</td>
                  <td className="px-4 py-3 text-[13px] text-gray-600">{arrival.nights}</td>
                  <td className="px-4 py-3 text-[13px] text-gray-600">{arrival.roomType}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-[11px] ${
                        arrival.status === "Pre-Assigned"
                          ? "bg-green-100 text-green-700"
                          : arrival.status.includes("Room")
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {arrival.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical size={14} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Explanation Panel */}
        <div className="m-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="text-[14px] font-semibold text-blue-800 mb-2">
            The Copilot Model: Intelligence Sidebar
          </h3>
          <p className="text-[12px] text-blue-700 mb-3">
            The table above shows what OPERA displays: names, dates, confirmation numbers.
            The sidebar on the right is what Four Seasons Intelligence adds—guest context,
            action items, preferences, and predicted needs. Staff don't leave OPERA;
            they just get smarter alongside it.
          </p>
          <div className="grid grid-cols-3 gap-4 text-[11px]">
            <div>
              <div className="font-semibold text-blue-800 mb-1">Without Intelligence</div>
              <ul className="text-blue-700 space-y-0.5">
                <li>• 8 arrivals today</li>
                <li>• Names and room types</li>
                <li>• No guest context</li>
                <li>• Click each profile manually</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-blue-800 mb-1">With Intelligence</div>
              <ul className="text-blue-700 space-y-0.5">
                <li>• 8 arrivals including 2 VIPs</li>
                <li>• 1 anniversary, 1 allergy flagged</li>
                <li>• 5 action items auto-generated</li>
                <li>• Pre-arrival requests captured</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-blue-800 mb-1">Integration Path</div>
              <ul className="text-blue-700 space-y-0.5">
                <li>• Phase 1: Sidebar (read-only)</li>
                <li>• Phase 2: OPERA API write-back</li>
                <li>• Phase 3: Purpose-built interfaces</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Sidebar */}
      {showSidebar && <IntelligenceSidebar mode="arrivals" />}
    </div>
  );
}
