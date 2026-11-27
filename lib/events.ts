// ============================================================
// UTILITAS JADWAL / AKTIVITAS SEKBER
// Dipakai bersama oleh landing page (publik) dan dashboard (admin)
// ============================================================

export type Division = 'all' | 'pmv' | 'pengurus' | 'both';
export type ViewerRole = 'admin' | 'pmv' | 'pengurus' | 'member' | 'public';

export type EventType = {
  id: string;
  date: string;          // Tanggal mulai  (YYYY-MM-DD)
  endDate?: string;      // Tanggal selesai (YYYY-MM-DD)
  title: string;
  /** Teks waktu siap tampil, cth "08.00 – 17.00 WIB" (disimpan juga untuk data lama) */
  time: string;
  startTime?: string;    // 'HH:MM' 24 jam
  endTime?: string;      // 'HH:MM' 24 jam
  location: string;
  description?: string;
  division?: Division;
};

export const DIVISION_LABELS: Record<Division, string> = {
  all: 'Umum',
  pmv: 'PMV',
  pengurus: 'Pengurus',
  both: 'PMV & Pengurus',
};

export const DIVISION_COLORS: Record<Division, string> = {
  all: '#FACC15',
  pmv: '#3B82F6',
  pengurus: '#A78BFA',
  both: '#2DD4BF',
};

export const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
export const MONTHS_SHORT_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];
export const WEEKDAYS_ID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

/** Date -> 'YYYY-MM-DD' (waktu lokal) */
export function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 'YYYY-MM-DD' -> Date lokal (tanpa geser zona waktu) */
export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function daysBetween(startKey: string, endKey: string): number {
  const ms = fromKey(endKey).getTime() - fromKey(startKey).getTime();
  return Math.round(ms / 86400000);
}

export function eventEnd(e: EventType): string {
  return e.endDate && e.endDate >= e.date ? e.endDate : e.date;
}

export function isEventOnDate(e: EventType, key: string): boolean {
  return key >= e.date && key <= eventEnd(e);
}

export function isMultiDay(e: EventType): boolean {
  return eventEnd(e) !== e.date;
}

/**
 * Siapa yang boleh melihat acara:
 *  - Umum (all)          : semua orang, termasuk pengunjung landing page
 *  - PMV (pmv)           : admin + akun PMV
 *  - Pengurus (pengurus) : admin + akun Pengurus
 *  - PMV & Pengurus (both): admin + akun PMV + akun Pengurus
 */
export function canViewEvent(e: EventType, role: ViewerRole): boolean {
  const div: Division = e.division || 'all';
  if (div === 'all') return true;
  if (role === 'admin') return true;
  if (div === 'both') return role === 'pmv' || role === 'pengurus';
  return div === role;
}

/** Hanya acara Umum yang tampil di landing page (tanpa login). */
export function isPublicEvent(e: EventType): boolean {
  return canViewEvent(e, 'public');
}

/** Senin = 0 ... Minggu = 6 */
export function mondayIndex(d: Date): number {
  const x = d.getDay();
  return x === 0 ? 6 : x - 1;
}

/** 42 sel (6 minggu) untuk tampilan bulan, mulai hari Senin */
export function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = addDays(first, -mondayIndex(first));
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export function formatLong(key: string): string {
  const d = fromKey(key);
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShort(key: string): string {
  const d = fromKey(key);
  return `${d.getDate()} ${MONTHS_SHORT_ID[d.getMonth()]}`;
}

export function formatWeekdayLong(key: string): string {
  return fromKey(key).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

/** "3 – 5 Des 2026", "28 Nov – 2 Des 2026", "3 Des 2026" */
export function formatRange(startKey: string, endKey?: string): string {
  const s = fromKey(startKey);
  const end = endKey && endKey >= startKey ? endKey : startKey;
  const e = fromKey(end);
  if (end === startKey) return `${s.getDate()} ${MONTHS_SHORT_ID[s.getMonth()]} ${s.getFullYear()}`;
  if (s.getFullYear() !== e.getFullYear()) {
    return `${s.getDate()} ${MONTHS_SHORT_ID[s.getMonth()]} ${s.getFullYear()} – ${e.getDate()} ${MONTHS_SHORT_ID[e.getMonth()]} ${e.getFullYear()}`;
  }
  if (s.getMonth() !== e.getMonth()) {
    return `${s.getDate()} ${MONTHS_SHORT_ID[s.getMonth()]} – ${e.getDate()} ${MONTHS_SHORT_ID[e.getMonth()]} ${e.getFullYear()}`;
  }
  return `${s.getDate()} – ${e.getDate()} ${MONTHS_SHORT_ID[s.getMonth()]} ${s.getFullYear()}`;
}

export function sortEvents(list: EventType[]): EventType[] {
  return [...list].sort((a, b) =>
    a.date === b.date ? eventStartTime(a).localeCompare(eventStartTime(b)) : a.date.localeCompare(b.date),
  );
}

// ============================================================
// JAM (format 24 jam, zona WIB)
// ============================================================
export const DEFAULT_TIME = '00:00';

/** Ambil jam-jam 'HH:MM' dari teks lama, cth "10:00 - 12:00 WIB" / "9.30 WIB" */
export function parseTimes(text?: string): string[] {
  if (!text) return [];
  const out: string[] = [];
  const re = /(\d{1,2})[:.](\d{2})/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const h = Number(m[1]); const mi = Number(m[2]);
    if (h < 24 && mi < 60) out.push(`${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`);
  }
  return out;
}

export function eventStartTime(e: EventType): string {
  return e.startTime || parseTimes(e.time)[0] || DEFAULT_TIME;
}

export function eventEndTime(e: EventType): string {
  if (e.endTime) return e.endTime;
  const t = parseTimes(e.time);
  return t[1] || t[0] || DEFAULT_TIME;
}

/** 'HH:MM' -> 'HH.MM' (gaya penulisan jam Indonesia) */
export function dotTime(t: string): string {
  return (t || DEFAULT_TIME).replace(':', '.');
}

/** "08.00 – 17.00 WIB" atau "08.00 WIB" bila jam mulai = jam selesai */
export function formatTimeRange(start: string, end: string): string {
  const s = start || DEFAULT_TIME;
  const e = end || s;
  return e === s ? `${dotTime(s)} WIB` : `${dotTime(s)} – ${dotTime(e)} WIB`;
}

/** Teks jam untuk ditampilkan di kalender */
export function eventTimeLabel(e: EventType): string {
  if (e.startTime || e.endTime) return formatTimeRange(eventStartTime(e), eventEndTime(e));
  const t = parseTimes(e.time);
  if (t.length) return formatTimeRange(t[0], t[1] || t[0]);
  return e.time || formatTimeRange(DEFAULT_TIME, DEFAULT_TIME);
}
