import { housekeepingStore } from '@/lib/store/housekeeping';
import { staffStore } from '@/lib/store/staff';
import { intelligenceStore } from '@/lib/store/intelligence';
import type { HousekeepingTask, RoomType } from './types';
import { calculateFloorMatch } from './priority';

/**
 * Extract floor number from room number.
 * Assumes room format: first 1-2 digits are floor (e.g., 412 = floor 4, 1201 = floor 12)
 */
export function extractFloor(roomNumber: string): number {
  const num = parseInt(roomNumber, 10);
  if (num >= 1000) {
    return Math.floor(num / 100);
  }
  return Math.floor(num / 100);
}

/**
 * Determine room type from room number.
 * For demo: suites end in 01, deluxe end in 02-05, standard otherwise.
 */
export function determineRoomType(roomNumber: string): RoomType {
  const lastTwo = parseInt(roomNumber.slice(-2), 10);
  if (lastTwo === 1) return 'suite';
  if (lastTwo >= 2 && lastTwo <= 5) return 'deluxe';
  return 'standard';
}

/**
 * Process a checkout event and add room to queue.
 */
export function processCheckout(input: {
  roomNumber: string;
  nextArrival?: Date;
  nextGuestName?: string;
  nextGuestVip?: boolean;
}): HousekeepingTask {
  const floor = extractFloor(input.roomNumber);
  const roomType = determineRoomType(input.roomNumber);

  // Check if we have intelligence for the incoming guest
  let preferences: string[] | undefined;
  if (input.nextGuestName) {
    const intel = intelligenceStore.getByGuest(input.nextGuestName);
    if (intel.length > 0) {
      const latest = intel[0];
      preferences = [
        ...(latest.preferences || []),
        ...(latest.dietary || []),
        ...(latest.requests || []),
      ];
      if (latest.occasion) {
        preferences.unshift(`Occasion: ${latest.occasion}`);
      }
    }
  }

  const task = housekeepingStore.addRoom({
    roomNumber: input.roomNumber,
    roomType,
    floor,
    checkoutTime: new Date(),
    nextArrival: input.nextArrival,
    nextGuestVip: input.nextGuestVip,
    nextGuestPreferences: preferences,
  });

  // Attempt auto-assignment
  autoAssign(task.id);

  return task;
}

/**
 * Auto-assign a task to the best available housekeepers.
 * Assigns in pairs for efficiency.
 */
export function autoAssign(taskId: string): boolean {
  const task = housekeepingStore.get(taskId);
  if (!task || task.status !== 'pending') {
    return false;
  }

  // Get available housekeepers
  const available = staffStore.getAvailable();
  if (available.length < 2) {
    // Not enough staff, leave unassigned
    return false;
  }

  // Score each housekeeper based on floor proximity
  const scored = available.map((hk) => ({
    housekeeper: hk,
    floorBonus: calculateFloorMatch({
      taskFloor: task.floor,
      housekeeperFloor: hk.currentFloor,
    }),
  }));

  // Sort by floor bonus (highest first)
  scored.sort((a, b) => b.floorBonus - a.floorBonus);

  // Take top 2 housekeepers (work in pairs)
  const assigned = scored.slice(0, 2).map((s) => s.housekeeper.id);

  // Update task and staff
  housekeepingStore.assign(taskId, assigned);
  staffStore.assignRoom(assigned);

  // Update staff floor to task floor (they're moving there)
  for (const id of assigned) {
    staffStore.updateFloor(id, task.floor);
  }

  return true;
}

/**
 * Mark a task as in progress.
 */
export function startTask(taskId: string): HousekeepingTask | undefined {
  return housekeepingStore.updateStatus(taskId, 'in_progress');
}

/**
 * Mark a task as complete.
 */
export function completeTask(taskId: string): HousekeepingTask | undefined {
  const task = housekeepingStore.get(taskId);
  if (!task) return undefined;

  // Update staff when task completes
  if (task.assignedTo) {
    staffStore.completeRoom(task.assignedTo, task.floor);
  }

  return housekeepingStore.updateStatus(taskId, 'complete');
}

/**
 * Get current queue status.
 */
export function getQueueStatus() {
  const tasks = housekeepingStore.getQueue();
  const staffCounts = staffStore.getCounts();
  const taskCounts = housekeepingStore.getCounts();

  return {
    tasks,
    staffCounts,
    taskCounts,
    pendingCount: taskCounts.pending,
    inProgressCount: taskCounts.in_progress,
  };
}
