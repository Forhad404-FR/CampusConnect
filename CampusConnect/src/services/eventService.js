// Event data access and rules. Later: GET/POST/PUT/DELETE /api/events, PATCH /api/events/:id/status
import { ROLES, EVENT_STATUS } from '../utils/constants';
import { makeId, eventDateTime } from '../utils/formatters';
import { validateEvent } from '../utils/validation';
import { requireRole, clubOf, requireEventOwner, withoutEvents } from './permissions';

export const getEvent = (db, id) => db.events.find((e) => e.eventId === id) || null;
export const eventsForClub = (db, clubId) => db.events.filter((e) => e.clubId === clubId);
export const publicEvents = (db) => db.events.filter((e) => e.status === EVENT_STATUS.APPROVED);
export const registrationCount = (db, eventId) => db.registrations.filter((r) => r.eventId === eventId).length;
export const seatsLeft = (db, event) => Math.max(0, event.capacity - registrationCount(db, event.eventId));
export const sortByDate = (list) => [...list].sort((a, b) => eventDateTime(a) - eventDateTime(b));

// Approved events are public. Pending/Rejected ones are visible only to admins and the owning organizer.
export function canViewEvent(db, user, event) {
  if (!event) return false;
  if (event.status === EVENT_STATUS.APPROVED) return true;
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  return user.role === ROLES.ORGANIZER && clubOf(db, user)?.clubId === event.clubId;
}

function firstError(errors) {
  const keys = Object.keys(errors);
  if (keys.length) throw new Error(errors[keys[0]]);
}

export function createEvent(db, actor, form) {
  requireRole(actor, ROLES.ORGANIZER);
  const club = clubOf(db, actor);
  if (!club) throw new Error('No club is assigned to your account. Ask an administrator.');
  firstError(validateEvent(form));
  const event = {
    eventId: makeId('e'),
    clubId: club.clubId,
    title: form.title.trim(),
    description: form.description.trim(),
    date: form.date,
    time: form.time,
    location: form.location.trim(),
    capacity: Number(form.capacity),
    status: EVENT_STATUS.PENDING, // every new event waits for admin approval
  };
  return { db: { ...db, events: [...db.events, event] }, result: event };
}

// Editing a Rejected event re-submits it as Pending. Approved events stay Approved.
export function updateEvent(db, actor, eventId, form) {
  const event = requireEventOwner(db, actor, eventId);
  const changedWhen = form.date !== event.date || form.time !== event.time;
  firstError(validateEvent(form, { requireFuture: changedWhen }));
  const registered = registrationCount(db, eventId);
  if (Number(form.capacity) < registered)
    throw new Error(`Capacity can't be lower than the ${registered} students already registered.`);
  const next = {
    ...event,
    title: form.title.trim(),
    description: form.description.trim(),
    date: form.date,
    time: form.time,
    location: form.location.trim(),
    capacity: Number(form.capacity),
    status: event.status === EVENT_STATUS.REJECTED ? EVENT_STATUS.PENDING : event.status,
  };
  return { db: { ...db, events: db.events.map((e) => (e.eventId === eventId ? next : e)) }, result: next };
}

// Deleting an event also deletes its registrations (cascade).
export function deleteEvent(db, actor, eventId) {
  const event = requireEventOwner(db, actor, eventId);
  const removedRegistrations = registrationCount(db, eventId);
  return { db: withoutEvents(db, [eventId]), result: { event, removedRegistrations } };
}

export function setEventStatus(db, actor, eventId, status) {
  requireRole(actor, ROLES.ADMIN);
  const event = getEvent(db, eventId);
  if (!event) throw new Error('Event not found.');
  if (event.status !== EVENT_STATUS.PENDING) throw new Error('Only pending events can be approved or rejected.');
  if (![EVENT_STATUS.APPROVED, EVENT_STATUS.REJECTED].includes(status)) throw new Error('Choose Approved or Rejected.');
  const next = { ...event, status };
  return { db: { ...db, events: db.events.map((e) => (e.eventId === eventId ? next : e)) }, result: next };
}
