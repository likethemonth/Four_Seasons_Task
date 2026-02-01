import { describe, it, expect } from 'vitest';
import {
  calculatePriority,
  calculateFloorMatch,
  getPriorityLevel,
  PRIORITY_WEIGHTS,
} from '@/lib/housekeeping/priority';

describe('calculatePriority', () => {
  it('returns base score for standard room with no special factors', () => {
    const score = calculatePriority({
      roomType: 'standard',
      nextGuestVip: false,
      nextArrival: undefined,
    });

    expect(score).toBe(PRIORITY_WEIGHTS.BASE);
  });

  it('adds suite bonus for suite rooms', () => {
    const score = calculatePriority({
      roomType: 'suite',
      nextGuestVip: false,
      nextArrival: undefined,
    });

    expect(score).toBe(PRIORITY_WEIGHTS.BASE + PRIORITY_WEIGHTS.SUITE);
  });

  it('adds VIP bonus when next guest is VIP', () => {
    const score = calculatePriority({
      roomType: 'standard',
      nextGuestVip: true,
      nextArrival: undefined,
    });

    expect(score).toBe(PRIORITY_WEIGHTS.BASE + PRIORITY_WEIGHTS.VIP_ARRIVING);
  });

  it('adds urgent arrival bonus when arrival is within 2 hours', () => {
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    const score = calculatePriority({
      roomType: 'standard',
      nextGuestVip: false,
      nextArrival: oneHourFromNow,
    });

    expect(score).toBe(PRIORITY_WEIGHTS.BASE + PRIORITY_WEIGHTS.ARRIVAL_URGENT);
  });

  it('does not add urgent bonus when arrival is more than 2 hours away', () => {
    const threeHoursFromNow = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const score = calculatePriority({
      roomType: 'standard',
      nextGuestVip: false,
      nextArrival: threeHoursFromNow,
    });

    expect(score).toBe(PRIORITY_WEIGHTS.BASE);
  });

  it('gives highest priority to suites with VIP arriving soon', () => {
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    const score = calculatePriority({
      roomType: 'suite',
      nextGuestVip: true,
      nextArrival: oneHourFromNow,
    });

    const expectedScore =
      PRIORITY_WEIGHTS.BASE +
      PRIORITY_WEIGHTS.SUITE +
      PRIORITY_WEIGHTS.VIP_ARRIVING +
      PRIORITY_WEIGHTS.ARRIVAL_URGENT;

    expect(score).toBe(expectedScore);
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it('adds deluxe bonus for deluxe rooms', () => {
    const score = calculatePriority({
      roomType: 'deluxe',
      nextGuestVip: false,
      nextArrival: undefined,
    });

    expect(score).toBe(PRIORITY_WEIGHTS.BASE + PRIORITY_WEIGHTS.DELUXE);
  });
});

describe('calculateFloorMatch', () => {
  it('returns full bonus when on same floor', () => {
    const bonus = calculateFloorMatch({
      taskFloor: 4,
      housekeeperFloor: 4,
    });

    expect(bonus).toBe(PRIORITY_WEIGHTS.SAME_FLOOR);
  });

  it('returns zero when on different floors', () => {
    const bonus = calculateFloorMatch({
      taskFloor: 4,
      housekeeperFloor: 7,
    });

    expect(bonus).toBe(0);
  });

  it('returns partial bonus for adjacent floors', () => {
    const bonus = calculateFloorMatch({
      taskFloor: 4,
      housekeeperFloor: 5,
    });

    expect(bonus).toBe(PRIORITY_WEIGHTS.ADJACENT_FLOOR);
  });

  it('handles floor 3 and 5 as adjacent to 4', () => {
    const bonusAbove = calculateFloorMatch({
      taskFloor: 4,
      housekeeperFloor: 5,
    });
    const bonusBelow = calculateFloorMatch({
      taskFloor: 4,
      housekeeperFloor: 3,
    });

    expect(bonusAbove).toBe(PRIORITY_WEIGHTS.ADJACENT_FLOOR);
    expect(bonusBelow).toBe(PRIORITY_WEIGHTS.ADJACENT_FLOOR);
  });
});

describe('getPriorityLevel', () => {
  it('returns "high" for scores 80 and above', () => {
    expect(getPriorityLevel(80)).toBe('high');
    expect(getPriorityLevel(100)).toBe('high');
    expect(getPriorityLevel(95)).toBe('high');
  });

  it('returns "medium" for scores 50-79', () => {
    expect(getPriorityLevel(50)).toBe('medium');
    expect(getPriorityLevel(65)).toBe('medium');
    expect(getPriorityLevel(79)).toBe('medium');
  });

  it('returns "low" for scores below 50', () => {
    expect(getPriorityLevel(10)).toBe('low');
    expect(getPriorityLevel(30)).toBe('low');
    expect(getPriorityLevel(49)).toBe('low');
  });
});

describe('priority scoring integration', () => {
  it('correctly ranks rooms by priority', () => {
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    const fourHoursFromNow = new Date(Date.now() + 4 * 60 * 60 * 1000);

    const vipSuiteUrgent = calculatePriority({
      roomType: 'suite',
      nextGuestVip: true,
      nextArrival: oneHourFromNow,
    });

    const vipStandardUrgent = calculatePriority({
      roomType: 'standard',
      nextGuestVip: true,
      nextArrival: oneHourFromNow,
    });

    const standardNotUrgent = calculatePriority({
      roomType: 'standard',
      nextGuestVip: false,
      nextArrival: fourHoursFromNow,
    });

    expect(vipSuiteUrgent).toBeGreaterThan(vipStandardUrgent);
    expect(vipStandardUrgent).toBeGreaterThan(standardNotUrgent);
  });
});
