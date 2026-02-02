"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  User,
  HelpCircle,
  ArrowRight,
  Home,
  Search,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Building2,
  UtensilsCrossed,
  DoorOpen,
  Sparkles,
  ConciergeBell,
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Wrench,
  CreditCard,
  Globe,
  MoreHorizontal,
} from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavDropdown {
  label: string;
  items: DropdownItem[];
}

const navDropdowns: NavDropdown[] = [
  {
    label: "Client Relations",
    items: [
      { label: "Guest Profiles", href: "/guests", icon: <Users size={16} /> },
      { label: "Guest Intelligence", href: "/guests", icon: <Sparkles size={16} /> },
      { label: "VIP Management", href: "/guests", icon: <User size={16} /> },
    ],
  },
  {
    label: "Bookings",
    items: [
      { label: "Reservations", href: "/", icon: <Calendar size={16} /> },
      { label: "Group Bookings", href: "/", icon: <Users size={16} /> },
      { label: "Rate Management", href: "/", icon: <CreditCard size={16} /> },
    ],
  },
  {
    label: "Front Desk",
    items: [
      { label: "Check-In/Out", href: "/", icon: <DoorOpen size={16} /> },
      { label: "Room Assignment", href: "/", icon: <Building2 size={16} /> },
      { label: "Arrivals", href: "/", icon: <ArrowRight size={16} /> },
    ],
  },
  {
    label: "Inventory",
    items: [
      { label: "Room Management", href: "/housekeeping", icon: <Building2 size={16} /> },
      { label: "Housekeeping Board", href: "/housekeeping", icon: <ClipboardList size={16} /> },
      { label: "Maintenance", href: "/", icon: <Wrench size={16} /> },
    ],
  },
  {
    label: "Financials",
    items: [
      { label: "Billing", href: "/", icon: <CreditCard size={16} /> },
      { label: "Cashiering", href: "/", icon: <CreditCard size={16} /> },
      { label: "Night Audit", href: "/", icon: <FileText size={16} /> },
    ],
  },
  {
    label: "Channel",
    items: [
      { label: "Distribution", href: "/", icon: <Globe size={16} /> },
      { label: "OTA Management", href: "/", icon: <Globe size={16} /> },
    ],
  },
  {
    label: "Miscellaneous",
    items: [
      { label: "Concierge", href: "/", icon: <ConciergeBell size={16} /> },
      { label: "Spa & Recreation", href: "/", icon: <Sparkles size={16} /> },
      { label: "F&B", href: "/", icon: <UtensilsCrossed size={16} /> },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Daily Reports", href: "/", icon: <FileText size={16} /> },
      { label: "Labor Analytics", href: "/", icon: <BarChart3 size={16} /> },
      { label: "Performance", href: "/", icon: <PieChart size={16} /> },
      { label: "Forecast", href: "/forecast", icon: <TrendingUp size={16} /> },
    ],
  },
];

const sidebarNavigation = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
      { label: "Guest Intelligence", href: "/guests", icon: <Users size={18} /> },
      { label: "Housekeeping", href: "/housekeeping", icon: <ClipboardList size={18} /> },
      { label: "Copilot Demo", href: "/copilot", icon: <Sparkles size={18} /> },
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
      { label: "Housekeeping", href: "/housekeeping", icon: <Building2 size={18} /> },
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

const properties = [
  "Four Seasons Park Lane, London",
  "Four Seasons New York Downtown",
  "Four Seasons Maui",
  "Four Seasons Singapore",
  "Four Seasons Dubai",
];

export default function OperaHeader() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current date formatted like OPERA
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Get breadcrumb from pathname
  const getBreadcrumb = () => {
    const paths = pathname.split("/").filter(Boolean);
    if (paths.length === 0) return "Home / Dashboard";
    return "Home / " + paths.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" / ");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Combined Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]">
        {/* Top Row - Logo, Title, Date, User */}
        <div className="flex h-14 items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center gap-5">
            {/* Hamburger Menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? (
                <X size={20} className="text-white" />
              ) : (
                <Menu size={20} className="text-white" />
              )}
            </button>

            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <Image
                src="/images/fs-tree.svg"
                alt="Four Seasons"
                width={36}
                height={50}
                className="text-white"
                style={{ filter: 'invert(1)' }}
              />
              <span className="font-display text-[20px] font-normal text-white tracking-[0.2em]">
                FOUR SEASONS
              </span>
            </div>
          </div>

          {/* Center - Date */}
          <div className="text-[13px] text-gray-400">
            {currentDate}
          </div>

          {/* Right - User Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 hover:bg-gray-800 rounded px-3 py-1.5 transition-colors"
              >
                <div className="text-right">
                  <div className="text-[11px] text-gray-500">PARK_LANE - Default HUB for Chain</div>
                  <div className="text-[13px] text-white">M. COCURON</div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
                  <User size={16} className="text-gray-300" />
                </div>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg py-1 z-50">
                  <button className="w-full px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <User size={14} /> Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <Settings size={14} /> Settings
                  </button>
                  <hr className="my-1" />
                  <button className="w-full px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row - Navigation */}
        <nav className="flex h-10 items-center px-6" ref={dropdownRef}>
          <div className="flex items-center gap-1">
            {/* Navigation Dropdowns */}
            {navDropdowns.map((dropdown) => (
              <div key={dropdown.label} className="relative">
                <button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === dropdown.label ? null : dropdown.label)
                  }
                  className={`flex items-center gap-1 px-3 py-1.5 text-[13px] text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors ${
                    activeDropdown === dropdown.label ? "bg-gray-800 text-white" : ""
                  }`}
                >
                  {dropdown.label}
                  <ChevronDown size={14} />
                </button>

                {activeDropdown === dropdown.label && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded shadow-lg py-1 z-50">
                    {dropdown.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-2 px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side icons */}
          <div className="ml-auto flex items-center gap-1">
            <button className="p-2 hover:bg-gray-800 rounded transition-colors">
              <Search size={18} className="text-gray-400 hover:text-white" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded transition-colors">
              <Bell size={18} className="text-gray-400 hover:text-white" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded transition-colors">
              <MessageSquare size={18} className="text-gray-400 hover:text-white" />
            </button>
          </div>
        </nav>
      </header>

      {/* Breadcrumb Bar */}
      <div className="fixed top-[96px] left-0 right-0 z-30 flex h-8 items-center justify-between bg-gray-100 border-b border-gray-200 px-4">
        <div className="text-[12px] text-gray-600">
          {getBreadcrumb()}
        </div>
        <Link
          href="/"
          className="flex items-center gap-1 text-[12px] text-[#0d9488] hover:text-[#0f766e]"
        >
          <Home size={14} />
          Back to Home
        </Link>
      </div>

      {/* Page Title Bar */}
      <div className="fixed top-[128px] left-0 right-0 z-20 flex h-10 items-center justify-between bg-white border-b border-gray-200 px-4">
        <h1 className="text-[16px] font-medium text-gray-900">
          {pathname === "/" && "Dashboard"}
          {pathname === "/guests" && "Guest Intelligence"}
          {pathname === "/housekeeping" && "Housekeeping Board"}
          {pathname === "/schedule" && "Schedule Overview"}
          {!["/"
            , "/guests", "/housekeeping", "/schedule"].includes(pathname) &&
            pathname.split("/").pop()?.charAt(0).toUpperCase() +
              (pathname.split("/").pop()?.slice(1) || "")}
        </h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-[12px] text-[#0d9488] hover:text-[#0f766e]">
            <HelpCircle size={14} />
            Help
          </button>
          <button className="flex items-center gap-1 text-[12px] text-[#0d9488] hover:text-[#0f766e]">
            <ArrowRight size={14} />
            I Want To...
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          style={{ top: "88px" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[96px] bottom-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Property Selector */}
        <div className="p-4 border-b border-gray-200">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Property
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-[#0d9488]">
            {properties.map((property) => (
              <option key={property} value={property}>
                {property}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation */}
        <nav className="py-4">
          {sidebarNavigation.map((section) => (
            <div key={section.title} className="mb-4">
              <div className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                {section.title}
              </div>
              {section.items.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all ${
                    pathname === item.href
                      ? "bg-[#0d9488]/10 text-[#0d9488] border-l-3 border-[#0d9488] font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className={pathname === item.href ? "text-[#0d9488]" : "text-gray-500"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
