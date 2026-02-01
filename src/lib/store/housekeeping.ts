import type { HousekeepingTask, TaskStatus } from '@/lib/housekeeping/types';
import {
  calculatePriority,
  getPriorityLevel,
} from '@/lib/housekeeping/priority';

/**
 * In-memory store for housekeeping queue.
 * In production, this would be replaced with a database.
 */
class HousekeepingStore {
  private tasks: Map<string, HousekeepingTask> = new Map();

  /**
   * Add a new room to the housekeeping queue.
   */
  addRoom(input: {
    roomNumber: string;
    roomType: HousekeepingTask['roomType'];
    floor: number;
    checkoutTime: Date;
    nextArrival?: Date;
    nextGuestVip?: boolean;
    nextGuestPreferences?: string[];
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
   */
  assign(taskId: string, housekeeperIds: string[]): HousekeepingTask | undefined {
    const task = this.tasks.get(taskId);
    if (!task) return undefined;

    task.assignedTo = housekeeperIds;
    task.status = 'assigned';
    return task;
  }

  /**
   * Update task status.
   */
  updateStatus(taskId: string, status: TaskStatus): HousekeepingTask | undefined {
    const task = this.tasks.get(taskId);
    if (!task) return undefined;

    task.status = status;
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
