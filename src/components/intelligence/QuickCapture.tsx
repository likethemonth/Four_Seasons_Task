"use client";

import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import {
  Send,
  MessageSquare,
  Phone,
  Mail,
  Mic,
  MicOff,
  Loader2,
  CheckCircle,
  PhoneOff,
  Volume2,
  AlertCircle,
  Keyboard,
} from "lucide-react";

type CaptureType = "note" | "call" | "email";
type InputMode = "text" | "voice";

interface QuickCaptureProps {
  onCapture?: (data: {
    type: CaptureType;
    message: string;
    guestName?: string;
    roomNumber?: string;
  }) => void;
}

export default function QuickCapture({ onCapture }: QuickCaptureProps) {
  const [type, setType] = useState<CaptureType>("note");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  // Voice state
  const [isConnecting, setIsConnecting] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");

  const conversation = useConversation({
    onConnect: () => {
      setVoiceError(null);
    },
    onMessage: (msg) => {
      if (msg.role === "user") {
        setTranscript(msg.message || "");
      } else if (msg.role === "agent" && msg.message) {
        // Agent confirmed the intel, process it
        handleVoiceCapture(msg.message);
      }
    },
    onError: (error) => {
      console.error("Voice error:", error);
      setVoiceError("Voice connection error");
    },
  });

  const handleVoiceCapture = async (agentMessage: string) => {
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: agentMessage,
          staffName: `Voice (${type})`,
          useMock: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onCapture?.({
          type,
          message: agentMessage,
          guestName: data.data.guestName,
          roomNumber: data.data.roomNumber,
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Failed to capture voice intel:", error);
    }
  };

  const handleTextSubmit = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          staffName: `Dashboard (${type})`,
          useMock: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onCapture?.({
          type,
          message: message.trim(),
          guestName: data.data.guestName,
          roomNumber: data.data.roomNumber,
        });
        setMessage("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Failed to capture:", error);
    } finally {
      setSending(false);
    }
  };

  const startVoice = async () => {
    setIsConnecting(true);
    setVoiceError(null);
    setTranscript("");

    try {
      const response = await fetch("/api/elevenlabs/token");
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Voice service unavailable");
      }

      await conversation.startSession({
        signedUrl: data.signedUrl,
      });
    } catch (err) {
      console.error("Voice start error:", err);
      setVoiceError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setIsConnecting(false);
    }
  };

  const endVoice = async () => {
    await conversation.endSession();
    setTranscript("");
  };

  const isVoiceConnected = conversation.status === "connected";

  const placeholders: Record<CaptureType, string> = {
    note: 'Quick note: "Mr. Chen 412 - wife\'s birthday, loves peonies, vegetarian"',
    call: 'Call summary: "Spoke with Mrs. Tanaka 508 - confirmed spa at 3pm, mentioned nut allergy"',
    email: 'Email summary: "Guest requested early check-in, celebrating anniversary"',
  };

  const typeButtons: { type: CaptureType; icon: React.ReactNode; label: string }[] = [
    { type: "note", icon: <MessageSquare size={16} />, label: "Note" },
    { type: "call", icon: <Phone size={16} />, label: "Call" },
    { type: "email", icon: <Mail size={16} />, label: "Email" },
  ];

  return (
    <Card>
      <CardHeader title="Quick Capture" />
      <CardBody>
        {/* Type selector */}
        <div className="flex gap-2 mb-4">
          {typeButtons.map((btn) => (
            <button
              key={btn.type}
              onClick={() => setType(btn.type)}
              className={`flex items-center gap-2 rounded-sm px-4 py-2 text-[13px] font-medium transition-all ${
                type === btn.type
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>

        {/* Input mode toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-sm p-1 mb-4">
          <button
            onClick={() => setInputMode("text")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-sm py-2 text-[12px] font-medium transition-all ${
              inputMode === "text"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Keyboard size={14} />
            Type
          </button>
          <button
            onClick={() => setInputMode("voice")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-sm py-2 text-[12px] font-medium transition-all ${
              inputMode === "voice"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Mic size={14} />
            Voice
          </button>
        </div>

        {/* Text input mode */}
        {inputMode === "text" && (
          <>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={placeholders[type]}
                className="w-full h-24 rounded-sm border border-gray-200 p-3 text-[14px] resize-none focus:border-gray-400 focus:outline-none"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-[12px] text-gray-500">
                AI extracts: guest, room, occasion, dietary, preferences
              </div>
              <button
                onClick={handleTextSubmit}
                disabled={!message.trim() || sending}
                className={`flex items-center gap-2 rounded-sm px-4 py-2 text-[14px] font-medium text-white transition-all ${
                  success
                    ? "bg-green-600"
                    : sending
                    ? "bg-gray-400"
                    : "bg-black hover:bg-gray-800"
                } disabled:bg-gray-300`}
              >
                {success ? (
                  <>
                    <CheckCircle size={16} />
                    Captured
                  </>
                ) : sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Capture
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Voice input mode */}
        {inputMode === "voice" && (
          <div className="space-y-4">
            {/* Error */}
            {voiceError && (
              <div className="flex items-center gap-2 rounded-sm bg-red-50 border border-red-200 p-3 text-[12px] text-red-700">
                <AlertCircle size={14} />
                {voiceError}
              </div>
            )}

            {/* Voice controls */}
            <div className="flex justify-center">
              {!isVoiceConnected ? (
                <button
                  onClick={startVoice}
                  disabled={isConnecting}
                  className="flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-[14px] font-medium text-white hover:bg-green-700 disabled:bg-gray-300 transition-all"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Mic size={18} />
                      Start Voice Capture
                    </>
                  )}
                </button>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] ${
                      conversation.isSpeaking
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {conversation.isSpeaking ? (
                      <>
                        <Volume2 size={16} className="animate-pulse" />
                        Agent responding...
                      </>
                    ) : (
                      <>
                        <Mic size={16} className="animate-pulse" />
                        Listening... speak now
                      </>
                    )}
                  </div>

                  {transcript && (
                    <div className="w-full rounded-sm bg-gray-50 border border-gray-200 p-3 text-[13px] text-gray-700">
                      <div className="text-[11px] text-gray-500 mb-1">You said:</div>
                      {transcript}
                    </div>
                  )}

                  <button
                    onClick={endVoice}
                    className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-[13px] font-medium text-white hover:bg-red-700"
                  >
                    <PhoneOff size={16} />
                    End Voice
                  </button>
                </div>
              )}
            </div>

            {/* Voice instructions */}
            {!isVoiceConnected && (
              <div className="rounded-sm bg-blue-50 border border-blue-100 p-3 text-[12px] text-blue-700">
                <div className="font-semibold mb-1">Voice Capture Instructions:</div>
                <ul className="space-y-0.5">
                  <li>1. Click "Start Voice Capture" to connect</li>
                  <li>2. Speak naturally: "Mr. Chen in 412 - birthday, vegetarian"</li>
                  <li>3. AI confirms extraction and saves automatically</li>
                </ul>
              </div>
            )}

            {success && (
              <div className="flex items-center justify-center gap-2 text-green-600 text-[14px]">
                <CheckCircle size={18} />
                Intelligence captured successfully!
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
