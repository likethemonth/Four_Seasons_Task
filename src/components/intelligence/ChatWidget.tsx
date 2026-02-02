"use client";

import { useState, useEffect, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import {
  MessageCircle,
  X,
  Send,
  RefreshCw,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  Loader2,
  Keyboard,
  AlertCircle,
} from "lucide-react";

interface IntelRecord {
  id: string;
  guestName: string;
  roomNumber: string;
  occasion?: string;
  dietary?: string[];
  preferences?: string[];
  requests?: string[];
  capturedBy: string;
  capturedAt: string;
  confidence: number;
}

interface VoiceMessage {
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  onNewIntel?: (intel: IntelRecord) => void;
}

export default function ChatWidget({ onNewIntel }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [records, setRecords] = useState<IntelRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Voice state
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      setVoiceError(null);
    },
    onMessage: (msg) => {
      setVoiceMessages((prev) => [
        ...prev,
        {
          role: msg.role,
          content: msg.message || "",
          timestamp: new Date(),
        },
      ]);

      // Process agent response for intelligence
      if (msg.role === "agent" && msg.message) {
        processVoiceIntelligence(msg.message);
      }
    },
    onError: (error) => {
      console.error("Voice error:", error);
      setVoiceError("Voice connection error. Please try again.");
    },
  });

  const processVoiceIntelligence = async (agentResponse: string) => {
    // Send to our intelligence API for processing
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: agentResponse,
          staffName: "Voice Assistant",
          useMock: true,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRecords((prev) => [data.data, ...prev]);
        onNewIntel?.(data.data);
      }
    } catch (error) {
      console.error("Failed to process voice intel:", error);
    }
  };

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/intelligence?recent=60");
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch intelligence:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && mode === "text") {
      fetchRecords();
      const interval = setInterval(fetchRecords, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen, mode, fetchRecords]);

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          staffName: "Dashboard User",
          useMock: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("");
        setRecords((prev) => [data.data, ...prev]);
        onNewIntel?.(data.data);
      }
    } catch (error) {
      console.error("Failed to send:", error);
    } finally {
      setSending(false);
    }
  };

  const startVoiceCall = async () => {
    setIsConnecting(true);
    setVoiceError(null);
    setVoiceMessages([]);

    try {
      const response = await fetch("/api/elevenlabs/token");
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to connect to voice service");
      }

      await conversation.startSession({
        signedUrl: data.signedUrl,
      });
    } catch (err) {
      console.error("Failed to start voice:", err);
      setVoiceError(err instanceof Error ? err.message : "Voice connection failed");
    } finally {
      setIsConnecting(false);
    }
  };

  const endVoiceCall = async () => {
    await conversation.endSession();
    setVoiceMessages([]);
  };

  const formatTime = (dateStr: string | Date) => {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isVoiceConnected = conversation.status === "connected";

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all ${
          isOpen ? "bg-gray-800" : "bg-black hover:bg-gray-800"
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
        {records.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-[11px] font-bold text-white">
            {records.length > 9 ? "9+" : records.length}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 rounded-sm border border-gray-200 bg-white shadow-xl">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[15px] font-semibold text-gray-900">
                Intelligence Capture
              </h3>
              {isVoiceConnected && (
                <span className="flex items-center gap-1 text-[11px] text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              )}
            </div>

            {/* Mode toggle */}
            <div className="flex gap-1 bg-gray-200 rounded-sm p-1">
              <button
                onClick={() => setMode("text")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-sm py-1.5 text-[12px] font-medium transition-all ${
                  mode === "text"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Keyboard size={14} />
                Text
              </button>
              <button
                onClick={() => setMode("voice")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-sm py-1.5 text-[12px] font-medium transition-all ${
                  mode === "voice"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Mic size={14} />
                Voice
              </button>
            </div>
          </div>

          {/* Text Mode */}
          {mode === "text" && (
            <>
              {/* Messages */}
              <div className="max-h-80 overflow-y-auto p-3 space-y-3">
                {records.length === 0 ? (
                  <div className="py-8 text-center text-[14px] text-gray-400">
                    No recent intelligence captured.
                    <br />
                    Type a note below to get started.
                  </div>
                ) : (
                  records.map((record) => (
                    <div
                      key={record.id}
                      className="rounded-sm border border-gray-100 bg-gray-50 p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-[14px] font-semibold text-gray-900">
                          {record.guestName}
                          {record.roomNumber && (
                            <span className="ml-2 text-[13px] font-normal text-gray-500">
                              Room {record.roomNumber}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {formatTime(record.capturedAt)}
                        </span>
                      </div>

                      <div className="space-y-1 text-[13px]">
                        {record.occasion && (
                          <div className="text-amber-600">
                            Occasion: {record.occasion}
                          </div>
                        )}
                        {record.dietary && record.dietary.length > 0 && (
                          <div className="text-green-600">
                            Dietary: {record.dietary.join(", ")}
                          </div>
                        )}
                        {record.preferences && record.preferences.length > 0 && (
                          <div className="text-blue-600">
                            Likes: {record.preferences.join(", ")}
                          </div>
                        )}
                        {record.requests && record.requests.length > 0 && (
                          <div className="text-purple-600">
                            Requests: {record.requests.join(", ")}
                          </div>
                        )}
                      </div>

                      <div className="mt-2 text-[11px] text-gray-400">
                        by {record.capturedBy}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Text Input */}
              <div className="border-t border-gray-200 p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder='e.g., "Mr. Chen 412 - birthday, vegetarian"'
                    className="flex-1 rounded-sm border border-gray-200 px-3 py-2 text-[14px] focus:border-gray-400 focus:outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || sending}
                    className="rounded-sm bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:bg-gray-300"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Voice Mode */}
          {mode === "voice" && (
            <div className="p-4">
              {/* Error */}
              {voiceError && (
                <div className="mb-4 flex items-center gap-2 rounded-sm bg-red-50 border border-red-200 p-3 text-[12px] text-red-700">
                  <AlertCircle size={14} />
                  {voiceError}
                </div>
              )}

              {/* Call controls */}
              <div className="flex justify-center mb-4">
                {!isVoiceConnected ? (
                  <button
                    onClick={startVoiceCall}
                    disabled={isConnecting}
                    className="flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-3 text-[14px] font-medium text-white hover:bg-[#2a2a2a] disabled:bg-gray-300 transition-all"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Phone size={18} />
                        Start Voice Call
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`rounded-full p-3 ${isMuted ? "bg-gray-200 text-gray-600" : "bg-gray-100 text-gray-600"}`}
                    >
                      {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                    <button
                      onClick={endVoiceCall}
                      className="flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-3 text-[14px] font-medium text-white hover:bg-[#2a2a2a]"
                    >
                      <PhoneOff size={18} />
                      End
                    </button>
                  </div>
                )}
              </div>

              {/* Speaking indicator */}
              {isVoiceConnected && (
                <div className="flex justify-center mb-4">
                  <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-[12px] ${conversation.isSpeaking ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-600"}`}>
                    {conversation.isSpeaking ? (
                      <>
                        <Volume2 size={14} className="animate-pulse" />
                        Speaking...
                      </>
                    ) : (
                      <>
                        <Mic size={14} />
                        Listening...
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Voice transcript */}
              <div className="max-h-48 overflow-y-auto space-y-2 mb-4">
                {voiceMessages.length === 0 ? (
                  <div className="text-center py-6 text-[13px] text-gray-400">
                    {isVoiceConnected
                      ? 'Say something like "Mr. Chen in room 412 is celebrating a birthday"'
                      : "Start a voice call to capture intelligence hands-free"}
                  </div>
                ) : (
                  voiceMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg px-3 py-2 text-[13px] ${
                        msg.role === "user"
                          ? "bg-black text-white ml-8"
                          : "bg-gray-100 text-gray-800 mr-8"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))
                )}
              </div>

              {/* Instructions */}
              {!isVoiceConnected && (
                <div className="rounded-sm bg-gray-50 border border-gray-200 p-3 text-[11px] text-gray-700">
                  <div className="font-semibold mb-1">Voice Capture Tips:</div>
                  <ul className="space-y-0.5">
                    <li>• Speak clearly with guest name and room</li>
                    <li>• Mention occasions, dietary needs, preferences</li>
                    <li>• AI confirms and saves automatically</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
