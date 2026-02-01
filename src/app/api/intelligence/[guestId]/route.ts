import { NextResponse } from 'next/server';
import { intelligenceStore } from '@/lib/store/intelligence';

interface RouteParams {
  params: Promise<{ guestId: string }>;
}

/**
 * GET /api/intelligence/[guestId]
 * Retrieve intelligence for a specific guest or room.
 */
export async function GET(request: Request, { params }: RouteParams) {
  const { guestId } = await params;

  // Check if it's a room number (digits only)
  const isRoom = /^\d+$/.test(guestId);

  const records = isRoom
    ? intelligenceStore.getByRoom(guestId)
    : intelligenceStore.getByGuest(guestId);

  if (records.length === 0) {
    return NextResponse.json(
      { success: false, error: 'No intelligence found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: records,
    count: records.length,
  });
}
