import { describe, it, expect } from 'vitest';
import { parseGuestIntelligenceMock } from '@/lib/ai/parser';

describe('parseGuestIntelligence (mock)', () => {
  it('extracts basic guest info (name and room)', () => {
    const input = "Mr. Chen 412 - wife's 40th birthday";
    const result = parseGuestIntelligenceMock(input);

    expect(result.guestName).toBe('Mr. Chen');
    expect(result.roomNumber).toBe('412');
  });

  it('extracts occasion information', () => {
    const input = "Mr. Chen 412 - wife's 40th birthday";
    const result = parseGuestIntelligenceMock(input);

    expect(result.occasion).toBe("Wife's 40th birthday");
  });

  it('extracts dietary restrictions', () => {
    const input = 'Mrs. Tanaka 508 - nut allergy, vegan';
    const result = parseGuestIntelligenceMock(input);

    expect(result.dietary).toContain('nut allergy');
    expect(result.dietary).toContain('vegan');
  });

  it('extracts preferences (likes, favorites)', () => {
    const input = 'Mr. Chen 412 - loves peonies, prefers quiet room';
    const result = parseGuestIntelligenceMock(input);

    expect(result.preferences).toContain('peonies');
    expect(result.preferences).toContain('quiet room');
  });

  it('extracts service requests', () => {
    const input = 'Mr. Chen 412 - asked about late spa availability';
    const result = parseGuestIntelligenceMock(input);

    expect(result.requests).toContain('late spa availability');
  });

  it('extracts multiple preference types from single message', () => {
    const input =
      "Mr. Chen 412 - wife's 40th birthday, vegetarian, loves peonies, asked about late spa";
    const result = parseGuestIntelligenceMock(input);

    expect(result.guestName).toBe('Mr. Chen');
    expect(result.roomNumber).toBe('412');
    expect(result.occasion).toBe("Wife's 40th birthday");
    expect(result.dietary).toContain('vegetarian');
    expect(result.preferences).toContain('peonies');
    expect(result.requests).toContain('late spa');
  });

  it('handles anniversary occasions', () => {
    const input = 'Dr. Smith 720 - 25th wedding anniversary celebration';
    const result = parseGuestIntelligenceMock(input);

    expect(result.guestName).toBe('Dr. Smith');
    expect(result.roomNumber).toBe('720');
    expect(result.occasion).toBe('25th wedding anniversary');
  });

  it('handles multiple dietary restrictions', () => {
    const input = 'Ms. Johnson 305 - gluten-free, dairy-free, no shellfish';
    const result = parseGuestIntelligenceMock(input);

    expect(result.dietary).toHaveLength(3);
    expect(result.dietary).toContain('gluten-free');
    expect(result.dietary).toContain('dairy-free');
    expect(result.dietary).toContain('no shellfish');
  });

  it('returns confidence score', () => {
    const input = "Mr. Chen 412 - wife's 40th birthday";
    const result = parseGuestIntelligenceMock(input);

    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('handles partial information gracefully', () => {
    const input = 'Guest in 412 mentioned birthday';
    const result = parseGuestIntelligenceMock(input);

    expect(result.roomNumber).toBe('412');
    expect(result.occasion).toContain('birthday');
    // Lower confidence when name is missing
    expect(result.confidence).toBeLessThan(0.9);
  });

  it('handles common dietary terms', () => {
    const input = 'Mr. Park 602 - vegetarian, kosher';
    const result = parseGuestIntelligenceMock(input);

    expect(result.dietary).toContain('vegetarian');
    expect(result.dietary).toContain('kosher');
  });

  it('extracts honeymoon as occasion', () => {
    const input = 'Mr. & Mrs. Williams 801 - honeymoon, champagne lovers';
    const result = parseGuestIntelligenceMock(input);

    expect(result.occasion).toBe('Honeymoon');
    expect(result.preferences).toContain('champagne');
  });
});
