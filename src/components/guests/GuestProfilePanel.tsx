"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Edit,
  MoreVertical,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  Star,
  FileText,
  Heart,
  Link,
  Clock,
  Award,
  Percent,
} from "lucide-react";

interface GuestProfile {
  id: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  title?: string;
  language: string;
  nationality?: string;
  vipCode?: string;
  currency: string;
  clientId: string;
  profileType: string;
  membership?: string;
  guestType?: string;
  folioSettlementType?: string;
  paymentDueDays?: number;
  isContact: boolean;
  keepHistory: boolean;
  isActive: boolean;
  isProtected: boolean;
  isRestricted: boolean;
  vatOffset: boolean;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

// Sample guest data
const sampleGuest: GuestProfile = {
  id: "273819",
  lastName: "Chen",
  firstName: "Wei",
  middleName: "",
  title: "Mr.",
  language: "E",
  nationality: "Singapore",
  vipCode: "VIP",
  currency: "GBP",
  clientId: "273819",
  profileType: "Guest",
  membership: "Elite",
  guestType: "Leisure",
  folioSettlementType: "Direct Bill",
  paymentDueDays: 30,
  isContact: true,
  keepHistory: true,
  isActive: true,
  isProtected: false,
  isRestricted: false,
  vatOffset: false,
  email: "wei.chen@email.com",
  phone: "+65 9123 4567",
  address: "123 Orchard Road, Singapore 238867",
  createdAt: "15/01/2024 14:32",
  createdBy: "MC@FSLONDON",
  updatedAt: "02/02/2026 10:15",
  updatedBy: "MC@FSLONDON",
};

const sidebarLinks = [
  { id: "overview", label: "Overview", icon: User },
  { id: "profile", label: "Profile Details", icon: FileText },
  { id: "communication", label: "Communication", icon: Mail },
  { id: "preferences", label: "Preferences", icon: Heart },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "attachments", label: "Attachments", icon: Link },
  { id: "relationships", label: "Relationships", icon: Link },
  { id: "stays", label: "Future & Past Stays", icon: Clock },
  { id: "membership", label: "Membership", icon: Award },
  { id: "rates", label: "Negotiated Rates", icon: Percent },
];

export default function GuestProfilePanel({ guestId }: { guestId?: string }) {
  const [activeSection, setActiveSection] = useState("profile");
  const [profileExpanded, setProfileExpanded] = useState(true);
  const [communicationExpanded, setCommunicationExpanded] = useState(true);
  const guest = sampleGuest;

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="w-48 shrink-0">
        <nav className="space-y-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveSection(link.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] rounded-sm transition-colors text-left ${
                activeSection === link.id
                  ? "bg-[#1a1a1a] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <link.icon size={14} />
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
        {/* Profile Details Section */}
        <div className="bg-white border border-gray-200 rounded-sm">
          {/* Section Header */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer"
            onClick={() => setProfileExpanded(!profileExpanded)}
          >
            <h3 className="text-[14px] font-semibold text-gray-800">Profile Details</h3>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-200 rounded-sm transition-colors">
                <Settings size={16} className="text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded-sm transition-colors bg-[#1a1a1a]">
                <Edit size={16} className="text-white" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded-sm transition-colors">
                <MoreVertical size={16} className="text-gray-500" />
              </button>
              {profileExpanded ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </div>
          </div>

          {/* Profile Content */}
          {profileExpanded && (
            <div className="p-6">
              <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                {/* Column 1 */}
                <div className="space-y-5">
                  <ProfileField label="Last Name" value={guest.lastName} />
                  <ProfileField label="First Name" value={guest.firstName} />
                  <ProfileField label="Middle Name" value={guest.middleName || "—"} />
                  <ProfileField label="Language" value={guest.language} />
                  <ProfileField label="Title" value={guest.title || "—"} />
                </div>

                {/* Column 2 */}
                <div className="space-y-5">
                  <ProfileField label="Nationality" value={guest.nationality || "—"} />
                  <ProfileField label="VIP Code" value={guest.vipCode || "—"} highlight={!!guest.vipCode} />
                  <ProfileField label="Currency" value={guest.currency} />
                  <ProfileField label="Client ID" value={guest.clientId} />
                  <ProfileField label="Profile Type" value={guest.profileType} />
                </div>

                {/* Column 3 */}
                <div className="space-y-5">
                  <ProfileField label="Membership" value={guest.membership || "—"} highlight={!!guest.membership} />
                  <ProfileField label="B/R Guest Type" value={guest.guestType || "—"} />
                  <ProfileField label="Folio Settlement Type" value={guest.folioSettlementType || "—"} />
                  <ProfileField label="Payment Due Days" value={guest.paymentDueDays?.toString() || "—"} />
                  <ProfileCheckbox label="Contact" checked={guest.isContact} />
                </div>

                {/* Column 4 - Checkboxes */}
                <div className="space-y-4">
                  <ProfileCheckbox label="Keep History" checked={guest.keepHistory} />
                  <ProfileCheckbox label="Active" checked={guest.isActive} />
                  <ProfileCheckbox label="Protected" checked={guest.isProtected} />
                  <ProfileCheckbox label="Restricted" checked={guest.isRestricted} />
                  <ProfileCheckbox label="VAT Offset" checked={guest.vatOffset} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Communication Section */}
        <div className="bg-white border border-gray-200 rounded-sm">
          {/* Section Header */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer"
            onClick={() => setCommunicationExpanded(!communicationExpanded)}
          >
            <h3 className="text-[14px] font-semibold text-gray-800">Communication</h3>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-200 rounded-sm transition-colors">
                <Edit size={16} className="text-gray-500" />
              </button>
              {communicationExpanded ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </div>
          </div>

          {/* Communication Content */}
          {communicationExpanded && (
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Email</div>
                    <div className="flex items-center gap-2 text-[14px] text-gray-800">
                      <Mail size={14} className="text-gray-400" />
                      {guest.email || "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Phone</div>
                    <div className="flex items-center gap-2 text-[14px] text-gray-800">
                      <Phone size={14} className="text-gray-400" />
                      {guest.phone || "—"}
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Address</div>
                  <div className="flex items-start gap-2 text-[14px] text-gray-800">
                    <MapPin size={14} className="text-gray-400 mt-0.5" />
                    {guest.address || "—"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Created/Updated */}
        <div className="flex items-center justify-end gap-6 text-[11px] text-gray-500 px-2">
          <span>Created {guest.createdAt} By {guest.createdBy}</span>
          <span>Updated {guest.updatedAt} By {guest.updatedBy}</span>
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`text-[14px] ${highlight ? "font-semibold text-[#1a1a1a]" : "text-gray-800"}`}>
        {value}
      </div>
    </div>
  );
}

function ProfileCheckbox({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        readOnly
        className="w-4 h-4 rounded-sm border-gray-300 text-[#1a1a1a] focus:ring-0"
      />
      <span className="text-[13px] text-gray-700">{label}</span>
    </label>
  );
}
