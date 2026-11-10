export const pad = (n) => String(n).padStart(2, '0');

export function toISODate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export const todayISO = () => toISODate(new Date());

export function addDaysISO(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function eventDateTime(event) {
  return new Date(`${event.date}T${event.time || '00:00'}:00`);
}
export const isPastEvent = (event) => eventDateTime(event).getTime() < Date.now();

export function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateParts(iso) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return { day: '--', month: '---' };
  return { day: String(d.getDate()), month: d.toLocaleDateString('en-GB', { month: 'short' }) };
}

export function formatTime(t) {
  if (!t) return '-';
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`;
}

export function makeId(prefix) {
  return prefix + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
}

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}
