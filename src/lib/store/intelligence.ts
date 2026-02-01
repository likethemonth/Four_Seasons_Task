import type { GuestIntelligence, ParsedGuestIntel } from '@/lib/ai/types';

/**
 * In-memory store for guest intelligence data.
 * In production, this would be replaced with a database.
 */
class IntelligenceStore {
  private items: Map<string, GuestIntelligence> = new Map();
  private byRoom: Map<string, string[]> = new Map();
  private byGuest: Map<string, string[]> = new Map();

  /**
   * Add a new guest intelligence record.
   */
  add(
    parsed: ParsedGuestIntel,
    capturedBy: string
  ): GuestIntelligence {
    const id = `intel_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const record: GuestIntelligence = {
      id,
      guestName: parsed.guestName,
      roomNumber: parsed.roomNumber,
      occasion: parsed.occasion,
      dietary: parsed.dietary,
      preferences: parsed.preferences,
      requests: parsed.requests,
      context: parsed.context,
      capturedBy,
      capturedAt: new Date(),
      source: 'telegram',
      confidence: parsed.confidence,
    };

    this.items.set(id, record);

    // Index by room
    if (record.roomNumber) {
      const roomRecords = this.byRoom.get(record.roomNumber) || [];
      roomRecords.push(id);
      this.byRoom.set(record.roomNumber, roomRecords);
    }

    // Index by guest name (normalized)
    const normalizedName = record.guestName.toLowerCase();
    const guestRecords = this.byGuest.get(normalizedName) || [];
    guestRecords.push(id);
    this.byGuest.set(normalizedName, guestRecords);

    return record;
  }

  /**
   * Get a record by ID.
   */
  get(id: string): GuestIntelligence | undefined {
    return this.items.get(id);
  }

  /**
   * Get all records for a room.
   */
  getByRoom(roomNumber: string): GuestIntelligence[] {
    const ids = this.byRoom.get(roomNumber) || [];
    return ids.map((id) => this.items.get(id)).filter(Boolean) as GuestIntelligence[];
  }

  /**
   * Get all records for a guest.
   */
  getByGuest(guestName: string): GuestIntelligence[] {
    const normalizedName = guestName.toLowerCase();
    const ids = this.byGuest.get(normalizedName) || [];
    return ids.map((id) => this.items.get(id)).filter(Boolean) as GuestIntelligence[];
  }

  /**
   * Get all records, optionally limited.
   */
  getAll(limit?: number): GuestIntelligence[] {
    const all = Array.from(this.items.values());
    // Sort by captured time, most recent first
    all.sort((a, b) => b.capturedAt.getTime() - a.capturedAt.getTime());
    return limit ? all.slice(0, limit) : all;
  }

  /**
   * Get recent records from the last N minutes.
   */
  getRecent(minutes: number = 30): GuestIntelligence[] {
    const cutoff = Date.now() - minutes * 60 * 1000;
    return this.getAll().filter((record) => record.capturedAt.getTime() > cutoff);
  }

  /**
   * Clear all records (for testing).
   */
  clear(): void {
    this.items.clear();
    this.byRoom.clear();
    this.byGuest.clear();
  }

  /**
   * Get count of records.
   */
  get size(): number {
    return this.items.size;
  }
}

// Singleton instance
export const intelligenceStore = new IntelligenceStore();
