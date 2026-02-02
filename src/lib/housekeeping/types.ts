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

// ============================================================================
// OPERA PMS Compatible Types
// ============================================================================

/**
 * OPERA room status codes.
 * @see https://docs.oracle.com/en/industries/hospitality/opera-cloud/
 */
export type OperaRoomStatus = 'OCC' | 'VAC' | 'DI' | 'IP' | 'OOO' | 'OOS';
// OCC = Occupied, VAC = Vacant, DI = Dirty, IP = Inspected
// OOO = Out of Order, OOS = Out of Service

/**
 * OPERA front office status codes.
 */
export type OperaFOStatus = 'VAC' | 'OCC';

/**
 * OPERA housekeeping status codes.
 */
export type OperaHKStatus = 'CL' | 'DI' | 'IP' | 'PU';
// CL = Clean, DI = Dirty, IP = Inspected, PU = Pickup

/**
 * OPERA VIP codes (configurable per property).
 */
export type OperaVipCode = 'VIP1' | 'VIP2' | 'VIP3' | 'VIP4' | 'VIP5' | 'VVIP' | '';

/**
 * OPERA room class codes.
 */
export type OperaRoomClass = 'SUI' | 'DLX' | 'STD' | 'PRE' | 'CLB';
// SUI = Suite, DLX = Deluxe, STD = Standard, PRE = Premium, CLB = Club

/**
 * Mapping between our room types and OPERA room classes.
 */
export const ROOM_TYPE_TO_OPERA: Record<RoomType, OperaRoomClass> = {
  suite: 'SUI',
  deluxe: 'DLX',
  standard: 'STD',
};

/**
 * Mapping between OPERA room classes and our room types.
 */
export const OPERA_TO_ROOM_TYPE: Record<OperaRoomClass, RoomType> = {
  SUI: 'suite',
  DLX: 'deluxe',
  STD: 'standard',
  PRE: 'deluxe',
  CLB: 'suite',
};

/**
 * Mapping between our task status and OPERA housekeeping status.
 */
export const STATUS_TO_OPERA: Record<TaskStatus, OperaHKStatus> = {
  pending: 'DI',
  assigned: 'DI',
  in_progress: 'PU',
  complete: 'IP',
};

/**
 * Mapping between OPERA housekeeping status and our task status.
 */
export const OPERA_TO_STATUS: Record<OperaHKStatus, TaskStatus> = {
  DI: 'pending',
  PU: 'in_progress',
  IP: 'complete',
  CL: 'complete',
};

/**
 * Housekeeping task representing a room to be cleaned.
 * Includes OPERA PMS compatible fields.
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

  // OPERA PMS fields (optional for backward compatibility)
  opera?: {
    roomId?: number;
    resvNameId?: number;
    roomStatus?: OperaRoomStatus;
    foStatus?: OperaFOStatus;
    hkStatus?: OperaHKStatus;
    roomClass?: OperaRoomClass;
    vipCode?: OperaVipCode;
    attendantId?: number;
  };
}

/**
 * Housekeeper staff member.
 * Includes OPERA PMS compatible fields.
 */
export interface Housekeeper {
  id: string;
  name: string;
  currentFloor: number;
  assignedRooms: number;
  status: HousekeeperStatus;

  // OPERA PMS fields (optional for backward compatibility)
  opera?: {
    attendantId?: number;
    attendantCode?: string;
    departmentCode?: string;
  };
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
