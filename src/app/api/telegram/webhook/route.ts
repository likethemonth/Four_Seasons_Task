import { NextResponse } from 'next/server';
import { processUpdate } from '@/lib/telegram/bot';

/**
 * POST /api/telegram/webhook
 * Handle incoming Telegram webhook updates.
 */
export async function POST(request: Request) {
  try {
    const update = await request.json();
    await processUpdate(update);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    // Return 200 even on error to prevent Telegram from retrying
    return NextResponse.json({ success: false });
  }
}

/**
 * GET /api/telegram/webhook
 * Health check endpoint.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    webhook: 'Telegram webhook endpoint',
  });
}
