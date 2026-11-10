import { Link } from 'react-router-dom';
import { CalendarDays, CalendarClock, Users, Building2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import NoClub from './NoClub';
import { ClubAvatar } from '../../components/ClubCard';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { getClubByOrganizer } from '../../services/clubService';
import { eventsForClub, registrationCount, sortByDate } from '../../services/eventService';
import { formatDate, isPastEvent } from '../../utils/formatters';

export default function OrganizerDashboard() {
  const { db } = useAppData();
  const { user } = useAuth();
  const club = getClubByOrganizer(db, user.userId);
  if (!club) return (<><PageHeader title="Organizer dashboard" /><NoClub /></>);

  const events = sortByDate(eventsForClub(db, club.clubId));
  const ids = new Set(events.map((e) => e.eventId));
  const regs = db.registrations.filter((r) => ids.has(r.eventId));
  const upcoming = events.filter((e) => !isPastEvent(e));
  const pastIds = new Set(events.filter(isPastEvent).map((e) => e.eventId));
  const marked = regs.filter((r) => pastIds.has(r.eventId));
  const present = marked.filter((r) => r.attendance === 'Present').length;
  const absent = marked.length - present;
  const pct = marked.length ? Math.round((present / marked.length) * 100) : 0;
  const pending = events.filter((e) => e.status === 'Pending').length;

  return (
    <>
      <PageHeader title="Organizer dashboard" subtitle={`Managing ${club.name}`} actions={<Button to="/organizer/events/new">Create event</Button>} />
      <div className="card card-pad club-strip">
        <ClubAvatar club={club} size={48} />
        <div className="grow"><strong>{club.name}</strong><div className="muted small">{club.category}</div></div>
        <StatusBadge status={club.status} />
        <Button to="/organizer/club" variant="secondary" size="sm">Manage club</Button>
      </div>

      <div className="stat-grid">
        <StatCard icon={CalendarDays} label="Total events" value={events.length} hint={pending ? `${pending} awaiting approval` : 'All reviewed'} />
        <StatCard icon={CalendarClock} label="Upcoming events" value={upcoming.length} />
        <StatCard icon={Users} label="Total registrations" value={regs.length} />
        <StatCard icon={Building2} label="Attendance rate (past events)" value={marked.length ? `${pct}%` : '-'} />
      </div>

      <div className="two-col">
        <section className="card card-pad">
          <h2>Attendance summary</h2>
          {marked.length ? (
            <>
              <div className="bar" role="img" aria-label={`${present} present, ${absent} absent`}>
                <span className="bar-present" style={{ width: `${pct}%` }} />
                <span className="bar-absent" style={{ width: `${100 - pct}%` }} />
              </div>
              <div className="legend"><span><i className="dot dot-green" /> Present: {present}</span><span><i className="dot dot-red" /> Absent: {absent}</span></div>
              <p className="muted small">Based on registrations for events that have already taken place.</p>
            </>
          ) : <p className="muted">No attendance has been recorded yet. It appears here after your first event.</p>}
        </section>

        <section className="card card-pad">
          <div className="section-head tight"><h2>Your events</h2><Link to="/organizer/events" className="link-strong">Manage</Link></div>
          {events.length ? (
            <ul className="list">
              {events.slice(-5).reverse().map((e) => (
                <li key={e.eventId} className="list-row">
                  <div>
                    <Link to={`/organizer/events/${e.eventId}/participants`} className="row-title">{e.title}</Link>
                    <span className="muted small">{formatDate(e.date)}, {registrationCount(db, e.eventId)} of {e.capacity} registered</span>
                  </div>
                  <StatusBadge status={e.status} />
                </li>
              ))}
            </ul>
          ) : <p className="muted">You haven't created any events yet.</p>}
        </section>
      </div>
    </>
  );
}
