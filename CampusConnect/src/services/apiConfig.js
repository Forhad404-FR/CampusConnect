// Central place for the future REST API settings.
// The demo does NOT call any API: every service currently reads/writes localStorage
// through services/storage.js. When a backend exists, point API_BASE_URL at it
// (via VITE_API_BASE_URL) and replace the service function bodies with fetch() calls.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const USE_REST_API = false; // informational flag, shown on the admin "System information" card
