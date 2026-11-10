import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { roleHome } from '../utils/constants';

export function Brand({ light = false }) {
  return (
    <Link to="/" className={`brand${light ? ' brand-light' : ''}`} aria-label="CampusConnect home">
      <span className="brand-mark" aria-hidden="true">C</span>
      <span className="brand-name">CampusConnect</span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const close = () => setOpen(false);
  const link = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Brand />
        <button className="icon-btn nav-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-nav" aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav id="main-nav" className={`nav-links${open ? ' open' : ''}`} aria-label="Main">
          <NavLink to="/" end className={link} onClick={close}>Home</NavLink>
          <NavLink to="/clubs" className={link} onClick={close}>Clubs</NavLink>
          <NavLink to="/events" className={link} onClick={close}>Events</NavLink>
          <span className="nav-spacer" />
          {user ? (
            <>
              <Button to={roleHome(user.role)} size="sm" onClick={close}>My dashboard</Button>
              <Button variant="secondary" size="sm" onClick={() => { logout(); close(); navigate('/'); }}>Log out</Button>
            </>
          ) : (
            <>
              <Button to="/login" variant="secondary" size="sm" onClick={close}>Log in</Button>
              <Button to="/register" size="sm" onClick={close}>Sign up</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
