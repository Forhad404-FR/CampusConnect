// Events are held on campus, so dates/times are interpreted in the campus time zone,
// not the server's (hosting servers usually run in UTC). Default: Bangladesh, UTC+06:00.
export const UTC_OFFSET = process.env.EVENT_UTC_OFFSET || '+06:00';

function offsetMinutes() {
  const m = /^([+-])(\d{2}):(\d{2})$/.exec(UTC_OFFSET);
  if (!m) return 360;
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

export function addDaysISO(n) {
  const d = new Date(Date.now() + offsetMinutes() * 60000 + n * 86400000);
  return d.toISOString().slice(0, 10);
}
export const todayISO = () => addDaysISO(0);
export const eventTimestamp = (date, time) => new Date(`${date}T${time || '00:00'}:00${UTC_OFFSET}`).getTime();
export const isPast = (date, time) => eventTimestamp(date, time) < Date.now();
