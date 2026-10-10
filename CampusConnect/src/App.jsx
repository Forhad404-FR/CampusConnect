import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { AppDataProvider } from './context/AppDataContext';
import { AuthProvider } from './context/AuthContext';
import RequireRole from './components/RequireRole';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { ROLES } from './utils/constants';

import Home from './pages/Home';
import Clubs from './pages/Clubs';
import ClubDetails from './pages/ClubDetails';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentRegistrations from './pages/student/StudentRegistrations';

import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import OrganizerClub from './pages/organizer/OrganizerClub';
import OrganizerEvents from './pages/organizer/OrganizerEvents';
import OrganizerEventNew from './pages/organizer/OrganizerEventNew';
import OrganizerEventEdit from './pages/organizer/OrganizerEventEdit';
import OrganizerParticipants from './pages/organizer/OrganizerParticipants';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminClubs from './pages/admin/AdminClubs';
import AdminEvents from './pages/admin/AdminEvents';

export default function App() {
  return (
    <ToastProvider>
      <AppDataProvider>
        <AuthProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="clubs" element={<Clubs />} />
              <Route path="clubs/:clubId" element={<ClubDetails />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:eventId" element={<EventDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="student" element={<RequireRole role={ROLES.STUDENT}><DashboardLayout /></RequireRole>}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="registrations" element={<StudentRegistrations />} />
            </Route>

            <Route path="organizer" element={<RequireRole role={ROLES.ORGANIZER}><DashboardLayout /></RequireRole>}>
              <Route path="dashboard" element={<OrganizerDashboard />} />
              <Route path="club" element={<OrganizerClub />} />
              <Route path="events" element={<OrganizerEvents />} />
              <Route path="events/new" element={<OrganizerEventNew />} />
              <Route path="events/:eventId/edit" element={<OrganizerEventEdit />} />
              <Route path="events/:eventId/participants" element={<OrganizerParticipants />} />
            </Route>

            <Route path="admin" element={<RequireRole role={ROLES.ADMIN}><DashboardLayout /></RequireRole>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="clubs" element={<AdminClubs />} />
              <Route path="events" element={<AdminEvents />} />
            </Route>
          </Routes>
        </AuthProvider>
      </AppDataProvider>
    </ToastProvider>
  );
}
