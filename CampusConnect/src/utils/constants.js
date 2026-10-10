export const ROLES = { STUDENT: 'Student', ORGANIZER: 'Club Organizer', ADMIN: 'Admin' };
export const EVENT_STATUS = { PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected' };
export const ATTENDANCE = { PRESENT: 'Present', ABSENT: 'Absent' };
export const CLUB_STATUS = { ACTIVE: 'Active', INACTIVE: 'Inactive' };
export const USER_STATUS = { ACTIVE: 'Active', DISABLED: 'Disabled' };

export const CLUB_CATEGORIES = [
  'Technology',
  'Arts & Culture',
  'Academic & Debate',
  'Media & Photography',
  'Sports & Wellness',
  'Community Service',
  'Entrepreneurship',
];

// Used only for the small club avatar squares.
export const CATEGORY_COLORS = {
  Technology: '#1E4FBF',
  'Arts & Culture': '#8A3FA8',
  'Academic & Debate': '#0F766E',
  'Media & Photography': '#B45309',
  'Sports & Wellness': '#15803D',
  'Community Service': '#BE185D',
  Entrepreneurship: '#475569',
};

export const DEMO_PASSWORD = 'Demo123!';
export const DEMO_ACCOUNTS = [
  { role: ROLES.STUDENT, email: 'student@campusconnect.demo' },
  { role: ROLES.ORGANIZER, email: 'organizer@campusconnect.demo' },
  { role: ROLES.ADMIN, email: 'admin@campusconnect.demo' },
];

export const APP_INFO = { name: 'CampusConnect', version: '1.0.0 (frontend demo)' };

export const roleHome = (role) =>
  role === ROLES.ADMIN ? '/admin/dashboard' : role === ROLES.ORGANIZER ? '/organizer/dashboard' : '/student/dashboard';
