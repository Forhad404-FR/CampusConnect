import { Link } from 'react-router-dom';
import { Clock, UserPlus, Search, Ticket, ClipboardCheck } from 'lucide-react';
import Button from '../components/Button';
import ClubCard from '../components/ClubCard';
import EventCard from '../components/EventCard';
import { useAppData } from '../context/AppDataContext';
import { activeClubs } from '../services/clubService';
import { publicEvents, sortByDate, registrationCount } from '../services/eventService';
import { formatDateParts, formatTime, isPastEvent } from '../utils/formatters';

const STEPS = [
  { icon: UserPlus, title: 'Create your account', text: 'Sign up as a student with your email. It takes under a minute.' },
  { icon: Search, title: 'Find a club or event', text: 'Browse clubs by category and search upcoming events by date or club.' },
  { icon: Ticket, title: 'Register for a seat', text: 'Reserve a place in one click and cancel any time before the event.' },
  { icon: ClipboardCheck, title: 'Show up and be counted', text: 'Organizers mark attendance, so your participation is on record.' },
];

export default function Home() {
  const { db } = useAppData();
  const clubs = activeClubs(db);
  const upcoming = sortByDate(publicEvents(db).filter((e) => !isPastEvent(e)));
  const clubName = (id) => db.clubs.find((c) => c.clubId === id)?.name || '';
  const upcomingCount = (clubId) => upcoming.filter((e) => e.clubId === clubId).length;

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>Every UITS club and event, in one calendar.</h1>
            <p className="lead">CampusConnect helps students discover clubs, reserve seats at events, and lets organizers and administrators run them without spreadsheets and group chats.</p>
            <div className="hero-actions">
              <Button to="/events" size="lg">Browse events</Button>
              <Button to="/clubs" variant="secondary" size="lg">Browse clubs</Button>
            </div>
            <p className="muted small hero-note">Want a quick look? <Link to="/login">Open the demo accounts</Link> for students, organizers and admins.</p>
          </div>
          <aside className="board" aria-label="Next events on campus">
            <div className="board-head">Next on campus</div>
            {upcoming.slice(0, 4).map((e) => {
              const { day, month } = formatDateParts(e.date);
              return (
                <Link key={e.eventId} to={`/events/${e.eventId}`} className="board-row">
                  <span className="board-date"><b>{day}</b>{month}</span>
                  <span className="board-info">
                    <strong>{e.title}</strong>
                    <span><Clock size={13} aria-hidden="true" /> {formatTime(e.time)}, {clubName(e.clubId)}</span>
                  </span>
                </Link>
              );
            })}
            {upcoming.length === 0 && <p className="board-empty">No upcoming events yet. Check back soon.</p>}
          </aside>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Featured clubs</h2>
          <Link to="/clubs" className="link-strong">All clubs</Link>
        </div>
        <div className="grid-cards">
          {clubs.slice(0, 3).map((c) => <ClubCard key={c.clubId} club={c} upcomingCount={upcomingCount(c.clubId)} />)}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Upcoming events</h2>
          <Link to="/events" className="link-strong">All events</Link>
        </div>
        <div className="grid-cards">
          {upcoming.slice(0, 3).map((e) => <EventCard key={e.eventId} event={e} clubName={clubName(e.clubId)} registered={registrationCount(db, e.eventId)} />)}
        </div>
      </section>

      <section className="how">
        <div className="container section">
          <h2>How CampusConnect works</h2>
          <ol className="steps">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="step">
                <span className="step-num" aria-hidden="true">{i + 1}</span>
                <Icon size={22} aria-hidden="true" className="step-icon" />
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
