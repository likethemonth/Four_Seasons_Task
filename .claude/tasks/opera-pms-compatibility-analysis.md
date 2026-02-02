# Critical Analysis: Compatibility with Oracle OPERA PMS

**Date**: 2026-02-02
**Status**: Analysis Complete
**Recommendation**: Demo-ready as standalone; requires integration work for production

---

## Executive Summary

Our current implementation is **NOT directly compatible** with Oracle OPERA PMS. However, the architecture can be adapted with 2-3 weeks of integration work. The demo value remains intact as a proof-of-concept.

---

## 1. Data Model Mismatches

| Our System | OPERA PMS | Gap |
|------------|-----------|-----|
| `guestName: string` | `nameId` (numeric ID) + `nameFirst`, `nameLast`, `nameTitle` | We use free-text; OPERA uses structured IDs |
| `roomNumber: string` | `roomId` + `roomType` + `roomClass` | Missing room classification hierarchy |
| `id: string` (random) | `profileId`, `resvNameId` (system-generated) | No persistent ID mapping |
| In-memory store | Centralized CRM database | No persistence, no sync |
| `dietary[]`, `preferences[]` | `guestPreferences` (structured codes) | OPERA uses standardized preference codes |
| `status: 'pending'\|'assigned'...` | Room status codes (OCC, VAC, DI, OOO, etc.) | Different status vocabulary |

---

## 2. Missing OPERA-Required Fields

### Guest Profile Fields

Our `GuestIntelligence` type lacks critical OPERA fields:

```typescript
// OPERA requires these for proper integration:
interface OperaGuestProfile {
  profileId: number;           // OPERA's unique identifier
  nameId: number;              // Links to reservation
  vipCode: string;             // 'VIP1', 'VIP2', etc. (not boolean)
  membershipLevel: string;     // Loyalty tier
  communicationPreferences: {  // Structured, not free-text
    preferredLanguage: string;
    contactMethod: 'EMAIL' | 'PHONE' | 'SMS';
  };
  specialRequests: {           // Coded, not free-text
    code: string;              // e.g., 'HIGHFLR', 'FEATHER', 'HYPO'
    description: string;
  }[];
}
```

### Housekeeping Fields

Our `HousekeepingTask` lacks OPERA room status structure:

```typescript
// OPERA housekeeping structure:
interface OperaHousekeepingRoom {
  roomId: number;
  roomStatus: 'OCC' | 'VAC' | 'DI' | 'IP' | 'OOO' | 'OOS';
  // OCC = Occupied, VAC = Vacant, DI = Dirty, IP = Inspected
  // OOO = Out of Order, OOS = Out of Service

  frontOfficeStatus: 'VAC' | 'OCC';
  housekeepingStatus: 'CL' | 'DI' | 'IP' | 'PU';
  // CL = Clean, DI = Dirty, IP = Inspected, PU = Pickup

  serviceStatus: 'NS' | 'NR' | 'SR';
  // NS = No Service, NR = No Refresh, SR = Service Required

  turndownStatus: string;
  assignedAttendant: number;  // Staff ID from OPERA
}
```

---

## 3. Integration Architecture Issues

### Current Flow (No OPERA Integration)

```
Staff Voice/Text → AI Parser → In-Memory Store → Dashboard
                     ↓
              (No OPERA sync)
```

### Required Flow for Production

```
Staff Voice/Text → AI Parser → Map to OPERA fields → OHIP API → OPERA Cloud
                                                          ↓
                                              Business Events (webhooks)
                                                          ↓
                                              Our Dashboard (read from OPERA)
```

---

## 4. Required Changes for OPERA Integration

### A. Add OPERA API Client

New file: `src/lib/pms/opera-client.ts`

```typescript
class OperaClient {
  private baseUrl: string;
  private hotelId: string;
  private authToken: string;

  // Guest operations
  async getGuestProfile(profileId: number): Promise<OperaProfile>;
  async updateGuestPreferences(profileId: number, prefs: OperaPreference[]): Promise<void>;
  async searchProfiles(query: string): Promise<OperaProfile[]>;

  // Room operations
  async getRoomStatus(roomId: string): Promise<OperaRoomStatus>;
  async updateHousekeepingStatus(roomId: string, status: string): Promise<void>;

  // Real-time events
  async subscribeToBusinessEvents(): Promise<void>;  // Checkout events, arrivals
}
```

### B. Field Mapping Layer

New file: `src/lib/pms/mappers.ts`

```typescript
// Convert our free-text preferences to OPERA codes
function mapIntelToOperaPreferences(intel: GuestIntelligence): OperaPreference[] {
  const mappings: Record<string, string> = {
    'vegetarian': 'DIET_VEG',
    'vegan': 'DIET_VGN',
    'gluten-free': 'DIET_GF',
    'nut allergy': 'ALLERGY_NUT',
    'high floor': 'ROOM_HIGHFLR',
    'quiet room': 'ROOM_QUIET',
    'feather pillows': 'ROOM_FEATHER',
    // ... more mappings
  };

  // Implementation
}

// Convert OPERA room data to our task structure
function mapOperaRoomToTask(room: OperaRoom, arrival?: OperaReservation): HousekeepingTask {
  // Map OPERA status codes to our status enum
  // Map OPERA roomType to our 'suite'|'deluxe'|'standard'
}
```

### C. Bidirectional Sync

| Direction | Trigger | Data Flow |
|-----------|---------|-----------|
| Inbound | OPERA Business Event: Checkout | OPERA → Our housekeeping queue |
| Inbound | OPERA Business Event: Arrival | OPERA → Guest card with preferences |
| Outbound | Staff captures intelligence | Our AI extraction → OPERA guest profile |

---

## 5. What Works Today (Demo Value)

| Feature | Demo Value | Production Gap |
|---------|------------|----------------|
| Voice capture → AI extraction | Shows workflow effectively | Needs OPERA preference code mapping |
| Priority scoring algorithm | Logic is sound and tested | Needs OPERA room data as input source |
| Auto-assignment by floor | Demonstrates optimization | Needs real staff IDs from OPERA |
| Real-time queue UI | Shows operational value | Needs OPERA status webhooks |
| Guest intelligence display | Demonstrates data capture | Needs OPERA profile sync |

---

## 6. OPERA Technical Requirements

### Authentication
- OAuth 2.0 via OHIP (Oracle Hospitality Integration Platform)
- Application key + client credentials flow
- Tokens expire; refresh mechanism required

### API Headers
```
x-hotelid: FOURSEASONS_NYC  (required for all calls)
x-app-key: <application-key>
Authorization: Bearer <oauth-token>
```

### Rate Limits
- API calls are metered
- Sandbox access is consumption-based pricing
- Production limits vary by contract

### Business Events (Webhooks)
- Subscribe to events: `CHECKOUT`, `CHECKIN`, `RESERVATION_CREATED`, `PROFILE_UPDATED`
- Webhook endpoint must be HTTPS
- Events include `resvNameId`, `profileId`, `roomId`

---

## 7. Recommended Path Forward

### For Tuesday Demo

**Keep as-is.** The mock data demonstrates the concept effectively. The value proposition (voice capture → AI extraction → smart allocation) is valid regardless of PMS backend.

### For Production Integration

| Phase | Work | Duration |
|-------|------|----------|
| Phase 1 | Add OPERA field structures to TypeScript types (backward compatible) | 2 days |
| Phase 2 | Build OPERA API client with OAuth authentication | 3 days |
| Phase 3 | Create mapping layer (free-text → OPERA codes) | 3 days |
| Phase 4 | Subscribe to OPERA Business Events for real-time triggers | 2 days |
| Phase 5 | Replace in-memory stores with OPERA as source of truth | 3 days |
| Phase 6 | Testing and edge cases | 2 days |

**Total estimated integration work: 2-3 weeks**

---

## 8. Four Seasons Specific Considerations

- Four Seasons uses OPERA Cloud globally
- Custom preference codes are configured per property
- VIP codes follow Four Seasons loyalty tier structure
- Integration would require Four Seasons IT partnership for:
  - OHIP sandbox access
  - Property-specific configuration codes
  - Staff ID mappings
  - Testing against staging environment

---

## 9. Files That Would Need Changes

### New Files Required

```
src/lib/pms/
├── opera-client.ts      # OPERA API client with OAuth
├── opera-types.ts       # OPERA-specific TypeScript interfaces
├── mappers.ts           # Bidirectional field mapping
├── business-events.ts   # Webhook handler for OPERA events
└── sync.ts              # Sync orchestration logic
```

### Existing Files to Modify

```
src/lib/ai/parser.ts           # Output OPERA-compatible codes
src/lib/ai/types.ts            # Add OPERA field mappings
src/lib/housekeeping/types.ts  # Add OPERA status codes
src/lib/store/housekeeping.ts  # Replace with OPERA API calls
src/lib/store/intelligence.ts  # Sync to OPERA profiles
src/app/api/housekeeping/*     # Call OPERA instead of in-memory
```

---

## 10. Sources

- [Oracle Hospitality API Documentation (GitHub)](https://github.com/oracle/hospitality-api-docs)
- [OPERA Cloud Property APIs](https://docs.oracle.com/en/industries/hospitality/integration-platform/ohipu/c_property_apis.htm)
- [How to Integrate with OPERA PMS - AltexSoft](https://www.altexsoft.com/blog/opera-pms-integration/)
- [Oracle Hospitality Integration Platform](https://www.oracle.com/hospitality/integration-platform/)
- [OPERA Cloud PMS Overview](https://www.oracle.com/hospitality/hotel-property-management/hotel-pms-software/)

---

## Conclusion

The current system is a valid proof-of-concept that demonstrates significant operational value. For production deployment at Four Seasons, a dedicated integration phase is required to properly connect with OPERA Cloud PMS. The core logic (AI extraction, priority scoring, auto-assignment) remains valuable and reusable; only the data layer needs adaptation.
