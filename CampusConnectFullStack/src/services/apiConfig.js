// Where the REST API lives. By default the frontend and API are served by the same server,
// so a relative path works. To host the frontend elsewhere, set VITE_API_BASE_URL at build time,
// e.g. https://your-api.onrender.com/api
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
