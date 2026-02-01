import { describe, it, expect, beforeEach } from 'vitest';
import {
  extractFloor,
  determineRoomType,
  processCheckout,
  autoAssign,
  getQueueStatus,
} from '@/lib/housekeeping/queue';
import { housekeepingStore } from '@/lib/store/housekeeping';
import { staffStore } from '@/lib/store/staff';

describe('extractFloor', () => {
  it('extracts floor from 3-digit room number', () => {
    expect(extractFloor('412')).toBe(4);
    expect(extractFloor('508')).toBe(5);
    expect(extractFloor('720')).toBe(7);
  });

  it('extracts floor from 4-digit room number', () => {
    expect(extractFloor('1201')).toBe(12);
    expect(extractFloor('1505')).toBe(15);
  });
});

describe('determineRoomType', () => {
  it('identifies suites (ending in 01)', () => {
    expect(determineRoomType('801')).toBe('suite');
    expect(determineRoomType('1201')).toBe('suite');
  });

  it('identifies deluxe rooms (ending in 02-05)', () => {
    expect(determineRoomType('402')).toBe('deluxe');
    expect(determineRoomType('505')).toBe('deluxe');
  });

  it('identifies standard rooms (other endings)', () => {
    expect(determineRoomType('412')).toBe('standard');
    expect(determineRoomType('720')).toBe('standard');
  });
});

describe('processCheckout', () => {
  beforeEach(() => {
    housekeepingStore.clear();
    staffStore.reset();
  });

  it('adds room to queue with correct priority', () => {
    const task = processCheckout({
      roomNumber: '412',
      nextGuestVip: false,
    });

    expect(task.roomNumber).toBe('412');
    expect(task.floor).toBe(4);
    expect(task.roomType).toBe('standard');
    expect(task.status).toBe('assigned'); // Auto-assigned
  });

  it('gives higher priority to VIP arrivals', () => {
    const regularTask = processCheckout({
      roomNumber: '412',
      nextGuestVip: false,
    });

    housekeepingStore.clear();
    staffStore.reset();

    const vipTask = processCheckout({
      roomNumber: '413',
      nextGuestVip: true,
    });

    expect(vipTask.priority).toBeGreaterThan(regularTask.priority);
  });

  it('gives higher priority to suites', () => {
    const standardTask = processCheckout({
      roomNumber: '412',
      nextGuestVip: false,
    });

    housekeepingStore.clear();
    staffStore.reset();

    const suiteTask = processCheckout({
      roomNumber: '801',
      nextGuestVip: false,
    });

    expect(suiteTask.priority).toBeGreaterThan(standardTask.priority);
  });
});

describe('autoAssign', () => {
  beforeEach(() => {
    housekeepingStore.clear();
    staffStore.reset();
  });

  it('assigns two housekeepers to a task', () => {
    const task = housekeepingStore.addRoom({
      roomNumber: '412',
      roomType: 'standard',
      floor: 4,
      checkoutTime: new Date(),
      nextGuestVip: false,
    });

    const assigned = autoAssign(task.id);
    const updatedTask = housekeepingStore.get(task.id);

    expect(assigned).toBe(true);
    expect(updatedTask?.assignedTo).toHaveLength(2);
    expect(updatedTask?.status).toBe('assigned');
  });

  it('prefers housekeepers on the same floor', () => {
    const task = housekeepingStore.addRoom({
      roomNumber: '412',
      roomType: 'standard',
      floor: 4,
      checkoutTime: new Date(),
      nextGuestVip: false,
    });

    autoAssign(task.id);
    const updatedTask = housekeepingStore.get(task.id);

    // Should assign Maria and Jun who are on floor 4
    const assignedStaff = updatedTask?.assignedTo?.map((id) =>
      staffStore.get(id)
    );

    expect(assignedStaff?.some((s) => s?.currentFloor === 4)).toBe(true);
  });
});

describe('getQueueStatus', () => {
  beforeEach(() => {
    housekeepingStore.clear();
    staffStore.reset();
  });

  it('returns empty queue initially', () => {
    const status = getQueueStatus();
    expect(status.tasks).toHaveLength(0);
    expect(status.pendingCount).toBe(0);
  });

  it('returns tasks sorted by priority', () => {
    // Add low priority room
    processCheckout({ roomNumber: '412', nextGuestVip: false });

    // Clear to reset staff, then add high priority
    staffStore.reset();
    processCheckout({ roomNumber: '801', nextGuestVip: true });

    const status = getQueueStatus();
    // Suite + VIP should be first
    expect(status.tasks[0].roomNumber).toBe('801');
  });
});
