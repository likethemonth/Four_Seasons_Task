import type {
  HousekeepingTask,
  TaskStatus,
  OperaVipCode,
  ROOM_TYPE_TO_OPERA,
  STATUS_TO_OPERA,
} from '@/lib/housekeeping/types';
import {
  calculatePriority,
  getPriorityLevel,
} from '@/lib/housekeeping/priority';

// Import the mapping constants
const ROOM_TYPE_OPERA_MAP: Record<string, string> = {
  suite: 'SUI',
  deluxe: 'DLX',
  standard: 'STD',
};

const STATUS_OPERA_MAP: Record<TaskStatus, string> = {
  pending: 'DI',
  assigned: 'DI',
  in_progress: 'PU',
  complete: 'IP',
};

/**
 * Map boolean VIP flag to OPERA VIP code.
 */
function mapVipToOperaCode(isVip: boolean): OperaVipCode {
  return isVip ? 'VIP1' : '';
}

/**
 * In-memory store for housekeeping queue.
 * In production, this would be replaced with OPERA PMS integration.
 */
class HousekeepingStore {
  private tasks: Map<string, HousekeepingTask> = new Map();

  /**
   * Add a new room to the housekeeping queue.
   * Automatically enriches with OPERA PMS compatible fields.
   */
  addRoom(input: {
    roomNumber: string;
    roomType: HousekeepingTask['roomType'];
    floor: number;
    checkoutTime: Date;
    nextArrival?: Date;
    nextGuestVip?: boolean;
    nextGuestPreferences?: string[];
    // Optional OPERA fields for direct integration
    operaRoomId?: number;
    operaResvNameId?: number;
    operaVipCode?: OperaVipCode;
  }): HousekeepingTask {
    const id = `hk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const priority = calculatePriority({
      roomType: input.roomType,
      nextGuestVip: input.nextGuestVip ?? false,
      nextArrival: input.nextArrival,
    });

    const task: HousekeepingTask = {
      id,
      roomNumber: input.roomNumber,
      roomType: input.roomType,
      floor: input.floor,
      checkoutTime: input.checkoutTime,
      nextArrival: input.nextArrival,
      nextGuestVip: input.nextGuestVip ?? false,
      nextGuestPreferences: input.nextGuestPreferences,
      priority,
      priorityLevel: getPriorityLevel(priority),
      status: 'pending',

      // OPERA PMS compatible fields
      opera: {
        roomId: input.operaRoomId,
        resvNameId: input.operaResvNameId,
        roomStatus: 'VAC',  // Vacant after checkout
        foStatus: 'VAC',
        hkStatus: 'DI',     // Dirty - needs cleaning
        roomClass: ROOM_TYPE_OPERA_MAP[input.roomType] as 'SUI' | 'DLX' | 'STD',
        vipCode: input.operaVipCode || mapVipToOperaCode(input.nextGuestVip ?? false),
      },
    };

    this.tasks.set(id, task);
    return task;
  }

  /**
   * Get a task by ID.
   */
  get(id: string): HousekeepingTask | undefined {
    return this.tasks.get(id);
  }

  /**
   * Get task by room number.
   */
  getByRoom(roomNumber: string): HousekeepingTask | undefined {
    return Array.from(this.tasks.values()).find(
      (task) => task.roomNumber === roomNumber && task.status !== 'complete'
    );
  }

  /**
   * Get all pending tasks sorted by priority (highest first).
   */
  getPending(): HousekeepingTask[] {
    return Array.from(this.tasks.values())
      .filter((task) => task.status === 'pending')
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get all tasks sorted by priority.
   */
  getQueue(): HousekeepingTask[] {
    return Array.from(this.tasks.values())
      .filter((task) => task.status !== 'complete')
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get all tasks including completed.
   */
  getAll(): HousekeepingTask[] {
    return Array.from(this.tasks.values()).sort(
      (a, b) => b.priority - a.priority
    );
  }

  /**
   * Assign task to housekeepers.
   * Optionally accepts OPERA attendant ID for PMS sync.
   */
  assign(
    taskId: string,
    housekeeperIds: string[],
    operaAttendantId?: number
  ): HousekeepingTask | undefined {
    const task = this.tasks.get(taskId);
    if (!task) return undefined;

    task.assignedTo = housekeeperIds;
    task.status = 'assigned';

    // Sync OPERA fields
    if (task.opera && operaAttendantId) {
      task.opera.attendantId = operaAttendantId;
    }

    return task;
  }

  /**
   * Update task status.
   * Automatically syncs OPERA housekeeping status.
   */
  updateStatus(taskId: string, status: TaskStatus): HousekeepingTask | undefined {
    const task = this.tasks.get(taskId);
    if (!task) return undefined;

    task.status = status;

    // Sync OPERA housekeeping status
    if (task.opera) {
      task.opera.hkStatus = STATUS_OPERA_MAP[status] as 'CL' | 'DI' | 'IP' | 'PU';
      // Update room status based on housekeeping status
      if (status === 'complete') {
        task.opera.roomStatus = 'IP';  // Inspected
      }
    }

    return task;
  }

  /**
   * Recalculate priorities for all pending tasks.
   * Call this periodically as arrival times approach.
   */
  recalculatePriorities(): void {
    for (const task of this.tasks.values()) {
      if (task.status === 'pending' || task.status === 'assigned') {
        task.priority = calculatePriority({
          roomType: task.roomType,
          nextGuestVip: task.nextGuestVip,
          nextArrival: task.nextArrival,
        });
        task.priorityLevel = getPriorityLevel(task.priority);
      }
    }
  }

  /**
   * Clear all tasks (for testing).
   */
  clear(): void {
    this.tasks.clear();
  }

  /**
   * Get count of tasks by status.
   */
  getCounts(): Record<TaskStatus, number> {
    const counts: Record<TaskStatus, number> = {
      pending: 0,
      assigned: 0,
      in_progress: 0,
      complete: 0,
    };

    for (const task of this.tasks.values()) {
      counts[task.status]++;
    }

    return counts;
  }
}

// Singleton instance
export const housekeepingStore = new HousekeepingStore();
