# Implementation Plan: Layout Reorder & Guest Profile Feature

## Overview

This plan covers two changes:
1. **Layout Change**: Move the 7-day Schedule Overview (WeeklySchedule) above the Department Demand Forecast (DepartmentDemand)
2. **New Feature**: Implement a Guest Profile component based on PRD section 3.2.1

---

## Task 1: Reorder Dashboard Layout

### Current Layout
```
SummaryCards
├── DepartmentDemand (col-span-2)
├── GuestIntelligence (col-span-1)
├── VIPArrivals (col-span-2)
├── CostProjection (col-span-1)
└── WeeklySchedule (full-width)
```

### Target Layout
```
SummaryCards
├── WeeklySchedule (full-width)        ← moved up
├── DepartmentDemand (col-span-2)
├── GuestIntelligence (col-span-1)
├── VIPArrivals (col-span-2)
└── CostProjection (col-span-1)
```

### File to Modify
- `/Users/jooniverse/Brain&Co./four-seasons-labor-optimization/src/app/page.tsx`

### Implementation
Move `<WeeklySchedule />` from after CostProjection to before DepartmentDemand, with appropriate `col-span-3` class.

---

## Task 2: Guest Profile Feature

### Requirements (from PRD 3.2.1)

The Guest Profile component should display enriched guest information:

**Guest Header:**
- Guest name, initials avatar
- Loyalty tier badge (Elite, Preferred, VIP, First Stay)
- Stay count across network

**Service Predictions:**
- F&B usage pattern (e.g., "Heavy user - 80% of stays")
- Spa history
- Gym usage pattern
- Checkout pattern (Early/Late/Standard)
- Concierge usage level

**Special Requirements:**
- Dietary restrictions
- Accessibility needs
- Room preferences

**Staffing Implications:**
- Actionable insights for each department

### Design Approach

**Inline Expansion Pattern**: When a user clicks on a VIP guest card, it expands inline to reveal the full guest profile below the card summary. This keeps the context visible and feels natural within the dashboard.

UI behavior:
- Click on guest card → card expands with smooth animation
- Expanded view shows: service predictions, special requirements, staffing implications
- Click again or click "collapse" to close
- Only one profile expanded at a time

### Files to Modify
- `/Users/jooniverse/Brain&Co./four-seasons-labor-optimization/src/components/dashboard/VIPArrivals.tsx`
  - Add expandable state management
  - Add expanded profile section with guest details
  - Add service predictions data to guest interface

---

## Implementation Steps

- [x] Step 1: Reorder Layout - Edit page.tsx to move WeeklySchedule above DepartmentDemand
- [x] Step 2: Enhance VIPArrivals with Inline Profile Expansion

---

## Verification

1. Run dev server: `cd four-seasons-labor-optimization && npm run dev`
2. Verify WeeklySchedule appears above DepartmentDemand
3. Verify clicking a VIP guest shows profile details

## Post-Implementation

- Commit changes with descriptive message
- Push to remote repository (per user request)

---

## Decisions Made

- **Profile Display**: Inline expansion within VIP guest cards (user choice)
- **No new component file**: Profile details integrated directly into VIPArrivals.tsx

---

## Implementation Log

### Step 1: Layout Reorder
- Status: Completed
- File Modified: `src/app/page.tsx`
- Changes:
  - Moved `<WeeklySchedule />` from bottom of grid to top
  - Wrapped in `<div className="col-span-3">` for full-width display
  - Component now renders before DepartmentDemand

### Step 2: Guest Profile Feature
- Status: Completed
- File Modified: `src/components/dashboard/VIPArrivals.tsx`
- Changes:
  - Added `useState` hook for `expandedGuestId` state management
  - Extended `VIPGuest` interface with `servicePredictions` and `staffingImplications`
  - Added new interfaces: `ServicePrediction`, `StaffingImplication`
  - Added new icons: `ChevronDown`, `ChevronUp`, `UtensilsCrossed`, `Sparkles`, `Dumbbell`, `LogOut`, `Headphones`, `Lightbulb`
  - Populated all 5 VIP guests with service predictions and staffing implications data
  - Added inline expansion UI with three sections:
    1. Service Predictions (F&B, Spa, Gym, Checkout, Concierge with usage level badges)
    2. Room Preferences (if available)
    3. Staffing Implications (actionable insights per department)
  - Added smooth transitions and visual feedback on card expansion
  - Increased max-height of card body to accommodate expanded content
