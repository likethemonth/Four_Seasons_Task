import { NextResponse } from 'next/server';
import { intelligenceStore } from '@/lib/store/intelligence';
import { parseGuestIntelligence, parseGuestIntelligenceMock } from '@/lib/ai/parser';

/**
 * GET /api/intelligence
 * Retrieve all guest intelligence records.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const recent = searchParams.get('recent');

  let records;
  if (recent) {
    const minutes = parseInt(recent, 10) || 30;
    records = intelligenceStore.getRecent(minutes);
  } else if (limit) {
    records = intelligenceStore.getAll(parseInt(limit, 10));
  } else {
    records = intelligenceStore.getAll();
  }

  return NextResponse.json({
    success: true,
    data: records,
    count: records.length,
  });
}

/**
 * POST /api/intelligence
 * Add new guest intelligence from a staff message.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, staffName, useMock } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Parse the message using AI or mock
    const parsed = useMock
      ? parseGuestIntelligenceMock(message)
      : await parseGuestIntelligence(message);

    // Store the result
    const record = intelligenceStore.add(parsed, staffName || 'Unknown Staff');

    return NextResponse.json({
      success: true,
      data: record,
      parsed,
    });
  } catch (error) {
    console.error('Error processing intelligence:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process intelligence' },
      { status: 500 }
    );
  }
}
