// Registration + attendance. Later: POST/DELETE /api/events/:id/registrations, PATCH /api/registrations/:id/attendance
import { ROLES, EVENT_STATUS, ATTENDANCE } from '../utils/constants';
import { makeId, todayISO, isPastEvent, eventDateTime } from '../utils/formatters';
import { requireRole, requireEventOwner } from './permissions';
import { getEvent, registrationCount } from './eventService';

export const findRegistration = (db, eventId, studentId) =>
  db.registrations.find((r) => r.eventId === eventId && r.studentId === studentId) || null;

// Returns a readable reason why the user cannot register, or null when registration is allowed.
export function registrationBlockReason(db, user, event) {
  if (!user || user.role !== ROLES.STUDENT) return 'Only student accounts can register for events.';
  if (event.status === EVENT_STATUS.PENDING) return 'This event is waiting for admin approval.';
  if (event.status === EVENT_STATUS.REJECTED) return 'This event was not approved.';
  if (isPastEvent(event)) return 'This event has already taken place.';
  if (findRegistration(db, event.eventId, user.userId)) return 'You are already registered for this event.';
  if (registrationCount(db, event.eventId) >= event.capacity) return 'This event is full.';
  return null;
}

export function registerForEvent(db, actor, eventId) {
  requireRole(actor, ROLES.STUDENT);
  const event = getEvent(db, eventId);
  if (!event) throw new Error('Event not found.');
  const reason = registrationBlockReason(db, actor, event);
  if (reason) throw new Error(reason);
  const registration = {
    registrationId: makeId('r'),
    eventId,
    studentId: actor.userId,
    registrationDate: todayISO(),
    attendance: ATTENDANCE.ABSENT, // default until the organizer marks the student Present
  };
  return { db: { ...db, registrations: [...db.registrations, registration] }, result: registration };
}

export function cancelRegistration(db, actor, registrationId) {
  requireRole(actor, ROLES.STUDENT);
  const reg = db.registrations.find((r) => r.registrationId === registrationId);
  if (!reg || reg.studentId !== actor.userId) throw new Error('Registration not found.');
  const event = getEvent(db, reg.eventId);
  if (event && isPastEvent(event)) throw new Error("Registrations for past events can't be cancelled.");
  return { db: { ...db, registrations: db.registrations.filter((r) => r.registrationId !== registrationId) }, result: reg };
}

export function listStudentRegistrations(db, studentId) {
  return db.registrations
    .filter((r) => r.studentId === studentId)
    .map((r) => {
      const event = getEvent(db, r.eventId);
      return event ? { ...r, event, club: db.clubs.find((c) => c.clubId === event.clubId) || null } : null;
    })
    .filter(Boolean)
    .sort((a, b) => eventDateTime(a.event) - eventDateTime(b.event));
}

// What the student sees as the registration status: "Registered" until the event is over, then attendance.
export const displayStatus = (reg) => (isPastEvent(reg.event) ? reg.attendance : 'Registered');

export function listParticipants(db, actor, eventId) {
  requireEventOwner(db, actor, eventId);
  return db.registrations
    .filter((r) => r.eventId === eventId)
    .map((r) => ({ ...r, student: db.users.find((u) => u.userId === r.studentId) || null }))
    .sort((a, b) => (a.student?.name || '').localeCompare(b.student?.name || ''));
}

export function setAttendance(db, actor, registrationId, value) {
  const reg = db.registrations.find((r) => r.registrationId === registrationId);
  if (!reg) throw new Error('That registration no longer exists.');
  requireEventOwner(db, actor, reg.eventId);
  if (![ATTENDANCE.PRESENT, ATTENDANCE.ABSENT].includes(value)) throw new Error('Choose Present or Absent.');
  const next = { ...reg, attendance: value };
  return { db: { ...db, registrations: db.registrations.map((r) => (r.registrationId === registrationId ? next : r)) }, result: next };
}
