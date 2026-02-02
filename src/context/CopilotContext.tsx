"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Room } from "@/lib/data/parkLaneRooms";

// Types for page context
export interface GuestContext {
  id: string;
  name: string;
  roomNumber?: string;
  vipCode?: string;
  occasion?: string;
  dietary?: string[];
  preferences?: string[];
}

export interface RoomContext {
  roomNumber: string;
  floor: number;
  category: string;
  status: string;
  guestName?: string;
  isVip?: boolean;
}

export interface PageContext {
  page: "dashboard" | "guests" | "housekeeping" | "schedule" | "copilot";
  selectedRoom?: RoomContext;
  selectedGuest?: GuestContext;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export type SidebarTab = "arrivals" | "chat" | "housekeeping";

interface CopilotContextType {
  // Visibility
  isOpen: boolean;
  toggle: () => void;
  open: (context?: Partial<PageContext>) => void;
  close: () => void;

  // Active tab in sidebar
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;

  // Conversation (persists across navigation)
  messages: Message[];
  addMessage: (role: "user" | "assistant" | "system", content: string) => void;
  clearMessages: () => void;

  // Page awareness
  pageContext: PageContext;
  setPageContext: (ctx: Partial<PageContext>) => void;

  // Selected items for context
  selectRoom: (room: RoomContext | undefined) => void;
  selectGuest: (guest: GuestContext | undefined) => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

const STORAGE_KEY = "fs-copilot-messages";

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>("arrivals");
  const [messages, setMessages] = useState<Message[]>([]);
  const [pageContext, setPageContextState] = useState<PageContext>({
    page: "dashboard",
  });

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(
          parsed.map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }))
        );
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        // Ignore storage errors
      }
    }
  }, [messages]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback((context?: Partial<PageContext>) => {
    if (context) {
      setPageContextState((prev) => ({ ...prev, ...context }));
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const addMessage = useCallback(
    (role: "user" | "assistant" | "system", content: string) => {
      const message: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role,
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, message]);
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const setPageContext = useCallback((ctx: Partial<PageContext>) => {
    setPageContextState((prev) => ({ ...prev, ...ctx }));
  }, []);

  const selectRoom = useCallback((room: RoomContext | undefined) => {
    setPageContextState((prev) => ({ ...prev, selectedRoom: room }));
    if (room) {
      setIsOpen(true);
      setActiveTab("housekeeping");
    }
  }, []);

  const selectGuest = useCallback((guest: GuestContext | undefined) => {
    setPageContextState((prev) => ({ ...prev, selectedGuest: guest }));
    if (guest) {
      setIsOpen(true);
      setActiveTab("arrivals");
    }
  }, []);

  return (
    <CopilotContext.Provider
      value={{
        isOpen,
        toggle,
        open,
        close,
        activeTab,
        setActiveTab,
        messages,
        addMessage,
        clearMessages,
        pageContext,
        setPageContext,
        selectRoom,
        selectGuest,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const context = useContext(CopilotContext);
  if (context === undefined) {
    throw new Error("useCopilot must be used within a CopilotProvider");
  }
  return context;
}
