import type {
  PriorityInput,
  FloorMatchInput,
  PriorityLevel,
} from './types';

/**
 * Priority weight constants for housekeeping task scoring.
 */
export const PRIORITY_WEIGHTS = {
  BASE: 10,
  SUITE: 30,
  DELUXE: 15,
  VIP_ARRIVING: 20,
  ARRIVAL_URGENT: 20, // Within 2 hours
  SAME_FLOOR: 50,
  ADJACENT_FLOOR: 25,
} as const;

/**
 * Threshold in milliseconds for urgent arrivals (2 hours).
 */
const URGENT_ARRIVAL_THRESHOLD_MS = 2 * 60 * 60 * 1000;

/**
 * Calculate priority score for a housekeeping task.
 * Higher scores indicate higher priority.
 */
export function calculatePriority(input: PriorityInput): number {
  let score = PRIORITY_WEIGHTS.BASE;

  // Room type bonus
  if (input.roomType === 'suite') {
    score += PRIORITY_WEIGHTS.SUITE;
  } else if (input.roomType === 'deluxe') {
    score += PRIORITY_WEIGHTS.DELUXE;
  }

  // VIP guest bonus
  if (input.nextGuestVip) {
    score += PRIORITY_WEIGHTS.VIP_ARRIVING;
  }

  // Urgent arrival bonus
  if (input.nextArrival) {
    const timeUntilArrival = input.nextArrival.getTime() - Date.now();
    if (timeUntilArrival <= URGENT_ARRIVAL_THRESHOLD_MS && timeUntilArrival > 0) {
      score += PRIORITY_WEIGHTS.ARRIVAL_URGENT;
    }
  }

  return score;
}

/**
 * Calculate floor match bonus for assigning a task to a housekeeper.
 */
export function calculateFloorMatch(input: FloorMatchInput): number {
  const floorDifference = Math.abs(input.taskFloor - input.housekeeperFloor);

  if (floorDifference === 0) {
    return PRIORITY_WEIGHTS.SAME_FLOOR;
  }

  if (floorDifference === 1) {
    return PRIORITY_WEIGHTS.ADJACENT_FLOOR;
  }

  return 0;
}

/**
 * Convert numeric priority score to priority level.
 */
export function getPriorityLevel(score: number): PriorityLevel {
  if (score >= 80) {
    return 'high';
  }
  if (score >= 50) {
    return 'medium';
  }
  return 'low';
}
