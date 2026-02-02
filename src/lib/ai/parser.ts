import Anthropic from '@anthropic-ai/sdk';
import type { ParsedGuestIntel } from './types';
import { enrichWithOperaCodes } from './types';
import { GUEST_INTEL_SYSTEM_PROMPT, createGuestIntelPrompt } from './prompts';

let anthropicClient: Anthropic | null = null;

/**
 * Get or create the Anthropic client instance.
 */
function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic();
  }
  return anthropicClient;
}

/**
 * Parse a staff message to extract guest intelligence using Claude.
 */
export async function parseGuestIntelligence(
  message: string
): Promise<ParsedGuestIntel> {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: GUEST_INTEL_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: createGuestIntelPrompt(message),
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  const parsed = JSON.parse(jsonMatch[0]) as ParsedGuestIntel;

  // Ensure required fields have defaults
  const result: ParsedGuestIntel = {
    guestName: parsed.guestName || 'Unknown Guest',
    roomNumber: parsed.roomNumber || '',
    occasion: parsed.occasion,
    dietary: parsed.dietary,
    preferences: parsed.preferences,
    requests: parsed.requests,
    context: parsed.context,
    confidence: parsed.confidence ?? 0.5,
  };

  // Enrich with OPERA PMS codes for compatibility
  return enrichWithOperaCodes(result);
}

/**
 * Parse guest intelligence with a mock implementation for testing.
 * Uses pattern matching instead of AI for deterministic results.
 */
export function parseGuestIntelligenceMock(message: string): ParsedGuestIntel {
  const result: ParsedGuestIntel = {
    guestName: 'Unknown Guest',
    roomNumber: '',
    confidence: 0.5,
  };

  // Extract room number (3-4 digits)
  const roomMatch = message.match(/\b(\d{3,4})\b/);
  if (roomMatch) {
    result.roomNumber = roomMatch[1];
  }

  // Extract guest name (Mr./Mrs./Ms./Dr. followed by name)
  const nameMatch = message.match(
    /(?:Mr\.|Mrs\.|Ms\.|Dr\.|Mr\s&\sMrs\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/
  );
  if (nameMatch) {
    const title = message.match(/(?:Mr\.|Mrs\.|Ms\.|Dr\.|Mr\s&\sMrs\.)/)?.[0] || '';
    result.guestName = `${title} ${nameMatch[1]}`.trim();
    result.confidence = 0.9;
  } else if (message.toLowerCase().includes('guest')) {
    result.guestName = 'Unknown Guest';
    result.confidence = 0.6;
  }

  // Extract occasion
  const occasionPatterns = [
    { pattern: /(\d+)(?:th|st|nd|rd)?\s+(?:wedding\s+)?anniversary/i, format: (m: RegExpMatchArray) => `${m[1]}th wedding anniversary` },
    { pattern: /wife['']?s?\s+(\d+)(?:th|st|nd|rd)?\s+birthday/i, format: (m: RegExpMatchArray) => `Wife's ${m[1]}th birthday` },
    { pattern: /husband['']?s?\s+(\d+)(?:th|st|nd|rd)?\s+birthday/i, format: (m: RegExpMatchArray) => `Husband's ${m[1]}th birthday` },
    { pattern: /(\d+)(?:th|st|nd|rd)?\s+birthday/i, format: (m: RegExpMatchArray) => `${m[1]}th birthday` },
    { pattern: /honeymoon/i, format: () => 'Honeymoon' },
    { pattern: /birthday/i, format: () => 'birthday' },
    { pattern: /anniversary/i, format: () => 'Anniversary' },
    { pattern: /celebration/i, format: () => 'Celebration' },
  ];

  for (const { pattern, format } of occasionPatterns) {
    const match = message.match(pattern);
    if (match) {
      result.occasion = format(match);
      break;
    }
  }

  // Extract dietary restrictions
  const dietaryTerms = [
    'vegetarian',
    'vegan',
    'gluten-free',
    'gluten free',
    'dairy-free',
    'dairy free',
    'nut allergy',
    'nut-free',
    'kosher',
    'halal',
    'no shellfish',
    'shellfish allergy',
    'lactose intolerant',
  ];

  const foundDietary: string[] = [];
  for (const term of dietaryTerms) {
    if (message.toLowerCase().includes(term)) {
      foundDietary.push(term.replace(' free', '-free'));
    }
  }
  if (foundDietary.length > 0) {
    result.dietary = foundDietary;
  }

  // Extract preferences
  const preferencePatterns = [
    { pattern: /loves?\s+(\w+)/gi, extract: (m: RegExpMatchArray) => m[1].toLowerCase() },
    { pattern: /prefers?\s+(\w+(?:\s+\w+)?)/gi, extract: (m: RegExpMatchArray) => m[1].toLowerCase() },
    { pattern: /(\w+)\s+lovers?/gi, extract: (m: RegExpMatchArray) => m[1].toLowerCase() },
    { pattern: /favorite\s+(\w+)/gi, extract: (m: RegExpMatchArray) => m[1].toLowerCase() },
  ];

  const foundPreferences: string[] = [];
  for (const { pattern, extract } of preferencePatterns) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(message)) !== null) {
      const pref = extract(match);
      if (!foundPreferences.includes(pref)) {
        foundPreferences.push(pref);
      }
    }
  }
  if (foundPreferences.length > 0) {
    result.preferences = foundPreferences;
  }

  // Extract requests
  const requestPatterns = [
    { pattern: /asked\s+(?:about|for)\s+(.+?)(?:,|$)/gi, extract: (m: RegExpMatchArray) => m[1].trim() },
    { pattern: /wants?\s+(.+?)(?:,|$)/gi, extract: (m: RegExpMatchArray) => m[1].trim() },
    { pattern: /needs?\s+(.+?)(?:,|$)/gi, extract: (m: RegExpMatchArray) => m[1].trim() },
    { pattern: /requesting\s+(.+?)(?:,|$)/gi, extract: (m: RegExpMatchArray) => m[1].trim() },
  ];

  const foundRequests: string[] = [];
  for (const { pattern, extract } of requestPatterns) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(message)) !== null) {
      const req = extract(match);
      if (req && !foundRequests.includes(req)) {
        foundRequests.push(req);
      }
    }
  }
  if (foundRequests.length > 0) {
    result.requests = foundRequests;
  }

  // Adjust confidence based on completeness
  let infoCount = 0;
  if (result.guestName !== 'Unknown Guest') infoCount++;
  if (result.roomNumber) infoCount++;
  if (result.occasion) infoCount++;
  if (result.dietary?.length) infoCount++;
  if (result.preferences?.length) infoCount++;
  if (result.requests?.length) infoCount++;

  result.confidence = Math.min(0.95, 0.5 + infoCount * 0.1);

  // Enrich with OPERA PMS codes for compatibility
  return enrichWithOperaCodes(result);
}
