# Implementation Plan: Intelligent Resource Allocation

## Status: Complete

## Overview

Building two modules for the Four Seasons Labor Optimization dashboard:
1. **Guest Intelligence Capture** - Telegram bot → AI parser → Dashboard integration
2. **Real-Time Task Allocation** - Housekeeping auto-queue with priority scoring

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    TELEGRAM     │────▶│    AI PARSER    │────▶│    DATABASE     │
│    (Staff)      │     │    (Claude)     │     │   (In-memory)   │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
┌─────────────────┐     ┌─────────────────┐              │
│  MOCK OPERA     │────▶│  QUEUE ENGINE   │◀─────────────┘
│  (Checkout)     │     │  (Allocation)   │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │    DASHBOARD    │
                        │    (Next.js)    │
                        └─────────────────┘
```

---

## Tasks

### Phase 1: Testing Infrastructure & Core Logic

- [x] **Task 1.1**: Set up testing infrastructure (Vitest)
  - Installed vitest, @testing-library/react, jsdom
  - Created vitest.config.ts with React plugin and jsdom environment
  - Added test scripts to package.json

- [x] **Task 1.2**: Write AI Parser tests
  - 12 tests covering: guest name, room number, occasions, dietary, preferences, requests, confidence
  - Tests use mock parser for deterministic results

- [x] **Task 1.3**: Implement AI Parser
  - Created src/lib/ai/parser.ts with Claude integration and mock fallback
  - Created src/lib/ai/prompts.ts with extraction prompts
  - Created src/lib/ai/types.ts with GuestIntelligence and ParsedGuestIntel interfaces

- [x] **Task 1.4**: Write Priority Scoring tests
  - 15 tests covering: base score, suite/deluxe bonus, VIP bonus, urgent arrival, floor matching, priority levels

- [x] **Task 1.5**: Implement Priority Scoring
  - Created src/lib/housekeeping/priority.ts with PRIORITY_WEIGHTS constants
  - Created src/lib/housekeeping/types.ts with HousekeepingTask, Housekeeper interfaces

### Phase 2: Data Layer

- [x] **Task 2.1**: Create in-memory data store
  - src/lib/store/intelligence.ts - guest intel with room/guest indexing
  - src/lib/store/housekeeping.ts - queue with priority sorting
  - src/lib/store/staff.ts - 8 default housekeepers across floors 4-8

- [x] **Task 2.2**: Create mock OPERA data
  - Demo checkout buttons trigger queue additions
  - VIP flags for rooms 720, 801
  - Arrival times set 2 hours in future for urgency testing

### Phase 3: Telegram Bot

- [x] **Task 3.1**: Set up Telegram bot
  - Installed grammy.js
  - Created src/lib/telegram/bot.ts with message handlers
  - Supports /start and /help commands

- [x] **Task 3.2**: Create API routes for Telegram
  - POST /api/telegram/webhook - handles incoming updates
  - Calls AI parser (or mock with USE_MOCK_AI env var)
  - Stores results and sends confirmation

### Phase 4: Housekeeping Queue Engine

- [x] **Task 4.1**: Write queue management tests
  - 12 tests covering: floor extraction, room type detection, checkout processing, auto-assignment

- [x] **Task 4.2**: Implement queue management
  - src/lib/housekeeping/queue.ts with processCheckout, autoAssign functions
  - Pairs housekeepers based on floor proximity
  - Updates staff status when assigned

- [x] **Task 4.3**: Create housekeeping API routes
  - GET /api/housekeeping/queue - returns sorted queue with staff
  - POST /api/housekeeping/checkout - triggers checkout event
  - PATCH /api/housekeeping/task/[taskId] - updates task status

### Phase 5: Dashboard Components

- [x] **Task 5.1**: Build Chat Widget
  - ChatWidget.tsx - floating button (bottom-right)
  - Expandable panel with message list
  - Polls every 10 seconds for updates
  - Manual input for demo testing

- [x] **Task 5.2**: Build Guest Intel Card expansion
  - GuestIntelCard.tsx - merged view of all intel for a guest
  - Shows occasion, dietary, preferences, requests with icons
  - Source attribution with staff name and time

- [x] **Task 5.3**: Build Housekeeping Queue Panel
  - QueuePanel.tsx - summary cards + queue list + demo buttons
  - RoomCard.tsx - priority colors, status badges, action buttons
  - StaffStatus.tsx - staff by floor with availability indicators

- [x] **Task 5.4**: Create Intelligence API routes
  - GET /api/intelligence - list all with ?recent=N or ?limit=N
  - GET /api/intelligence/[guestId] - by guest name or room number
  - POST /api/intelligence - add new from message

### Phase 6: Integration & Polish

- [x] **Task 6.1**: Wire up end-to-end flow
  - Added ChatWidget to root layout
  - Added HK Queue to sidebar navigation
  - Created /housekeeping page

- [ ] **Task 6.2**: Demo preparation
  - Pre-load test data (use demo checkout buttons)
  - Telegram bot requires TELEGRAM_BOT_TOKEN env var
  - Real AI requires ANTHROPIC_API_KEY env var

---

## Files Created

### Core Logic
- `src/lib/ai/types.ts` - GuestIntelligence, ParsedGuestIntel interfaces
- `src/lib/ai/prompts.ts` - System and user prompts for Claude
- `src/lib/ai/parser.ts` - parseGuestIntelligence + mock implementation
- `src/lib/housekeeping/types.ts` - HousekeepingTask, Housekeeper interfaces
- `src/lib/housekeeping/priority.ts` - calculatePriority, calculateFloorMatch, getPriorityLevel
- `src/lib/housekeeping/queue.ts` - processCheckout, autoAssign, getQueueStatus

### Data Stores
- `src/lib/store/intelligence.ts` - IntelligenceStore class
- `src/lib/store/housekeeping.ts` - HousekeepingStore class
- `src/lib/store/staff.ts` - StaffStore class with 8 default housekeepers

### Telegram
- `src/lib/telegram/bot.ts` - grammy.js bot with message handlers

### API Routes
- `src/app/api/telegram/webhook/route.ts` - POST webhook handler
- `src/app/api/intelligence/route.ts` - GET/POST intelligence
- `src/app/api/intelligence/[guestId]/route.ts` - GET by guest/room
- `src/app/api/housekeeping/queue/route.ts` - GET queue status
- `src/app/api/housekeeping/checkout/route.ts` - POST checkout trigger
- `src/app/api/housekeeping/task/[taskId]/route.ts` - GET/PATCH task

### Dashboard Components
- `src/components/intelligence/ChatWidget.tsx` - Floating chat panel
- `src/components/intelligence/GuestIntelCard.tsx` - Intel display card
- `src/components/housekeeping/QueuePanel.tsx` - Queue management panel
- `src/components/housekeeping/RoomCard.tsx` - Individual room task card
- `src/components/housekeeping/StaffStatus.tsx` - Staff availability display

### Pages
- `src/app/housekeeping/page.tsx` - Housekeeping operations page

### Tests
- `src/__tests__/lib/ai/parser.test.ts` - 12 tests
- `src/__tests__/lib/housekeeping/priority.test.ts` - 15 tests
- `src/__tests__/lib/housekeeping/queue.test.ts` - 12 tests

### Configuration
- `vitest.config.ts` - Vitest configuration
- `vitest.setup.ts` - Test setup with jest-dom

---

## Test Results

```
Test Files: 3 passed (3)
Tests: 39 passed (39)
- parser.test.ts: 12 tests
- priority.test.ts: 15 tests
- queue.test.ts: 12 tests
```

---

## Environment Variables

```env
# Required for real Telegram bot
TELEGRAM_BOT_TOKEN=your_bot_token

# Required for real AI parsing (optional, mock works without it)
ANTHROPIC_API_KEY=your_api_key

# Set to "true" to use mock parser instead of Claude
USE_MOCK_AI=true
```

---

## Demo Instructions

### Start the app
```bash
npm run dev
```

### Access the dashboard
- Main dashboard: http://localhost:3000
- Housekeeping queue: http://localhost:3000/housekeeping

### Test Guest Intelligence Flow
1. Click the chat widget (bottom-right)
2. Type: "Mr. Chen 412 - wife's 40th birthday, vegetarian, loves peonies"
3. See parsed result appear in widget

### Test Housekeeping Queue Flow
1. Go to /housekeeping
2. Click "Room 412" or "Room 801 VIP" demo buttons
3. Watch room appear in queue with priority color
4. See auto-assignment to housekeepers
5. Click "Start Cleaning" to update status
6. Click "Mark Complete" when done

---

## Change Log

### 2026-02-01
- Created initial implementation plan
- Explored existing codebase structure
- Identified Next.js 16 + React 19 + TypeScript stack
- Set up Vitest testing infrastructure
- Implemented AI parser with 12 passing tests
- Implemented priority scoring with 15 passing tests
- Created data stores for intelligence, housekeeping, staff
- Built Telegram bot with grammy.js
- Created all API routes
- Built ChatWidget, GuestIntelCard components
- Built QueuePanel, RoomCard, StaffStatus components
- Created /housekeeping page
- Added ChatWidget to layout
- Added HK Queue to sidebar
- Implemented queue management with 12 passing tests
- Build passes with all routes compiled
- Total: 39 tests passing
