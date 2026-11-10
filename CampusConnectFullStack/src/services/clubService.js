// Club selectors read the loaded data; mutations call the REST API.
import { ROLES, CLUB_STATUS } from '../utils/constants';
import { api } from './api';

export const listClubs = (db) => db.clubs;
export const activeClubs = (db) => db.clubs.filter((c) => c.status === CLUB_STATUS.ACTIVE);
export const getClub = (db, id) => db.clubs.find((c) => c.clubId === id) || null;
export const getClubByOrganizer = (db, userId) => db.clubs.find((c) => c.organizerId === userId) || null;
export const organizerOf = (db, club) =>
  db.users.find((u) => u.userId === club?.organizerId) || (club?.organizerName ? { name: club.organizerName } : null);

// Organizers that are free to be assigned (or already assigned to `exceptClubId`). Admin only.
export function availableOrganizers(db, exceptClubId = null) {
  return db.users.filter(
    (u) => u.role === ROLES.ORGANIZER && u.status === 'Active' && !db.clubs.some((c) => c.organizerId === u.userId && c.clubId !== exceptClubId)
  );
}

export const createClub = async (db, actor, form) => ({ result: (await api.post('/clubs', form)).club });
export const updateClub = async (db, actor, clubId, form) => ({ result: (await api.put(`/clubs/${clubId}`, form)).club });
export const setClubStatus = (db, actor, clubId, status) => updateClub(db, actor, clubId, { status });
export const deleteClub = async (db, actor, clubId) => ({ result: await api.delete(`/clubs/${clubId}`) });
