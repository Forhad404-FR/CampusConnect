import { addDaysISO } from '../utils/formatters';
import { ROLES, EVENT_STATUS as S, DEMO_PASSWORD } from '../utils/constants';

// Bump DATA_VERSION whenever the shape of the stored data changes.
// Older stored data is then discarded and replaced with fresh sample data.
export const DATA_VERSION = 1;

// Dates are relative to "today" so the sample events are always upcoming/past as intended.
export function buildInitialData() {
  const user = (userId, name, email, role, status = 'Active') => ({
    userId, name, email, password: DEMO_PASSWORD, role, status, // password: DEMO ONLY mock data
  });

  const users = [
    user('u1', 'Sadia Karim', 'admin@campusconnect.demo', ROLES.ADMIN),
    user('u2', 'Tanvir Ahmed', 'organizer@campusconnect.demo', ROLES.ORGANIZER),
    user('u3', 'Anika Rahman', 'student@campusconnect.demo', ROLES.STUDENT),
    user('u4', 'Rafi Hasan', 'rafi.hasan@campusconnect.demo', ROLES.STUDENT),
    user('u5', 'Nabila Islam', 'nabila.islam@campusconnect.demo', ROLES.STUDENT),
    user('u6', 'Mahin Chowdhury', 'culture.organizer@campusconnect.demo', ROLES.ORGANIZER),
    user('u7', 'Ishrat Jahan', 'debate.organizer@campusconnect.demo', ROLES.ORGANIZER),
    user('u8', 'Arif Mahmud', 'photo.organizer@campusconnect.demo', ROLES.ORGANIZER),
    user('u9', 'Sabbir Khan', 'sabbir.khan@campusconnect.demo', ROLES.STUDENT),
    user('u10', 'Tasnim Akter', 'tasnim.akter@campusconnect.demo', ROLES.STUDENT, 'Disabled'),
  ];

  const clubs = [
    {
      clubId: 'c1', name: 'Programming & Robotics Club', category: 'Technology', status: 'Active', organizerId: 'u2',
      description: 'A hands-on community for coding, competitive programming, web development and robotics. We run weekly workshops, project nights and the annual inter-department hackathon.',
    },
    {
      clubId: 'c2', name: 'Cultural Society', category: 'Arts & Culture', status: 'Active', organizerId: 'u6',
      description: 'Celebrating music, dance, poetry and theatre on campus. The society organises open mics, festival programmes and the yearly cultural evening.',
    },
    {
      clubId: 'c3', name: 'Debating Club', category: 'Academic & Debate', status: 'Active', organizerId: 'u7',
      description: 'Sharpen your public speaking and argument skills through practice rounds, masterclasses and inter-university tournaments.',
    },
    {
      clubId: 'c4', name: 'Photography Club', category: 'Media & Photography', status: 'Active', organizerId: 'u8',
      description: 'Photo walks, editing sessions and exhibitions for students who love visual storytelling, from beginners to experienced shooters.',
    },
  ];

  const ev = (eventId, clubId, title, description, offset, time, location, capacity, status) => ({
    eventId, clubId, title, description, date: addDaysISO(offset), time, location, capacity, status,
  });

  const events = [
    ev('e1', 'c1', 'Intro to Web Development Workshop', 'Build and publish your first web page with HTML, CSS and JavaScript. Bring a laptop; no prior experience needed.', 5, '14:00', 'Room 402, Academic Building', 40, S.APPROVED),
    ev('e2', 'c1', 'Inter-Department Hackathon 2026', 'A 6-hour team hackathon open to every department. Form teams of up to four and build a solution to a campus problem.', 18, '09:00', 'Main Auditorium', 60, S.APPROVED),
    ev('e3', 'c1', 'Git & GitHub for Beginners', 'Learn version control basics: commits, branches and pull requests, with a guided practice repository.', -12, '15:00', 'Computer Lab 2', 30, S.APPROVED),
    ev('e4', 'c1', 'Robotics Showcase', 'Student teams demonstrate their line-following and obstacle-avoiding robots to faculty judges.', 30, '11:00', 'Engineering Workshop Hall', 50, S.PENDING),
    ev('e5', 'c2', 'Annual Cultural Evening', 'An evening of music, dance and poetry performed by students from all departments.', 12, '17:30', 'Main Auditorium', 200, S.APPROVED),
    ev('e6', 'c2', 'Folk Music Open Mic', 'Sing, play or simply listen. Sign up for a five-minute slot on arrival.', 8, '16:00', 'Student Lounge', 3, S.APPROVED),
    ev('e7', 'c3', 'Debate Practice Round', 'A friendly practice round on a motion announced on the day, with feedback from senior debaters.', 3, '15:30', 'Seminar Hall B', 30, S.APPROVED),
    ev('e8', 'c3', 'Public Speaking Masterclass', 'A guest trainer covers structure, delivery and managing nerves. Includes a short speaking exercise.', 22, '10:00', 'Conference Room 1', 80, S.PENDING),
    ev('e9', 'c4', 'Campus Photo Walk', 'Golden-hour walk around the campus with composition tips from club mentors. Phone cameras welcome.', 10, '07:30', 'Main Gate', 20, S.APPROVED),
    ev('e10', 'c4', 'Annual Photo Exhibition', 'Showcase of selected student photographs in the library gallery.', 40, '10:00', 'Library Gallery', 100, S.REJECTED),
    ev('e11', 'c2', 'Poetry Evening', 'Original and classic poems read aloud in a relaxed setting.', -30, '18:00', 'Student Lounge', 40, S.APPROVED),
  ];

  const reg = (registrationId, eventId, studentId, daysAgo, attendance = 'Absent') => ({
    registrationId, eventId, studentId, registrationDate: addDaysISO(-daysAgo), attendance,
  });

  const registrations = [
    reg('r1', 'e3', 'u3', 20, 'Present'),
    reg('r2', 'e3', 'u4', 19, 'Present'),
    reg('r3', 'e3', 'u5', 18, 'Absent'),
    reg('r4', 'e3', 'u9', 17, 'Present'),
    reg('r5', 'e11', 'u3', 38, 'Present'),
    reg('r6', 'e11', 'u5', 36, 'Present'),
    reg('r7', 'e11', 'u4', 35, 'Absent'),
    reg('r8', 'e1', 'u3', 2),
    reg('r9', 'e1', 'u4', 2),
    reg('r10', 'e1', 'u5', 1),
    reg('r11', 'e2', 'u4', 1),
    reg('r12', 'e5', 'u3', 3),
    reg('r13', 'e6', 'u4', 4),
    reg('r14', 'e6', 'u5', 3),
    reg('r15', 'e6', 'u9', 2),
    reg('r16', 'e7', 'u3', 1),
    reg('r17', 'e7', 'u9', 1),
    reg('r18', 'e9', 'u5', 2),
    reg('r19', 'e9', 'u9', 0),
  ];

  return { version: DATA_VERSION, seededAt: new Date().toISOString(), users, clubs, events, registrations };
}
