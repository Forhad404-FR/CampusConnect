// Admin user management. Later: GET/PATCH/DELETE /api/users
import { ROLES, USER_STATUS } from '../utils/constants';
import { requireRole } from './permissions';

export const listUsers = (db) => db.users;
export const getUser = (db, id) => db.users.find((u) => u.userId === id) || null;

function findTarget(db, actor, userId, verb) {
  requireRole(actor, ROLES.ADMIN);
  if (userId === actor.userId) throw new Error(`You can't ${verb} your own account.`);
  const user = getUser(db, userId);
  if (!user) throw new Error('User not found.');
  return user;
}

const unassignClubs = (clubs, userId) => clubs.map((c) => (c.organizerId === userId ? { ...c, organizerId: null } : c));

export function updateUserRole(db, actor, userId, role) {
  const user = findTarget(db, actor, userId, 'change the role of');
  if (!Object.values(ROLES).includes(role)) throw new Error('Choose a valid role.');
  let next = { ...db, users: db.users.map((u) => (u.userId === userId ? { ...u, role } : u)) };
  // Keep data consistent: only organizers manage clubs, only students hold registrations.
  if (role !== ROLES.ORGANIZER) next = { ...next, clubs: unassignClubs(next.clubs, userId) };
  if (role !== ROLES.STUDENT) next = { ...next, registrations: next.registrations.filter((r) => r.studentId !== userId) };
  return { db: next, result: { ...user, role } };
}

export function setUserStatus(db, actor, userId, status) {
  const user = findTarget(db, actor, userId, 'disable');
  if (!Object.values(USER_STATUS).includes(status)) throw new Error('Choose a valid status.');
  return { db: { ...db, users: db.users.map((u) => (u.userId === userId ? { ...u, status } : u)) }, result: { ...user, status } };
}

export function deleteUser(db, actor, userId) {
  const user = findTarget(db, actor, userId, 'delete');
  return {
    db: {
      ...db,
      users: db.users.filter((u) => u.userId !== userId),
      clubs: unassignClubs(db.clubs, userId),
      registrations: db.registrations.filter((r) => r.studentId !== userId),
    },
    result: user,
  };
}
