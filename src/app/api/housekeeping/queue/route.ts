import { NextResponse } from 'next/server';
import { getQueueStatus } from '@/lib/housekeeping/queue';
import { housekeepingStore } from '@/lib/store/housekeeping';
import { staffStore } from '@/lib/store/staff';

/**
 * GET /api/housekeeping/queue
 * Get current housekeeping queue status.
 */
export async function GET() {
  // Recalculate priorities (arrival times may have become urgent)
  housekeepingStore.recalculatePriorities();

  const status = getQueueStatus();
  const staff = staffStore.getAll();

  return NextResponse.json({
    success: true,
    data: {
      queue: status.tasks,
      staff,
      summary: {
        pending: status.pendingCount,
        inProgress: status.inProgressCount,
        staffAvailable: status.staffCounts.available,
        staffBusy: status.staffCounts.busy,
        staffOnBreak: status.staffCounts.break,
      },
    },
  });
}
