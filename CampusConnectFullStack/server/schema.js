// Tables match the project ER diagram (USER, CLUB, EVENT, REGISTRATION).
// Cascades keep data consistent: deleting a club deletes its events, deleting an event or
// student deletes their registrations, deleting an organizer just un-assigns the club.
export const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS clubs (
  club_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  organizer_id TEXT REFERENCES users(user_id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS events (
  event_id TEXT PRIMARY KEY,
  club_id TEXT NOT NULL REFERENCES clubs(club_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending'
);
CREATE TABLE IF NOT EXISTS registrations (
  registration_id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  registration_date TEXT NOT NULL,
  attendance TEXT NOT NULL DEFAULT 'Absent',
  UNIQUE (event_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_events_club ON events(club_id);
CREATE INDEX IF NOT EXISTS idx_reg_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_reg_student ON registrations(student_id);
`;
