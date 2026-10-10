// Club data access. Later: GET/POST/PUT/DELETE /api/clubs
import { ROLES, CLUB_STATUS } from '../utils/constants';
import { makeId } from '../utils/formatters';
import { validateClub } from '../utils/validation';
import { requireRole, clubOf, withoutEvents } from './permissions';

export const listClubs = (db) => db.clubs;
export const activeClubs = (db) => db.clubs.filter((c) => c.status === CLUB_STATUS.ACTIVE);
export const getClub = (db, id) => db.clubs.find((c) => c.clubId === id) || null;
export const getClubByOrganizer = (db, userId) => db.clubs.find((c) => c.organizerId === userId) || null;
export const organizerOf = (db, club) => db.users.find((u) => u.userId === club?.organizerId) || null;

// Organizers that are free to be assigned (or already assigned to `exceptClubId`).
export function availableOrganizers(db, exceptClubId = null) {
  return db.users.filter(
    (u) =>
      u.role === ROLES.ORGANIZER &&
      u.status === 'Active' &&
      !db.clubs.some((c) => c.organizerId === u.userId && c.clubId !== exceptClubId)
  );
}

function checkOrganizer(db, organizerId, clubId) {
  if (!organizerId) return;
  const u = db.users.find((x) => x.userId === organizerId);
  if (!u || u.role !== ROLES.ORGANIZER) throw new Error('The selected organizer is not a Club Organizer account.');
  if (db.clubs.some((c) => c.organizerId === organizerId && c.clubId !== clubId))
    throw new Error('That organizer already manages another club.');
}

function firstError(errors) {
  const keys = Object.keys(errors);
  if (keys.length) throw new Error(errors[keys[0]]);
}

export function createClub(db, actor, form) {
  requireRole(actor, ROLES.ADMIN);
  firstError(validateClub(form));
  checkOrganizer(db, form.organizerId || null, null);
  const club = {
    clubId: makeId('c'),
    name: form.name.trim(),
    description: form.description.trim(),
    category: form.category,
    status: form.status || CLUB_STATUS.ACTIVE,
    organizerId: form.organizerId || null,
  };
  return { db: { ...db, clubs: [...db.clubs, club] }, result: club };
}

// Admin may edit everything. An organizer may edit only name/description/category of their own club.
export function updateClub(db, actor, clubId, form) {
  requireRole(actor, ROLES.ADMIN, ROLES.ORGANIZER);
  const club = getClub(db, clubId);
  if (!club) throw new Error('Club not found.');
  let patch = form;
  if (actor.role === ROLES.ORGANIZER) {
    if (clubOf(db, actor)?.clubId !== clubId) throw new Error('You can only edit your own club.');
    patch = { name: form.name, description: form.description, category: form.category };
  }
  const merged = { ...club, ...patch };
  firstError(validateClub(merged));
  if (actor.role === ROLES.ADMIN) checkOrganizer(db, merged.organizerId || null, clubId);
  const next = {
    ...merged,
    name: merged.name.trim(),
    description: merged.description.trim(),
    organizerId: merged.organizerId || null,
  };
  return { db: { ...db, clubs: db.clubs.map((c) => (c.clubId === clubId ? next : c)) }, result: next };
}

export const setClubStatus = (db, actor, clubId, status) => updateClub(db, actor, clubId, { status });

// Deleting a club also deletes its events and their registrations (cascade).
export function deleteClub(db, actor, clubId) {
  requireRole(actor, ROLES.ADMIN);
  const club = getClub(db, clubId);
  if (!club) throw new Error('Club not found.');
  const eventIds = db.events.filter((e) => e.clubId === clubId).map((e) => e.eventId);
  const next = withoutEvents(db, eventIds);
  return { db: { ...next, clubs: next.clubs.filter((c) => c.clubId !== clubId) }, result: { club, removedEvents: eventIds.length } };
}
