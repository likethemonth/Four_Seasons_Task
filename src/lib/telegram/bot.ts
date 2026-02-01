import { Bot, Context } from 'grammy';
import { parseGuestIntelligence, parseGuestIntelligenceMock } from '@/lib/ai/parser';
import { intelligenceStore } from '@/lib/store/intelligence';

// Bot instance (lazy initialized)
let bot: Bot | null = null;

/**
 * Get or create the Telegram bot instance.
 */
export function getBot(): Bot {
  if (!bot) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }
    bot = new Bot(token);
    setupHandlers(bot);
  }
  return bot;
}

/**
 * Set up message handlers.
 */
function setupHandlers(bot: Bot): void {
  // Handle text messages
  bot.on('message:text', async (ctx) => {
    await handleTextMessage(ctx);
  });

  // Handle /start command
  bot.command('start', async (ctx) => {
    await ctx.reply(
      'Welcome to Four Seasons Guest Intelligence.\n\n' +
      'Send me guest notes in this format:\n' +
      '"Mr. Chen 412 - wife\'s 40th birthday, vegetarian"\n\n' +
      'I\'ll extract and store the guest preferences automatically.'
    );
  });

  // Handle /help command
  bot.command('help', async (ctx) => {
    await ctx.reply(
      'How to capture guest intelligence:\n\n' +
      '1. Include the guest name (Mr./Mrs./Dr. etc.)\n' +
      '2. Include the room number\n' +
      '3. Add any relevant details:\n' +
      '   - Occasions: birthday, anniversary, honeymoon\n' +
      '   - Dietary: vegetarian, allergies, kosher\n' +
      '   - Preferences: favorite flowers, room requests\n' +
      '   - Service requests: spa, restaurant, late checkout\n\n' +
      'Example:\n' +
      '"Mrs. Tanaka 508 - celebrating anniversary, loves orchids, nut allergy"'
    );
  });
}

/**
 * Handle incoming text messages.
 */
async function handleTextMessage(ctx: Context): Promise<void> {
  const text = ctx.message?.text;
  if (!text) return;

  // Get sender info
  const sender = ctx.from;
  const staffName = sender
    ? `${sender.first_name}${sender.last_name ? ' ' + sender.last_name : ''}`
    : 'Unknown Staff';

  try {
    // Parse the message (use mock for now, switch to real AI with env var)
    const useMock = process.env.USE_MOCK_AI === 'true';
    const parsed = useMock
      ? parseGuestIntelligenceMock(text)
      : await parseGuestIntelligence(text);

    // Store the intelligence
    const record = intelligenceStore.add(parsed, staffName);

    // Build confirmation message
    const parts = [`Guest intelligence captured for ${parsed.guestName}`];

    if (parsed.roomNumber) {
      parts.push(`Room: ${parsed.roomNumber}`);
    }
    if (parsed.occasion) {
      parts.push(`Occasion: ${parsed.occasion}`);
    }
    if (parsed.dietary?.length) {
      parts.push(`Dietary: ${parsed.dietary.join(', ')}`);
    }
    if (parsed.preferences?.length) {
      parts.push(`Preferences: ${parsed.preferences.join(', ')}`);
    }
    if (parsed.requests?.length) {
      parts.push(`Requests: ${parsed.requests.join(', ')}`);
    }

    parts.push(`\nConfidence: ${Math.round(parsed.confidence * 100)}%`);
    parts.push(`ID: ${record.id}`);

    await ctx.reply(parts.join('\n'));
  } catch (error) {
    console.error('Error processing message:', error);
    await ctx.reply(
      'Sorry, I had trouble processing that message. Please try again.'
    );
  }
}

/**
 * Process a webhook update.
 */
export async function processUpdate(update: unknown): Promise<void> {
  const bot = getBot();
  await bot.handleUpdate(update as Parameters<Bot['handleUpdate']>[0]);
}
