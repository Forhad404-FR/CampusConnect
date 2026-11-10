// Client-side helper only. The REAL permission checks run on the server (server/app.js).
export const clubOf = (db, actor) => (actor ? db.clubs.find((c) => c.organizerId === actor.userId) || null : null);
