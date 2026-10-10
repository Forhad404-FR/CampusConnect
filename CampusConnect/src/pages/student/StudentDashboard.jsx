import { Link } from 'react-router-dom';
import { Ticket, CalendarCheck, UserCheck, CalendarDays, Building2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { listStudentRegistrations, displayStatus } from '../../services/registrationService';
import { publicEvents } from '../../services/eventService';
import { formatDate, formatTime, isPastEvent } from '../../utils/formatters';

export default function StudentDashboard() {
  const { db } = useAppData();
  const { user } = useAuth();
  const regs = listStudentRegistrations(db, user.userId);
  const upcoming = regs.filter((r) => !isPastEvent(r.event));
  const attended = regs.filter((r) => isPastEvent(r.event) && r.attendance === 'Present').length;
  const open = publicEvents(db).filter((e) => !isPastEvent(e)).length;

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(' ')[0]}`} subtitle="Here's what's coming up for you." />
      <div className="stat-grid">
        <StatCard icon={Ticket} label="Registered events" value={regs.length} />
        <StatCard icon={CalendarCheck} label="Upcoming for you" value={upcoming.length} />
        <StatCard icon={UserCheck} label="Events attended" value={attended} />
        <StatCard icon={CalendarDays} label="Events open to join" value={open} />
      </div>

      <div className="two-col">
        <section className="card card-pad">
          <div className="section-head tight"><h2>Your upcoming events</h2><Link to="/student/registrations" className="link-strong">View all</Link></div>
          {upcoming.length ? (
            <ul className="list">
              {upcoming.slice(0, 5).map((r) => (
                <li key={r.registrationId} className="list-row">
                  <div>
                    <Link to={`/events/${r.event.eventId}`} className="row-title">{r.event.title}</Link>
                    <span className="muted small">{formatDate(r.event.date)} at {formatTime(r.event.time)}, {r.event.location}</span>
                  </div>
                  <StatusBadge status={displayStatus(r)} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={Ticket} title="No upcoming registrations" text="Find an event that interests you and reserve a seat." action={<Button to="/events">Browse events</Button>} />
          )}
        </section>

        <section className="card card-pad">
          <h2>Quick links</h2>
          <div className="quick-links">
            <Link to="/events" className="quick-link"><CalendarDays size={20} aria-hidden="true" /><div><strong>Browse events</strong><span className="muted small">Search and filter upcoming events</span></div></Link>
            <Link to="/clubs" className="quick-link"><Building2 size={20} aria-hidden="true" /><div><strong>Browse clubs</strong><span className="muted small">Discover communities on campus</span></div></Link>
            <Link to="/student/registrations" className="quick-link"><Ticket size={20} aria-hidden="true" /><div><strong>My registrations</strong><span className="muted small">Check status or cancel a seat</span></div></Link>
          </div>
        </section>
      </div>
    </>
  );
}
