// Four Seasons Hotel London at Park Lane - Room Data
// Based on publicly available information from fourseasons.com
// 196 rooms and suites across 11 floors

export type RoomCategory =
  | 'superior'
  | 'deluxe'
  | 'premier'
  | 'terrace'
  | 'studio_terrace_suite'
  | 'grand_suite'
  | 'garden_suite'
  | 'royal_terrace_suite'
  | 'westminster_suite'
  | 'ambassador_suite'
  | 'park_suite'
  | 'deluxe_suite'
  | 'hyde_park_suite'
  | 'presidential_suite';

export type RoomStatus = 'clean' | 'dirty' | 'pickup' | 'inspected' | 'ooo' | 'oos';
export type FOStatus = 'vacant' | 'occupied' | 'due_out' | 'arrival' | 'departed';
export type HKStatus = 'pending' | 'assigned' | 'in_progress' | 'complete';

export interface Room {
  roomNumber: string;
  floor: number;
  category: RoomCategory;
  categoryLabel: string;
  sqm: number;
  sqft: number;
  bedType: 'king' | 'twin' | 'double';
  maxOccupancy: number;
  view: 'park' | 'city' | 'courtyard';
  features: string[];
  roomStatus: RoomStatus;
  foStatus: FOStatus;
  hkStatus: HKStatus;
  isVip: boolean;
  vipCode?: string;
  guestName?: string;
  arrivalTime?: string;
  departureTime?: string;
  specialRequests?: string[];
  assignedAttendant?: string;
}

// Room category details
export const ROOM_CATEGORIES: Record<RoomCategory, { label: string; sqm: number; sqft: number; cleaningMinutes: number }> = {
  superior: { label: 'Superior Room', sqm: 37, sqft: 398, cleaningMinutes: 30 },
  deluxe: { label: 'Deluxe Room', sqm: 42, sqft: 452, cleaningMinutes: 35 },
  premier: { label: 'Premier Room', sqm: 46, sqft: 495, cleaningMinutes: 35 },
  terrace: { label: 'Terrace Room', sqm: 46, sqft: 495, cleaningMinutes: 40 },
  studio_terrace_suite: { label: 'Studio Terrace Suite', sqm: 65, sqft: 700, cleaningMinutes: 45 },
  grand_suite: { label: 'Grand Suite', sqm: 101, sqft: 1087, cleaningMinutes: 60 },
  garden_suite: { label: 'Garden Suite', sqm: 128, sqft: 1378, cleaningMinutes: 65 },
  royal_terrace_suite: { label: 'Royal Terrace Suite', sqm: 140, sqft: 1507, cleaningMinutes: 70 },
  westminster_suite: { label: 'Westminster Suite', sqm: 63, sqft: 678, cleaningMinutes: 50 },
  ambassador_suite: { label: 'Ambassador Suite', sqm: 75, sqft: 807, cleaningMinutes: 55 },
  park_suite: { label: 'Park Suite', sqm: 103, sqft: 1108, cleaningMinutes: 60 },
  deluxe_suite: { label: 'Deluxe Suite', sqm: 112, sqft: 1205, cleaningMinutes: 65 },
  hyde_park_suite: { label: 'Hyde Park Suite', sqm: 95, sqft: 1023, cleaningMinutes: 60 },
  presidential_suite: { label: 'Presidential Suite', sqm: 186, sqft: 2002, cleaningMinutes: 90 },
};

// Generate rooms per floor based on Four Seasons Park Lane layout
function generateFloorRooms(floor: number): Room[] {
  const rooms: Room[] = [];

  // Floor 2: Terrace rooms and special suites
  if (floor === 2) {
    // Terrace rooms
    for (let i = 1; i <= 8; i++) {
      rooms.push(createRoom(`20${i.toString().padStart(2, '0')}`, floor, 'terrace', 'courtyard'));
    }
    // Special suites on floor 2
    rooms.push(createRoom('210', floor, 'studio_terrace_suite', 'courtyard'));
    rooms.push(createRoom('211', floor, 'grand_suite', 'courtyard'));
    rooms.push(createRoom('212', floor, 'garden_suite', 'park'));
    rooms.push(createRoom('213', floor, 'royal_terrace_suite', 'park'));
  }

  // Floors 3-9: Mix of Superior, Deluxe, Premier rooms and Suites
  if (floor >= 3 && floor <= 9) {
    const roomsPerFloor = floor === 9 ? 20 : 24;

    for (let i = 1; i <= roomsPerFloor; i++) {
      const roomNum = `${floor}${i.toString().padStart(2, '0')}`;
      let category: RoomCategory;
      let view: 'park' | 'city' | 'courtyard';

      // Rooms 01-06: Park view (premium)
      if (i <= 6) {
        view = 'park';
        if (i <= 2) {
          // Suites at the end
          if (floor === 5 && i === 1) {
            category = 'presidential_suite';
          } else if (floor === 9 && i === 1) {
            category = 'hyde_park_suite';
          } else if ([3, 4, 6, 7].includes(floor) && i === 1) {
            category = 'park_suite';
          } else if ([6, 7, 8].includes(floor) && i === 2) {
            category = 'deluxe_suite';
          } else {
            category = 'premier';
          }
        } else {
          category = 'premier';
        }
      }
      // Rooms 07-12: City view
      else if (i <= 12) {
        view = 'city';
        if ([6, 7, 8, 9].includes(floor) && i === 7) {
          category = 'westminster_suite';
        } else if (i <= 9) {
          category = 'deluxe';
        } else {
          category = 'superior';
        }
      }
      // Rooms 13-18: City view (standard)
      else if (i <= 18) {
        view = 'city';
        if ([3, 4, 5, 6, 7, 8, 9].includes(floor) && i === 13) {
          category = 'ambassador_suite';
        } else {
          category = 'superior';
        }
      }
      // Rooms 19-24: Courtyard view
      else {
        view = 'courtyard';
        category = 'superior';
      }

      rooms.push(createRoom(roomNum, floor, category, view));
    }
  }

  return rooms;
}

function createRoom(
  roomNumber: string,
  floor: number,
  category: RoomCategory,
  view: 'park' | 'city' | 'courtyard'
): Room {
  const categoryInfo = ROOM_CATEGORIES[category];
  const statuses: RoomStatus[] = ['clean', 'dirty', 'pickup', 'inspected'];
  const foStatuses: FOStatus[] = ['vacant', 'occupied', 'due_out', 'arrival'];

  // Randomize status for demo
  const roomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const foStatus = foStatuses[Math.floor(Math.random() * foStatuses.length)];

  // Determine HK status based on room status
  let hkStatus: HKStatus = 'complete';
  if (roomStatus === 'dirty') hkStatus = 'pending';
  else if (roomStatus === 'pickup') hkStatus = Math.random() > 0.5 ? 'assigned' : 'in_progress';

  // Random VIP assignment (10% chance)
  const isVip = Math.random() < 0.1;
  const vipCodes = ['VIP1', 'VIP2', 'VIP3', 'VVIP'];

  // Guest names for occupied rooms
  const guestNames = [
    'Mr. Chen', 'Mrs. Tanaka', 'Mr. & Mrs. Williams', 'Ms. Dubois',
    'Mr. Al-Rashid', 'Mrs. Petrov', 'Mr. Singh', 'Ms. Martinez',
    'Lord Harrington', 'Lady Pemberton', 'Sheikh Al-Maktoum', 'Dr. Nakamura',
    'Mr. & Mrs. Thompson', 'Ms. Anderson', 'Mr. Okonkwo', 'Mrs. Johansson'
  ];

  return {
    roomNumber,
    floor,
    category,
    categoryLabel: categoryInfo.label,
    sqm: categoryInfo.sqm,
    sqft: categoryInfo.sqft,
    bedType: category.includes('suite') ? 'king' : (Math.random() > 0.3 ? 'king' : 'twin'),
    maxOccupancy: category.includes('suite') ? 4 : 2,
    view,
    features: getFeatures(category, view),
    roomStatus,
    foStatus,
    hkStatus,
    isVip,
    vipCode: isVip ? vipCodes[Math.floor(Math.random() * vipCodes.length)] : undefined,
    guestName: foStatus !== 'vacant' ? guestNames[Math.floor(Math.random() * guestNames.length)] : undefined,
  };
}

function getFeatures(category: RoomCategory, view: string): string[] {
  const features: string[] = ['Four Seasons Bed', 'Marble Bathroom', 'High-Speed WiFi'];

  if (view === 'park') features.push('Hyde Park View');
  if (category.includes('suite')) {
    features.push('Living Area', 'Dining Area', 'Butler Service');
  }
  if (category === 'presidential_suite') {
    features.push('Private Fireplace', 'Butler Pantry', 'Formal Dining Room');
  }
  if (category.includes('terrace')) {
    features.push('Private Terrace');
  }

  return features;
}

// Generate all hotel rooms
export function generateHotelRooms(): Room[] {
  const allRooms: Room[] = [];

  for (let floor = 2; floor <= 9; floor++) {
    allRooms.push(...generateFloorRooms(floor));
  }

  return allRooms;
}

// Floor layout configuration for visual floor plan
export const FLOOR_LAYOUTS: Record<number, {
  name: string;
  description: string;
  roomCount: number;
  wings: { name: string; rooms: string[] }[];
}> = {
  2: {
    name: 'Second Floor',
    description: 'Terrace Level - Private Gardens & Terraces',
    roomCount: 12,
    wings: [
      { name: 'Garden Wing', rooms: ['201', '202', '203', '204', '210', '211'] },
      { name: 'Terrace Wing', rooms: ['205', '206', '207', '208', '212', '213'] },
    ],
  },
  3: {
    name: 'Third Floor',
    description: 'Park View & Ambassador Suites',
    roomCount: 24,
    wings: [
      { name: 'Park Wing', rooms: ['301', '302', '303', '304', '305', '306'] },
      { name: 'City Wing', rooms: ['307', '308', '309', '310', '311', '312'] },
      { name: 'East Wing', rooms: ['313', '314', '315', '316', '317', '318'] },
      { name: 'Courtyard Wing', rooms: ['319', '320', '321', '322', '323', '324'] },
    ],
  },
  4: {
    name: 'Fourth Floor',
    description: 'Park Suites & Deluxe Rooms',
    roomCount: 24,
    wings: [
      { name: 'Park Wing', rooms: ['401', '402', '403', '404', '405', '406'] },
      { name: 'City Wing', rooms: ['407', '408', '409', '410', '411', '412'] },
      { name: 'East Wing', rooms: ['413', '414', '415', '416', '417', '418'] },
      { name: 'Courtyard Wing', rooms: ['419', '420', '421', '422', '423', '424'] },
    ],
  },
  5: {
    name: 'Fifth Floor',
    description: 'Presidential Suite Level',
    roomCount: 24,
    wings: [
      { name: 'Presidential Wing', rooms: ['501', '502', '503', '504', '505', '506'] },
      { name: 'City Wing', rooms: ['507', '508', '509', '510', '511', '512'] },
      { name: 'East Wing', rooms: ['513', '514', '515', '516', '517', '518'] },
      { name: 'Courtyard Wing', rooms: ['519', '520', '521', '522', '523', '524'] },
    ],
  },
  6: {
    name: 'Sixth Floor',
    description: 'Deluxe Suites & Westminster Suites',
    roomCount: 24,
    wings: [
      { name: 'Park Wing', rooms: ['601', '602', '603', '604', '605', '606'] },
      { name: 'City Wing', rooms: ['607', '608', '609', '610', '611', '612'] },
      { name: 'East Wing', rooms: ['613', '614', '615', '616', '617', '618'] },
      { name: 'Courtyard Wing', rooms: ['619', '620', '621', '622', '623', '624'] },
    ],
  },
  7: {
    name: 'Seventh Floor',
    description: 'Park Suites & Premium Rooms',
    roomCount: 24,
    wings: [
      { name: 'Park Wing', rooms: ['701', '702', '703', '704', '705', '706'] },
      { name: 'City Wing', rooms: ['707', '708', '709', '710', '711', '712'] },
      { name: 'East Wing', rooms: ['713', '714', '715', '716', '717', '718'] },
      { name: 'Courtyard Wing', rooms: ['719', '720', '721', '722', '723', '724'] },
    ],
  },
  8: {
    name: 'Eighth Floor',
    description: 'Deluxe Suites & City Views',
    roomCount: 24,
    wings: [
      { name: 'Park Wing', rooms: ['801', '802', '803', '804', '805', '806'] },
      { name: 'City Wing', rooms: ['807', '808', '809', '810', '811', '812'] },
      { name: 'East Wing', rooms: ['813', '814', '815', '816', '817', '818'] },
      { name: 'Courtyard Wing', rooms: ['819', '820', '821', '822', '823', '824'] },
    ],
  },
  9: {
    name: 'Ninth Floor',
    description: 'Hyde Park Suite & Premium Level',
    roomCount: 20,
    wings: [
      { name: 'Hyde Park Wing', rooms: ['901', '902', '903', '904', '905'] },
      { name: 'City Wing', rooms: ['906', '907', '908', '909', '910'] },
      { name: 'East Wing', rooms: ['911', '912', '913', '914', '915'] },
      { name: 'Courtyard Wing', rooms: ['916', '917', '918', '919', '920'] },
    ],
  },
};

// Housekeeping staff data
export interface HousekeepingStaff {
  id: string;
  name: string;
  role: 'attendant' | 'supervisor' | 'inspector';
  currentFloor: number;
  assignedRooms: string[];
  status: 'available' | 'busy' | 'break' | 'off_duty';
  shiftStart: string;
  shiftEnd: string;
  roomsCompleted: number;
  avgCleaningTime: number; // minutes
}

export const HOUSEKEEPING_STAFF: HousekeepingStaff[] = [
  { id: 'hk-001', name: 'Maria Santos', role: 'attendant', currentFloor: 4, assignedRooms: ['401', '402', '403', '404'], status: 'busy', shiftStart: '07:00', shiftEnd: '15:00', roomsCompleted: 6, avgCleaningTime: 32 },
  { id: 'hk-002', name: 'Jun Wei', role: 'attendant', currentFloor: 4, assignedRooms: ['405', '406', '407', '408'], status: 'busy', shiftStart: '07:00', shiftEnd: '15:00', roomsCompleted: 5, avgCleaningTime: 35 },
  { id: 'hk-003', name: 'Elena Popova', role: 'attendant', currentFloor: 5, assignedRooms: ['501', '502', '503'], status: 'busy', shiftStart: '07:00', shiftEnd: '15:00', roomsCompleted: 4, avgCleaningTime: 40 },
  { id: 'hk-004', name: 'Ahmed Hassan', role: 'attendant', currentFloor: 5, assignedRooms: ['504', '505', '506', '507'], status: 'available', shiftStart: '07:00', shiftEnd: '15:00', roomsCompleted: 7, avgCleaningTime: 28 },
  { id: 'hk-005', name: 'Sophie Laurent', role: 'attendant', currentFloor: 6, assignedRooms: ['601', '602', '603', '604'], status: 'busy', shiftStart: '07:00', shiftEnd: '15:00', roomsCompleted: 5, avgCleaningTime: 33 },
  { id: 'hk-006', name: 'Kenji Tanaka', role: 'attendant', currentFloor: 6, assignedRooms: ['605', '606', '607'], status: 'break', shiftStart: '07:00', shiftEnd: '15:00', roomsCompleted: 4, avgCleaningTime: 36 },
  { id: 'hk-007', name: 'Priya Sharma', role: 'attendant', currentFloor: 7, assignedRooms: ['701', '702', '703', '704'], status: 'busy', shiftStart: '08:00', shiftEnd: '16:00', roomsCompleted: 3, avgCleaningTime: 34 },
  { id: 'hk-008', name: 'Carlos Rodriguez', role: 'attendant', currentFloor: 7, assignedRooms: ['705', '706', '707', '708'], status: 'available', shiftStart: '08:00', shiftEnd: '16:00', roomsCompleted: 4, avgCleaningTime: 31 },
  { id: 'hk-009', name: 'Anna Kowalski', role: 'attendant', currentFloor: 8, assignedRooms: ['801', '802', '803'], status: 'busy', shiftStart: '08:00', shiftEnd: '16:00', roomsCompleted: 2, avgCleaningTime: 45 },
  { id: 'hk-010', name: 'David Okonkwo', role: 'attendant', currentFloor: 8, assignedRooms: ['804', '805', '806', '807'], status: 'busy', shiftStart: '08:00', shiftEnd: '16:00', roomsCompleted: 3, avgCleaningTime: 33 },
  { id: 'hk-011', name: 'Lisa Chen', role: 'supervisor', currentFloor: 5, assignedRooms: [], status: 'available', shiftStart: '07:00', shiftEnd: '15:00', roomsCompleted: 0, avgCleaningTime: 0 },
  { id: 'hk-012', name: 'James Wilson', role: 'inspector', currentFloor: 6, assignedRooms: [], status: 'busy', shiftStart: '09:00', shiftEnd: '17:00', roomsCompleted: 12, avgCleaningTime: 8 },
];

// Pre-generated rooms for consistent data
let cachedRooms: Room[] | null = null;

export function getHotelRooms(): Room[] {
  if (!cachedRooms) {
    cachedRooms = generateHotelRooms();
  }
  return cachedRooms;
}

export function getRoomsByFloor(floor: number): Room[] {
  return getHotelRooms().filter(room => room.floor === floor);
}

export function getRoomByNumber(roomNumber: string): Room | undefined {
  return getHotelRooms().find(room => room.roomNumber === roomNumber);
}

export function getFloorSummary(floor: number): {
  total: number;
  clean: number;
  dirty: number;
  pickup: number;
  inspected: number;
  occupied: number;
  vacant: number;
  arrivals: number;
  departures: number;
  vip: number;
} {
  const rooms = getRoomsByFloor(floor);
  return {
    total: rooms.length,
    clean: rooms.filter(r => r.roomStatus === 'clean').length,
    dirty: rooms.filter(r => r.roomStatus === 'dirty').length,
    pickup: rooms.filter(r => r.roomStatus === 'pickup').length,
    inspected: rooms.filter(r => r.roomStatus === 'inspected').length,
    occupied: rooms.filter(r => r.foStatus === 'occupied').length,
    vacant: rooms.filter(r => r.foStatus === 'vacant').length,
    arrivals: rooms.filter(r => r.foStatus === 'arrival').length,
    departures: rooms.filter(r => r.foStatus === 'due_out').length,
    vip: rooms.filter(r => r.isVip).length,
  };
}
