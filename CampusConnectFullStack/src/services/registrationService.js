// Registration selectors read the loaded data; mutations call the REST API.
// The server re-checks every rule, so a student can never bypass them from the browser.
import { ROLES, EVENT_STATUS } from '../utils/constants';
import { isPastEvent, eventDateTime } from '../utils/formatters';
import { api } from './api';
import { getEvent, registrationCount } from './eventService';

export const findRegistration = (db, eventId, studentId) =>
  db.registrations.find((r) => r.eventId === eventId && r.studentId === studentId) || null;

// Readable reason why registration is not possible, or null when it is (used to disable the button).
export function registrationBlockReason(db, user, event) {
  if (!user || user.role !== ROLES.STUDENT) return 'Only student accounts can register for events.';
  if (event.status === EVENT_STATUS.PENDING) return 'This event is waiting for admin approval.';
  if (event.status === EVENT_STATUS.REJECTED) return 'This event was not approved.';
  if (isPastEvent(event)) return 'This event has already taken place.';
  if (findRegistration(db, event.eventId, user.userId)) return 'You are already registered for this event.';
  if (registrationCount(db, event.eventId) >= event.capacity) return 'This event is full.';
  return null;
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

// "Registered" until the event is over, then the attendance the organizer recorded.
export const displayStatus = (reg) => (isPastEvent(reg.event) ? reg.attendance : 'Registered');

// For organizers the server sends each registration with the student's name and email.
export function listParticipants(db, actor, eventId) {
  return db.registrations
    .filter((r) => r.eventId === eventId)
    .map((r) => ({ ...r, student: r.student || null }))
    .sort((a, b) => (a.student?.name || '').localeCompare(b.student?.name || ''));
}

export const registerForEvent = async (db, actor, eventId) => ({ result: (await api.post(`/events/${eventId}/registrations`)).registration });
export const cancelRegistration = async (db, actor, registrationId) => ({ result: await api.delete(`/registrations/${registrationId}`) });
export const setAttendance = async (db, actor, registrationId, value) => ({ result: (await api.patch(`/registrations/${registrationId}/attendance`, { attendance: value })).registration });
