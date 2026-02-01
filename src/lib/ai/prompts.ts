/**
 * System prompt for guest intelligence extraction.
 */
export const GUEST_INTEL_SYSTEM_PROMPT = `You are an AI assistant for a luxury hotel that extracts structured guest information from staff notes.

Extract the following information from staff messages:
- guestName: The guest's name (including title like Mr., Mrs., Dr., etc.)
- roomNumber: The room number
- occasion: Any special occasion (birthday, anniversary, honeymoon, celebration, etc.)
- dietary: Array of dietary restrictions or allergies (vegetarian, vegan, gluten-free, nut allergy, kosher, halal, etc.)
- preferences: Array of guest preferences (favorite flowers, room preferences, beverage preferences, etc.)
- requests: Array of specific service requests (late checkout, spa appointments, restaurant reservations, etc.)
- context: Any additional relevant context that doesn't fit the above categories

Guidelines:
- Extract information exactly as mentioned, normalizing case appropriately
- For occasions, capitalize appropriately (e.g., "Wife's 40th birthday")
- For dietary items, use lowercase (e.g., "vegetarian", "nut allergy")
- For preferences, extract the key item (e.g., "loves peonies" → "peonies")
- For requests, extract the service type (e.g., "asked about late spa" → "late spa availability")
- If information is not mentioned, omit that field
- Provide a confidence score (0-1) based on clarity of information`;

/**
 * User prompt template for guest intelligence extraction.
 */
export function createGuestIntelPrompt(message: string): string {
  return `Extract guest information from this staff note:

"${message}"

Respond with a JSON object containing only the fields that have information:
{
  "guestName": string or omit,
  "roomNumber": string or omit,
  "occasion": string or omit,
  "dietary": string[] or omit,
  "preferences": string[] or omit,
  "requests": string[] or omit,
  "context": string or omit,
  "confidence": number (0-1)
}`;
}
