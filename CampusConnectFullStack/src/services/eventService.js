// Event selectors read the loaded data; mutations call the REST API.
import { ROLES, EVENT_STATUS } from '../utils/constants';
import { eventDateTime } from '../utils/formatters';
import { api } from './api';
import { clubOf } from './permissions';

export const getEvent = (db, id) => db.events.find((e) => e.eventId === id) || null;
export const eventsForClub = (db, clubId) => db.events.filter((e) => e.clubId === clubId);
export const publicEvents = (db) => db.events.filter((e) => e.status === EVENT_STATUS.APPROVED);
// The server sends registeredCount with every event (counts are public, names are not).
export const registrationCount = (db, eventId) => getEvent(db, eventId)?.registeredCount ?? 0;
export const seatsLeft = (db, event) => Math.max(0, event.capacity - (event.registeredCount ?? 0));
export const sortByDate = (list) => [...list].sort((a, b) => eventDateTime(a) - eventDateTime(b));

export function canViewEvent(db, user, event) {
  if (!event) return false;
  if (event.status === EVENT_STATUS.APPROVED) return true;
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  return user.role === ROLES.ORGANIZER && clubOf(db, user)?.clubId === event.clubId;
}

export const createEvent = async (db, actor, form) => ({ result: (await api.post('/events', form)).event });
export const updateEvent = async (db, actor, eventId, form) => ({ result: (await api.put(`/events/${eventId}`, form)).event });
export const deleteEvent = async (db, actor, eventId) => ({ result: await api.delete(`/events/${eventId}`) });
export const setEventStatus = async (db, actor, eventId, status) => ({ result: (await api.patch(`/events/${eventId}/status`, { status })).event });
