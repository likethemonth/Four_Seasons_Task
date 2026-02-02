# Guest Intelligence Platform - Layout Reorganization

## Summary
Reorganize the Intelligence Hub tab layout to move the Quick Capture and Staff Intelligence Feed from the left column to the right column, with the Staff Intelligence Feed positioned above Quick Capture. Additionally, populate the Staff Intelligence Feed with sample data for demonstration purposes.

## Current State
**File**: `/Users/jooniverse/Brain&Co./four-seasons-labor-optimization/src/app/guests/page.tsx` (lines 288-304)

Current layout:
- **Left column (col-span-1)**: QuickCapture, then IntelligenceFeed (Staff Intelligence Feed)
- **Right column (col-span-2)**: VIPTouchpoints

The Staff Intelligence Feed currently displays "No intelligence captured yet" because the in-memory store (`/Users/jooniverse/Brain&Co./four-seasons-labor-optimization/src/lib/store/intelligence.ts`) starts empty.

## Target State
- **Left column (col-span-2)**: VIPTouchpoints
- **Right column (col-span-1)**: Staff Intelligence Feed (above), then QuickCapture (below)
- Staff Intelligence Feed populated with sample data

## Testing Strategy
**Framework**: Vitest + React Testing Library (jsdom)
**Config**: `/Users/jooniverse/Brain&Co./four-seasons-labor-optimization/vitest.config.ts`
**Setup**: Uses `@testing-library/jest-dom` for DOM assertions

No existing tests in the src folder. We will create the first test file.

## Implementation Plan

### Task 1: Write Unit Test for Intelligence Store
**File**: `/Users/jooniverse/Brain&Co./four-seasons-labor-optimization/src/lib/store/__tests__/intelligence.test.ts`

Test cases:
- Verify store initializes with seed data
- Verify seed data contains expected fields (guestName, roomNumber, dietary, occasion, etc.)
- Verify getAll() returns records sorted by capturedAt (most recent first)

### Task 2: Update Layout in guests/page.tsx
**File**: `/Users/jooniverse/Brain&Co./four-seasons-labor-optimization/src/app/guests/page.tsx`

Change lines 288-304 from:
```jsx
{activeTab === "intelligence" && (
  <div className="grid grid-cols-3 gap-6">
    {/* Left Column - Quick Capture + Feed */}
    <div className="col-span-1 space-y-6">
      <QuickCapture />
      <IntelligenceFeed
        maxItems={8}
        onSelectGuest={handleSelectGuestFromFeed}
      />
    </div>

    {/* Right Column - VIP Touchpoints */}
    <div className="col-span-2">
      <VIPTouchpoints />
    </div>
  </div>
)}
```

To:
```jsx
{activeTab === "intelligence" && (
  <div className="grid grid-cols-3 gap-6">
    {/* Left Column - VIP Touchpoints */}
    <div className="col-span-2">
      <VIPTouchpoints />
    </div>

    {/* Right Column - Staff Intelligence Feed + Quick Capture */}
    <div className="col-span-1 space-y-6">
      <IntelligenceFeed
        maxItems={8}
        onSelectGuest={handleSelectGuestFromFeed}
      />
      <QuickCapture />
    </div>
  </div>
)}
```

### Task 3: Populate Staff Intelligence Feed with Sample Data
**File**: `/Users/jooniverse/Brain&Co./four-seasons-labor-optimization/src/lib/store/intelligence.ts`

Add seed data initialization after the singleton export. Use the `add()` method with `ParsedGuestIntel` objects.

Sample records to add:

1. **Mr. Chen** (Room 801) - Birthday celebration, gluten-free, prefers high floor
2. **Mrs. Rossi** (Room 1205) - Anniversary, vegetarian, requested champagne on arrival
3. **Dr. Patel** (Room 603) - Business trip, nut allergy, early checkout requested
4. **Ms. Garcia** (Room 910) - Honeymoon, vegan, spa booking requested
5. **Mr. & Mrs. Kim** (Room 1502) - Anniversary, extra pillows, late checkout

Captured by different staff members: "Maria - Concierge", "John - Front Desk", "Sarah - Reservations", "Michael - Guest Relations"

Timestamps spread across last 2 hours to show "just now", "Xm ago", "Xh ago" variations.

## Files to Modify
1. `/Users/jooniverse/Brain&Co./four-seasons-labor-optimization/src/app/guests/page.tsx`
2. `/Users/jooniverse/Brain&Co./four-seasons-labor-optimization/src/lib/store/intelligence.ts`

## Verification
1. Start the development server
2. Navigate to the Guests page (Guest Intelligence Platform)
3. Verify Intelligence Hub tab shows:
   - VIPTouchpoints on the left (wider column)
   - Staff Intelligence Feed on the right (narrower column, at top)
   - QuickCapture on the right (narrower column, below feed)
4. Verify the Staff Intelligence Feed displays sample records
5. Verify clicking a record still opens the guest detail modal
