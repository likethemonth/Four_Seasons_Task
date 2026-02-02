// ============================================================================
// OPERA PMS Compatible Preference Codes
// ============================================================================

/**
 * OPERA dietary preference codes (configurable per property).
 */
export const OPERA_DIETARY_CODES: Record<string, string> = {
  'vegetarian': 'DIET_VEG',
  'vegan': 'DIET_VGN',
  'gluten-free': 'DIET_GF',
  'gluten free': 'DIET_GF',
  'kosher': 'DIET_KOS',
  'halal': 'DIET_HAL',
  'dairy-free': 'DIET_DF',
  'dairy free': 'DIET_DF',
  'lactose intolerant': 'DIET_DF',
  'nut allergy': 'ALLRG_NUT',
  'nut-free': 'ALLRG_NUT',
  'peanut allergy': 'ALLRG_PNT',
  'shellfish allergy': 'ALLRG_SHL',
  'seafood allergy': 'ALLRG_SEA',
  'egg allergy': 'ALLRG_EGG',
  'soy allergy': 'ALLRG_SOY',
};

/**
 * OPERA room preference codes (configurable per property).
 */
export const OPERA_ROOM_PREF_CODES: Record<string, string> = {
  'high floor': 'ROOM_HI',
  'low floor': 'ROOM_LO',
  'quiet room': 'ROOM_QT',
  'away from elevator': 'ROOM_QT',
  'near elevator': 'ROOM_ELV',
  'connecting rooms': 'ROOM_CON',
  'ocean view': 'ROOM_OV',
  'city view': 'ROOM_CV',
  'garden view': 'ROOM_GV',
  'feather pillows': 'ROOM_FP',
  'hypoallergenic pillows': 'ROOM_HP',
  'firm mattress': 'ROOM_FM',
  'extra towels': 'ROOM_XT',
  'extra pillows': 'ROOM_XP',
};

/**
 * OPERA amenity preference codes.
 */
export const OPERA_AMENITY_CODES: Record<string, string> = {
  'champagne': 'AMEN_CHMP',
  'wine': 'AMEN_WINE',
  'flowers': 'AMEN_FLWR',
  'peonies': 'AMEN_FLWR',
  'roses': 'AMEN_FLWR',
  'fruit': 'AMEN_FRUT',
  'chocolate': 'AMEN_CHOC',
  'spa': 'AMEN_SPA',
  'turndown': 'AMEN_TD',
  'late checkout': 'AMEN_LCO',
  'early checkin': 'AMEN_ECI',
  'airport transfer': 'AMEN_TRF',
};

/**
 * OPERA occasion/special request codes.
 */
export const OPERA_OCCASION_CODES: Record<string, string> = {
  'birthday': 'OCC_BDAY',
  'anniversary': 'OCC_ANNI',
  'honeymoon': 'OCC_HNYM',
  'wedding': 'OCC_WED',
  'engagement': 'OCC_ENG',
  'graduation': 'OCC_GRAD',
  'retirement': 'OCC_RET',
  'business': 'OCC_BIZ',
  'conference': 'OCC_CONF',
  'babymoon': 'OCC_BABY',
};

/**
 * OPERA special request structure.
 */
export interface OperaSpecialRequest {
  code: string;
  description: string;
  category: 'DIETARY' | 'ROOM' | 'AMENITY' | 'OCCASION' | 'OTHER';
}

/**
 * OPERA guest profile structure (subset of full OPERA profile).
 */
export interface OperaGuestProfile {
  profileId?: number;
  nameId?: number;
  nameTitle?: string;
  nameFirst?: string;
  nameLast?: string;
  vipCode?: string;
  membershipType?: string;
  membershipLevel?: string;
  membershipNumber?: string;
  specialRequests?: OperaSpecialRequest[];
  preferences?: string[];  // OPERA preference codes
}

/**
 * Guest intelligence data extracted from staff messages.
 * Includes OPERA PMS compatible fields.
 */
export interface GuestIntelligence {
  id: string;
  guestName: string;
  roomNumber: string;
  occasion?: string;
  dietary?: string[];
  preferences?: string[];
  requests?: string[];
  context?: string;
  capturedBy: string;
  capturedAt: Date;
  source: 'telegram' | 'voice' | 'dashboard';
  confidence: number;

  // OPERA PMS fields (optional for backward compatibility)
  opera?: OperaGuestProfile & {
    specialRequests?: OperaSpecialRequest[];
    dietaryCodes?: string[];      // Mapped OPERA dietary codes
    preferenceCodes?: string[];   // Mapped OPERA preference codes
    occasionCode?: string;        // Mapped OPERA occasion code
  };
}

/**
 * Raw parsed result from AI before enrichment with metadata.
 * Includes OPERA PMS compatible fields.
 */
export interface ParsedGuestIntel {
  guestName: string;
  roomNumber: string;
  occasion?: string;
  dietary?: string[];
  preferences?: string[];
  requests?: string[];
  context?: string;
  confidence: number;

  // OPERA mapped codes (populated by parser)
  operaCodes?: {
    dietaryCodes?: string[];
    preferenceCodes?: string[];
    occasionCode?: string;
  };
}

/**
 * Map free-text dietary preference to OPERA code.
 */
export function mapDietaryToOpera(dietary: string): string | undefined {
  const normalized = dietary.toLowerCase().trim();
  return OPERA_DIETARY_CODES[normalized];
}

/**
 * Map free-text preference to OPERA code.
 */
export function mapPreferenceToOpera(preference: string): string | undefined {
  const normalized = preference.toLowerCase().trim();
  return (
    OPERA_ROOM_PREF_CODES[normalized] ||
    OPERA_AMENITY_CODES[normalized]
  );
}

/**
 * Map occasion text to OPERA code.
 */
export function mapOccasionToOpera(occasion: string): string | undefined {
  const normalized = occasion.toLowerCase();
  for (const [keyword, code] of Object.entries(OPERA_OCCASION_CODES)) {
    if (normalized.includes(keyword)) {
      return code;
    }
  }
  return undefined;
}

/**
 * Convert parsed intel to include OPERA codes.
 */
export function enrichWithOperaCodes(intel: ParsedGuestIntel): ParsedGuestIntel {
  const operaCodes: ParsedGuestIntel['operaCodes'] = {};

  if (intel.dietary?.length) {
    operaCodes.dietaryCodes = intel.dietary
      .map(mapDietaryToOpera)
      .filter((code): code is string => code !== undefined);
  }

  if (intel.preferences?.length) {
    operaCodes.preferenceCodes = intel.preferences
      .map(mapPreferenceToOpera)
      .filter((code): code is string => code !== undefined);
  }

  if (intel.occasion) {
    operaCodes.occasionCode = mapOccasionToOpera(intel.occasion);
  }

  return {
    ...intel,
    operaCodes: Object.keys(operaCodes).length > 0 ? operaCodes : undefined,
  };
}
