// Admin user management. Mutations call the REST API and return { result }.
// (db and actor arguments are kept so every service has the same call shape.)
import { api } from './api';

export const listUsers = (db) => db.users;
export const getUser = (db, id) => db.users.find((u) => u.userId === id) || null;

export const updateUserRole = async (db, actor, userId, role) => ({ result: (await api.patch(`/users/${userId}`, { role })).user });
export const setUserStatus = async (db, actor, userId, status) => ({ result: (await api.patch(`/users/${userId}`, { status })).user });
export const deleteUser = async (db, actor, userId) => ({ result: (await api.delete(`/users/${userId}`)).user });
