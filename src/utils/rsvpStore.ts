export type AttendanceStatus = 'attending' | 'declined';
export type FamilySide = 'groom' | 'bride' | 'both';
export type DietaryPreference = 'pure_veg' | 'jain' | 'veg_nonveg' | 'no_preference';

export interface RsvpRecord {
  rsvpId: string;
  themeId: string;
  guestName: string;
  guestPhone: string;
  attendanceStatus: AttendanceStatus;
  guestCount: number;
  side: FamilySide;
  dietaryPreference: DietaryPreference;
  eventIds: string[];
  arrivalInfo: string;
  blessingNote: string;
  source: 'guest_web' | 'host_manual';
  createdAtMs: number;
}

export interface RsvpSubmissionInput {
  guestName: string;
  guestPhone?: string;
  attendanceStatus: AttendanceStatus;
  guestCount: number;
  side: FamilySide;
  dietaryPreference: DietaryPreference;
  eventIds: string[];
  arrivalInfo?: string;
  blessingNote?: string;
  source?: 'guest_web' | 'host_manual';
}

const LOCAL_RSVPS_KEY = 'nimantran_whatsapp_rsvps_v1';

function generateRsvpId(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `rsvp-${Date.now().toString(36)}-${rand}`;
}

export function loadLocalRsvps(themeId: string): RsvpRecord[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_RSVPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, RsvpRecord[]>;
    return Array.isArray(parsed[themeId]) ? parsed[themeId] : [];
  } catch {
    return [];
  }
}

export function saveLocalRsvp(themeId: string, input: RsvpSubmissionInput): RsvpRecord {
  const isAttending = input.attendanceStatus === 'attending';
  const record: RsvpRecord = {
    rsvpId: generateRsvpId(),
    themeId,
    guestName: input.guestName.trim().slice(0, 80),
    guestPhone: (input.guestPhone || '').trim().slice(0, 20),
    attendanceStatus: input.attendanceStatus,
    guestCount: isAttending ? Math.max(1, Math.min(15, Math.round(input.guestCount || 1))) : 0,
    side: input.side,
    dietaryPreference: isAttending ? input.dietaryPreference : 'no_preference',
    eventIds: isAttending ? input.eventIds.slice(0, 8) : [],
    arrivalInfo: (input.arrivalInfo || '').trim().slice(0, 120),
    blessingNote: (input.blessingNote || '').trim().slice(0, 240),
    source: input.source || 'guest_web',
    createdAtMs: Date.now(),
  };

  try {
    const raw = window.localStorage.getItem(LOCAL_RSVPS_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, RsvpRecord[]>) : {};
    const existing = Array.isArray(map[themeId]) ? map[themeId] : [];
    map[themeId] = [record, ...existing].slice(0, 100);
    window.localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }

  return record;
}

export function deleteLocalRsvp(themeId: string, rsvpId: string): RsvpRecord[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_RSVPS_KEY);
    if (!raw) return [];
    const map = JSON.parse(raw) as Record<string, RsvpRecord[]>;
    const existing = Array.isArray(map[themeId]) ? map[themeId] : [];
    const next = existing.filter((r) => r.rsvpId !== rsvpId);
    map[themeId] = next;
    window.localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(map));
    return next;
  } catch {
    return [];
  }
}
