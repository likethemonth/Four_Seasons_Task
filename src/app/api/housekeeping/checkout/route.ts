import { NextResponse } from 'next/server';
import { processCheckout } from '@/lib/housekeeping/queue';
import { housekeepingStore } from '@/lib/store/housekeeping';

/**
 * POST /api/housekeeping/checkout
 * Trigger a checkout event and add room to queue.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomNumber, nextArrival, nextGuestName, nextGuestVip } = body;

    if (!roomNumber) {
      return NextResponse.json(
        { success: false, error: 'Room number is required' },
        { status: 400 }
      );
    }

    // Check if room is already in queue
    const existing = housekeepingStore.getByRoom(roomNumber);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Room already in queue', existing },
        { status: 409 }
      );
    }

    const task = processCheckout({
      roomNumber,
      nextArrival: nextArrival ? new Date(nextArrival) : undefined,
      nextGuestName,
      nextGuestVip,
    });

    return NextResponse.json({
      success: true,
      data: task,
      message: task.assignedTo
        ? `Room ${roomNumber} added to queue and assigned`
        : `Room ${roomNumber} added to queue (awaiting assignment)`,
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}
