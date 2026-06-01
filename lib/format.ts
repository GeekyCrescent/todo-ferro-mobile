/** Date helpers for due dates — all relative to the local "today". */

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const atMidnight = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Whole-day difference (target - today). Negative = past. */
export const daysFromToday = (iso: string): number => {
  const target = atMidnight(new Date(iso));
  const today = atMidnight(new Date());
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY);
};

export const isOverdue = (iso?: string | null, completed?: boolean): boolean => {
  if (!iso || completed) return false;
  return daysFromToday(iso) < 0;
};

export const isDueSoon = (iso?: string | null, completed?: boolean): boolean => {
  if (!iso || completed) return false;
  const d = daysFromToday(iso);
  return d >= 0 && d <= 2;
};

const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

/** Friendly, short label: "Hoy", "Mañana", "Ayer", "en 3 días", "12 mar". */
export const formatDueDate = (iso?: string | null): string => {
  if (!iso) return "";
  const d = daysFromToday(iso);
  if (d === 0) return "Hoy";
  if (d === 1) return "Mañana";
  if (d === -1) return "Ayer";
  if (d > 1 && d <= 6) return `En ${d} días`;
  if (d < -1 && d >= -6) return `Hace ${Math.abs(d)} días`;
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
};

/** ISO date (yyyy-MM-dd) at local midnight, what the API expects. */
export const toApiDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
