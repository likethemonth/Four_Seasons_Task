/**
 * Guest intelligence data extracted from staff messages.
 */
export interface GuestIntelligence {
  id: string;
  guestName: string;
  roomNumber: string;
  occasion?: string;
  dietary?: string[];
  preferences?: string[];
  requests?: string[];
  context?: string;
  capturedBy: string;
  capturedAt: Date;
  source: 'telegram';
  confidence: number;
}

/**
 * Raw parsed result from AI before enrichment with metadata.
 */
export interface ParsedGuestIntel {
  guestName: string;
  roomNumber: string;
  occasion?: string;
  dietary?: string[];
  preferences?: string[];
  requests?: string[];
  context?: string;
  confidence: number;
}
