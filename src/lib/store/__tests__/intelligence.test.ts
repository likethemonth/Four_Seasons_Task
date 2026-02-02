import { describe, it, expect, beforeEach } from 'vitest';
import { intelligenceStore } from '../intelligence';

describe('IntelligenceStore', () => {
  describe('seed data', () => {
    it('should initialize with seed data', () => {
      expect(intelligenceStore.size).toBeGreaterThan(0);
    });

    it('should have at least 5 sample records', () => {
      expect(intelligenceStore.size).toBeGreaterThanOrEqual(5);
    });

    it('should have records with required fields', () => {
      const records = intelligenceStore.getAll();

      records.forEach((record) => {
        expect(record.id).toBeDefined();
        expect(record.guestName).toBeDefined();
        expect(record.roomNumber).toBeDefined();
        expect(record.capturedBy).toBeDefined();
        expect(record.capturedAt).toBeInstanceOf(Date);
        expect(record.source).toBeDefined();
        expect(record.confidence).toBeGreaterThanOrEqual(0);
        expect(record.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should have records with various occasions', () => {
      const records = intelligenceStore.getAll();
      const occasions = records
        .map((r) => r.occasion)
        .filter(Boolean);

      expect(occasions.length).toBeGreaterThan(0);
    });

    it('should have records with dietary preferences', () => {
      const records = intelligenceStore.getAll();
      const recordsWithDietary = records.filter(
        (r) => r.dietary && r.dietary.length > 0
      );

      expect(recordsWithDietary.length).toBeGreaterThan(0);
    });

    it('should have records captured by different staff members', () => {
      const records = intelligenceStore.getAll();
      const staffMembers = new Set(records.map((r) => r.capturedBy));

      expect(staffMembers.size).toBeGreaterThan(1);
    });
  });

  describe('getAll', () => {
    it('should return records sorted by capturedAt (most recent first)', () => {
      const records = intelligenceStore.getAll();

      for (let i = 1; i < records.length; i++) {
        const currentTime = records[i].capturedAt.getTime();
        const previousTime = records[i - 1].capturedAt.getTime();
        expect(previousTime).toBeGreaterThanOrEqual(currentTime);
      }
    });

    it('should respect limit parameter', () => {
      const limit = 3;
      const records = intelligenceStore.getAll(limit);

      expect(records.length).toBeLessThanOrEqual(limit);
    });
  });

  describe('indexing', () => {
    it('should retrieve records by room number', () => {
      const allRecords = intelligenceStore.getAll();
      const roomNumber = allRecords[0].roomNumber;

      const roomRecords = intelligenceStore.getByRoom(roomNumber);

      expect(roomRecords.length).toBeGreaterThan(0);
      roomRecords.forEach((record) => {
        expect(record.roomNumber).toBe(roomNumber);
      });
    });

    it('should retrieve records by guest name', () => {
      const allRecords = intelligenceStore.getAll();
      const guestName = allRecords[0].guestName;

      const guestRecords = intelligenceStore.getByGuest(guestName);

      expect(guestRecords.length).toBeGreaterThan(0);
      guestRecords.forEach((record) => {
        expect(record.guestName.toLowerCase()).toBe(guestName.toLowerCase());
      });
    });
  });
});
