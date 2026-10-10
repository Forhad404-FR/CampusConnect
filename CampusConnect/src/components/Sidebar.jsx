import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Building2, CalendarDays, PlusCircle, Users, ClipboardCheck, Ticket, Home, X } from 'lucide-react';
import { Brand } from './Navbar';
import { ROLES } from '../utils/constants';

const NAV = {
  [ROLES.STUDENT]: [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/registrations', label: 'My registrations', icon: Ticket },
    { to: '/events', label: 'Browse events', icon: CalendarDays },
    { to: '/clubs', label: 'Browse clubs', icon: Building2 },
  ],
  [ROLES.ORGANIZER]: [
    { to: '/organizer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/organizer/club', label: 'My club', icon: Building2 },
    { to: '/organizer/events', label: 'My events', icon: CalendarCheck, end: true },
    { to: '/organizer/events/new', label: 'Create event', icon: PlusCircle },
  ],
  [ROLES.ADMIN]: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/clubs', label: 'Clubs', icon: Building2 },
    { to: '/admin/events', label: 'Event approvals', icon: ClipboardCheck },
  ],
};

export default function Sidebar({ role, open, onClose }) {
  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar${open ? ' open' : ''}`} aria-label="Dashboard navigation">
        <div className="sidebar-head">
          <Brand light />
          <button className="icon-btn sidebar-close" onClick={onClose} aria-label="Close menu"><X size={20} /></button>
        </div>
        <div className="sidebar-role">{role}</div>
        <nav className="sidebar-nav">
          {NAV[role].map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}>
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="side-link side-foot"><Home size={18} aria-hidden="true" />Public website</Link>
      </aside>
    </>
  );
}
