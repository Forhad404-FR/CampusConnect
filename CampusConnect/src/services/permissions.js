// Role/ownership checks used by the services.
// NOTE: in a frontend-only demo these checks run in the browser, so they are NOT real security.
// A real backend must repeat every one of them on the server.
import { ROLES } from '../utils/constants';

export function requireRole(actor, ...roles) {
  if (!actor) throw new Error('Log in to continue.');
  if (!roles.includes(actor.role)) throw new Error('Your account does not have permission to do that.');
}

export const clubOf = (db, actor) => (actor ? db.clubs.find((c) => c.organizerId === actor.userId) || null : null);

export function requireEventOwner(db, actor, eventId) {
  requireRole(actor, ROLES.ORGANIZER);
  const event = db.events.find((e) => e.eventId === eventId);
  if (!event) throw new Error('Event not found.');
  const club = clubOf(db, actor);
  if (!club || club.clubId !== event.clubId) throw new Error('You can only manage events that belong to your club.');
  return event;
}

// Removes events (and their registrations) from a db copy. Used by delete cascades.
export function withoutEvents(db, eventIds) {
  const ids = new Set(eventIds);
  return {
    ...db,
    events: db.events.filter((e) => !ids.has(e.eventId)),
    registrations: db.registrations.filter((r) => !ids.has(r.eventId)),
  };
}
