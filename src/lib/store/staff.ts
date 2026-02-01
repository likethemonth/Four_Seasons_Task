import type { Housekeeper, HousekeeperStatus } from '@/lib/housekeeping/types';

/**
 * In-memory store for housekeeper staff.
 * In production, this would be replaced with a database.
 */
class StaffStore {
  private housekeepers: Map<string, Housekeeper> = new Map();

  /**
   * Initialize with default housekeepers.
   */
  constructor() {
    this.initializeDefaults();
  }

  /**
   * Set up default housekeepers for demo.
   */
  private initializeDefaults(): void {
    const defaults: Housekeeper[] = [
      {
        id: 'hk_maria',
        name: 'Maria Santos',
        currentFloor: 4,
        assignedRooms: 0,
        status: 'available',
      },
      {
        id: 'hk_jun',
        name: 'Jun Park',
        currentFloor: 4,
        assignedRooms: 0,
        status: 'available',
      },
      {
        id: 'hk_sarah',
        name: 'Sarah Johnson',
        currentFloor: 5,
        assignedRooms: 0,
        status: 'available',
      },
      {
        id: 'hk_david',
        name: 'David Chen',
        currentFloor: 5,
        assignedRooms: 0,
        status: 'available',
      },
      {
        id: 'hk_anna',
        name: 'Anna Kowalski',
        currentFloor: 7,
        assignedRooms: 0,
        status: 'available',
      },
      {
        id: 'hk_carlos',
        name: 'Carlos Rivera',
        currentFloor: 7,
        assignedRooms: 0,
        status: 'available',
      },
      {
        id: 'hk_lisa',
        name: 'Lisa Thompson',
        currentFloor: 8,
        assignedRooms: 0,
        status: 'break',
      },
      {
        id: 'hk_michael',
        name: 'Michael Brown',
        currentFloor: 8,
        assignedRooms: 0,
        status: 'available',
      },
    ];

    for (const hk of defaults) {
      this.housekeepers.set(hk.id, hk);
    }
  }

  /**
   * Get a housekeeper by ID.
   */
  get(id: string): Housekeeper | undefined {
    return this.housekeepers.get(id);
  }

  /**
   * Get all housekeepers.
   */
  getAll(): Housekeeper[] {
    return Array.from(this.housekeepers.values());
  }

  /**
   * Get available housekeepers.
   */
  getAvailable(): Housekeeper[] {
    return this.getAll().filter((hk) => hk.status === 'available');
  }

  /**
   * Get available housekeepers on a specific floor.
   */
  getAvailableOnFloor(floor: number): Housekeeper[] {
    return this.getAvailable().filter((hk) => hk.currentFloor === floor);
  }

  /**
   * Get housekeepers by status.
   */
  getByStatus(status: HousekeeperStatus): Housekeeper[] {
    return this.getAll().filter((hk) => hk.status === status);
  }

  /**
   * Update housekeeper status.
   */
  updateStatus(id: string, status: HousekeeperStatus): Housekeeper | undefined {
    const hk = this.housekeepers.get(id);
    if (!hk) return undefined;

    hk.status = status;
    return hk;
  }

  /**
   * Update housekeeper floor.
   */
  updateFloor(id: string, floor: number): Housekeeper | undefined {
    const hk = this.housekeepers.get(id);
    if (!hk) return undefined;

    hk.currentFloor = floor;
    return hk;
  }

  /**
   * Assign a room to housekeepers.
   */
  assignRoom(ids: string[]): void {
    for (const id of ids) {
      const hk = this.housekeepers.get(id);
      if (hk) {
        hk.assignedRooms++;
        if (hk.assignedRooms > 0) {
          hk.status = 'busy';
        }
      }
    }
  }

  /**
   * Complete a room assignment.
   */
  completeRoom(ids: string[], floor: number): void {
    for (const id of ids) {
      const hk = this.housekeepers.get(id);
      if (hk) {
        hk.assignedRooms = Math.max(0, hk.assignedRooms - 1);
        hk.currentFloor = floor;
        if (hk.assignedRooms === 0) {
          hk.status = 'available';
        }
      }
    }
  }

  /**
   * Reset all housekeepers to defaults.
   */
  reset(): void {
    this.housekeepers.clear();
    this.initializeDefaults();
  }

  /**
   * Get summary counts.
   */
  getCounts(): Record<HousekeeperStatus, number> {
    const counts: Record<HousekeeperStatus, number> = {
      available: 0,
      busy: 0,
      break: 0,
    };

    for (const hk of this.housekeepers.values()) {
      counts[hk.status]++;
    }

    return counts;
  }
}

// Singleton instance
export const staffStore = new StaffStore();
