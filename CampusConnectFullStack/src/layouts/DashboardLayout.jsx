import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { initials } from '../utils/formatters';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <div className="dash">
      <Sidebar role={user.role} open={open} onClose={() => setOpen(false)} />
      <div className="dash-main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <span className="topbar-title">{user.role} workspace</span>
          <div className="topbar-user">
            <span className="avatar" aria-hidden="true">{initials(user.name)}</span>
            <div className="topbar-user-text">
              <strong>{user.name}</strong>
              <span className="muted small">{user.email}</span>
            </div>
            <Button variant="secondary" size="sm" icon={LogOut} onClick={() => { logout(); navigate('/'); }}>Log out</Button>
          </div>
        </header>
        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
