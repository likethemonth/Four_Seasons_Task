"use client";

import { useState, useCallback, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Loader2,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  User,
} from "lucide-react";

interface Message {
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

interface VoiceCaptureProps {
  onIntelligenceCaptured?: (data: {
    guestName: string;
    roomNumber: string;
    details: string;
  }) => void;
}

export default function VoiceCapture({ onIntelligenceCaptured }: VoiceCaptureProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      setError(null);
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
    },
    onMessage: (message) => {
      console.log("Message received:", message);

      const newMessage: Message = {
        role: message.role,
        content: message.message || "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);

      // If this is from the agent and contains extracted intelligence, process it
      if (message.role === "agent" && message.message) {
        processAgentResponse(message.message);
      }
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      setError("Connection error. Please try again.");
    },
  });

  const processAgentResponse = (response: string) => {
    // Check if the response contains captured intelligence
    const guestMatch = response.match(/guest[:\s]+([^,\n]+)/i);
    const roomMatch = response.match(/room[:\s]+(\d+)/i);

    if (guestMatch || roomMatch) {
      onIntelligenceCaptured?.({
        guestName: guestMatch?.[1]?.trim() || "Unknown",
        roomNumber: roomMatch?.[1] || "",
        details: response,
      });
    }
  };

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    setMessages([]);

    try {
      // Get signed URL from our API
      const response = await fetch("/api/elevenlabs/token");
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to get conversation token");
      }

      await conversation.startSession({
        signedUrl: data.signedUrl,
      });
    } catch (err) {
      console.error("Failed to start conversation:", err);
      setError(err instanceof Error ? err.message : "Failed to connect");
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
    setMessages([]);
  }, [conversation]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    // Note: The SDK handles muting through the micMuted option
  }, [isMuted]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    conversation.setVolume({ volume: newVolume });
  }, [conversation]);

  const isConnected = conversation.status === "connected";

  return (
    <Card>
      <CardHeader
        title="Voice Intelligence Capture"
        action={
          <div className="flex items-center gap-2">
            {isConnected && (
              <span className="flex items-center gap-1 text-[12px] text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
        }
      />
      <CardBody>
        {/* Error display */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-sm bg-red-50 border border-red-200 p-3 text-[13px] text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Connection controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {!isConnected ? (
            <button
              onClick={startConversation}
              disabled={isConnecting}
              className="flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-[14px] font-medium text-white hover:bg-green-700 disabled:bg-gray-300 transition-all"
            >
              {isConnecting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone size={20} />
                  Start Voice Call
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
                  isMuted
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                {isMuted ? "Unmute" : "Mute"}
              </button>

              <button
                onClick={endConversation}
                className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-[14px] font-medium text-white hover:bg-red-700 transition-all"
              >
                <PhoneOff size={20} />
                End Call
              </button>
            </>
          )}
        </div>

        {/* Volume control */}
        {isConnected && (
          <div className="flex items-center gap-3 mb-6 px-4">
            <VolumeX size={16} className="text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <Volume2 size={16} className="text-gray-400" />
          </div>
        )}

        {/* Speaking indicator */}
        {isConnected && (
          <div className="flex items-center justify-center mb-4">
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] ${
                conversation.isSpeaking
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {conversation.isSpeaking ? (
                <>
                  <Volume2 size={16} className="animate-pulse" />
                  Agent speaking...
                </>
              ) : (
                <>
                  <Mic size={16} />
                  Listening...
                </>
              )}
            </div>
          </div>
        )}

        {/* Conversation transcript */}
        <div className="border-t border-gray-200 pt-4">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Conversation
          </div>
          <div className="max-h-64 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-[13px] text-gray-400">
                {isConnected
                  ? "Start speaking to capture guest intelligence..."
                  : "Click 'Start Voice Call' to begin"}
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "agent" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <MessageSquare size={14} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 text-[13px] ${
                      msg.role === "user"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        {!isConnected && (
          <div className="mt-4 p-4 rounded-sm bg-blue-50 border border-blue-100">
            <div className="text-[13px] font-semibold text-blue-800 mb-2">
              How to use Voice Capture
            </div>
            <ul className="text-[12px] text-blue-700 space-y-1">
              <li>1. Click "Start Voice Call" to connect</li>
              <li>2. Speak naturally: "Mr. Chen in room 412 is celebrating his wife's birthday, they're vegetarian"</li>
              <li>3. The AI will confirm and extract the guest preferences</li>
              <li>4. Intelligence is automatically saved to the system</li>
            </ul>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
