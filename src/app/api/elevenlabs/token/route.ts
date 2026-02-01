import { NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

/**
 * GET /api/elevenlabs/token
 * Get a signed URL for ElevenLabs conversation.
 */
export async function GET() {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: 'ElevenLabs API key not configured' },
      { status: 500 }
    );
  }

  if (!AGENT_ID) {
    return NextResponse.json(
      { error: 'ElevenLabs Agent ID not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`,
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs API error:', error);
      return NextResponse.json(
        { error: 'Failed to get signed URL' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('Error fetching signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to connect to ElevenLabs' },
      { status: 500 }
    );
  }
}
