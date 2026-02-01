/**
 * Room type classification for priority scoring.
 */
export type RoomType = 'suite' | 'deluxe' | 'standard';

/**
 * Task status for housekeeping queue.
 */
export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'complete';

/**
 * Priority level derived from numeric score.
 */
export type PriorityLevel = 'high' | 'medium' | 'low';

/**
 * Housekeeper availability status.
 */
export type HousekeeperStatus = 'available' | 'busy' | 'break';

/**
 * Housekeeping task representing a room to be cleaned.
 */
export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  checkoutTime: Date;
  nextArrival?: Date;
  nextGuestVip: boolean;
  nextGuestPreferences?: string[];
  priority: number;
  priorityLevel: PriorityLevel;
  assignedTo?: string[];
  status: TaskStatus;
}

/**
 * Housekeeper staff member.
 */
export interface Housekeeper {
  id: string;
  name: string;
  currentFloor: number;
  assignedRooms: number;
  status: HousekeeperStatus;
}

/**
 * Input for calculating task priority.
 */
export interface PriorityInput {
  roomType: RoomType;
  nextGuestVip: boolean;
  nextArrival?: Date;
}

/**
 * Input for calculating floor match bonus.
 */
export interface FloorMatchInput {
  taskFloor: number;
  housekeeperFloor: number;
}
