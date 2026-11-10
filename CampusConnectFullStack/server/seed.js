// Sample data. Dates are relative to "today" so upcoming events are really upcoming when seeded.
import { ROLES, EVENT_STATUS as S, DEMO_PASSWORD } from '../src/utils/constants.js';
import { hashPassword } from './auth.js';
import { addDaysISO, todayISO } from './time.js';

export async function seedDatabase(db) {
  // Wipe in dependency order (safe on an existing database: this is also "Reset demo data").
  for (const t of ['registrations', 'events', 'clubs', 'users']) await db.run(`DELETE FROM ${t}`);

  const now = new Date().toISOString();
  const users = [
    ['u1', 'Sadia Karim', 'admin@campusconnect.demo', ROLES.ADMIN, 'Active'],
    ['u2', 'Tanvir Ahmed', 'organizer@campusconnect.demo', ROLES.ORGANIZER, 'Active'],
    ['u3', 'Anika Rahman', 'student@campusconnect.demo', ROLES.STUDENT, 'Active'],
    ['u4', 'Rafi Hasan', 'rafi.hasan@campusconnect.demo', ROLES.STUDENT, 'Active'],
    ['u5', 'Nabila Islam', 'nabila.islam@campusconnect.demo', ROLES.STUDENT, 'Active'],
    ['u6', 'Mahin Chowdhury', 'culture.organizer@campusconnect.demo', ROLES.ORGANIZER, 'Active'],
    ['u7', 'Ishrat Jahan', 'debate.organizer@campusconnect.demo', ROLES.ORGANIZER, 'Active'],
    ['u8', 'Arif Mahmud', 'photo.organizer@campusconnect.demo', ROLES.ORGANIZER, 'Active'],
    ['u9', 'Sabbir Khan', 'sabbir.khan@campusconnect.demo', ROLES.STUDENT, 'Active'],
    ['u10', 'Tasnim Akter', 'tasnim.akter@campusconnect.demo', ROLES.STUDENT, 'Disabled'],
  ];
  for (const [id, name, email, role, status] of users) {
    await db.run('INSERT INTO users (user_id, name, email, password_hash, role, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [id, name, email, hashPassword(DEMO_PASSWORD), role, status, now]);
  }

  const clubs = [
    ['c1', 'Programming & Robotics Club', 'Technology', 'u2', 'A hands-on community for coding, competitive programming, web development and robotics. We run weekly workshops, project nights and the annual inter-department hackathon.'],
    ['c2', 'Cultural Society', 'Arts & Culture', 'u6', 'Celebrating music, dance, poetry and theatre on campus. The society organises open mics, festival programmes and the yearly cultural evening.'],
    ['c3', 'Debating Club', 'Academic & Debate', 'u7', 'Sharpen your public speaking and argument skills through practice rounds, masterclasses and inter-university tournaments.'],
    ['c4', 'Photography Club', 'Media & Photography', 'u8', 'Photo walks, editing sessions and exhibitions for students who love visual storytelling, from beginners to experienced shooters.'],
  ];
  for (const [id, name, category, org, description] of clubs) {
    await db.run("INSERT INTO clubs (club_id, name, description, category, status, organizer_id) VALUES ($1,$2,$3,$4,'Active',$5)", [id, name, description, category, org]);
  }

  const events = [
    ['e1', 'c1', 'Intro to Web Development Workshop', 'Build and publish your first web page with HTML, CSS and JavaScript. Bring a laptop; no prior experience needed.', 5, '14:00', 'Room 402, Academic Building', 40, S.APPROVED],
    ['e2', 'c1', 'Inter-Department Hackathon 2026', 'A 6-hour team hackathon open to every department. Form teams of up to four and build a solution to a campus problem.', 18, '09:00', 'Main Auditorium', 60, S.APPROVED],
    ['e3', 'c1', 'Git & GitHub for Beginners', 'Learn version control basics: commits, branches and pull requests, with a guided practice repository.', -12, '15:00', 'Computer Lab 2', 30, S.APPROVED],
    ['e4', 'c1', 'Robotics Showcase', 'Student teams demonstrate their line-following and obstacle-avoiding robots to faculty judges.', 30, '11:00', 'Engineering Workshop Hall', 50, S.PENDING],
    ['e5', 'c2', 'Annual Cultural Evening', 'An evening of music, dance and poetry performed by students from all departments.', 12, '17:30', 'Main Auditorium', 200, S.APPROVED],
    ['e6', 'c2', 'Folk Music Open Mic', 'Sing, play or simply listen. Sign up for a five-minute slot on arrival.', 8, '16:00', 'Student Lounge', 3, S.APPROVED],
    ['e7', 'c3', 'Debate Practice Round', 'A friendly practice round on a motion announced on the day, with feedback from senior debaters.', 3, '15:30', 'Seminar Hall B', 30, S.APPROVED],
    ['e8', 'c3', 'Public Speaking Masterclass', 'A guest trainer covers structure, delivery and managing nerves. Includes a short speaking exercise.', 22, '10:00', 'Conference Room 1', 80, S.PENDING],
    ['e9', 'c4', 'Campus Photo Walk', 'Golden-hour walk around the campus with composition tips from club mentors. Phone cameras welcome.', 10, '07:30', 'Main Gate', 20, S.APPROVED],
    ['e10', 'c4', 'Annual Photo Exhibition', 'Showcase of selected student photographs in the library gallery.', 40, '10:00', 'Library Gallery', 100, S.REJECTED],
    ['e11', 'c2', 'Poetry Evening', 'Original and classic poems read aloud in a relaxed setting.', -30, '18:00', 'Student Lounge', 40, S.APPROVED],
  ];
  for (const [id, club, title, description, offset, time, location, capacity, status] of events) {
    await db.run('INSERT INTO events (event_id, club_id, title, description, event_date, event_time, location, capacity, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [id, club, title, description, addDaysISO(offset), time, location, capacity, status]);
  }

  const regs = [
    ['r1', 'e3', 'u3', 20, 'Present'], ['r2', 'e3', 'u4', 19, 'Present'], ['r3', 'e3', 'u5', 18, 'Absent'], ['r4', 'e3', 'u9', 17, 'Present'],
    ['r5', 'e11', 'u3', 38, 'Present'], ['r6', 'e11', 'u5', 36, 'Present'], ['r7', 'e11', 'u4', 35, 'Absent'],
    ['r8', 'e1', 'u3', 2, 'Absent'], ['r9', 'e1', 'u4', 2, 'Absent'], ['r10', 'e1', 'u5', 1, 'Absent'],
    ['r11', 'e2', 'u4', 1, 'Absent'], ['r12', 'e5', 'u3', 3, 'Absent'],
    ['r13', 'e6', 'u4', 4, 'Absent'], ['r14', 'e6', 'u5', 3, 'Absent'], ['r15', 'e6', 'u9', 2, 'Absent'],
    ['r16', 'e7', 'u3', 1, 'Absent'], ['r17', 'e7', 'u9', 1, 'Absent'],
    ['r18', 'e9', 'u5', 2, 'Absent'], ['r19', 'e9', 'u9', 0, 'Absent'],
  ];
  for (const [id, event, student, daysAgo, attendance] of regs) {
    await db.run('INSERT INTO registrations (registration_id, event_id, student_id, registration_date, attendance) VALUES ($1,$2,$3,$4,$5)',
      [id, event, student, daysAgo === 0 ? todayISO() : addDaysISO(-daysAgo), attendance]);
  }
}
