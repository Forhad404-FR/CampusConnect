import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarX, ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle2, Info } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { canViewEvent, getEvent, registrationCount, seatsLeft } from '../services/eventService';
import { registerForEvent, cancelRegistration, findRegistration, registrationBlockReason } from '../services/registrationService';
import { ROLES } from '../utils/constants';
import { formatDate, formatTime, isPastEvent } from '../utils/formatters';
import { clubOf } from '../services/permissions';

export default function EventDetails() {
  const { eventId } = useParams();
  const { db, act } = useAppData();
  const { user } = useAuth();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const event = getEvent(db, eventId);

  if (!event || !canViewEvent(db, user, event)) {
    return (
      <div className="container section">
        <EmptyState icon={CalendarX} title="Event not available" text="This event doesn't exist, or it hasn't been approved yet." action={<Button to="/events">Browse events</Button>} />
      </div>
    );
  }

  const club = db.clubs.find((c) => c.clubId === event.clubId);
  const registered = registrationCount(db, eventId);
  const left = seatsLeft(db, event);
  const past = isPastEvent(event);
  const myReg = user ? findRegistration(db, eventId, user.userId) : null;
  const isStudent = user?.role === ROLES.STUDENT;
  const isOwner = user?.role === ROLES.ORGANIZER && clubOf(db, user)?.clubId === event.clubId;
  const blockReason = registrationBlockReason(db, user, event);

  const register = () => act((d) => registerForEvent(d, user, eventId), 'You are registered. See you there!');
  const cancel = () => {
    act((d) => cancelRegistration(d, user, myReg.registrationId), 'Your registration was cancelled.');
    setConfirmCancel(false);
  };

  return (
    <div className="container section">
      <Link to="/events" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> All events</Link>
      <div className="detail-grid">
        <div>
          <div className="card card-pad">
            <div className="badge-row">
              <StatusBadge status={event.status} />
              {past && <StatusBadge status="Past" />}
              {!past && left === 0 && <StatusBadge status="Full" />}
            </div>
            <h1 className="detail-title">{event.title}</h1>
            <p className="muted">Hosted by {club ? <Link to={`/clubs/${club.clubId}`} className="link-strong">{club.name}</Link> : 'a club'}</p>
            <h2 className="sub-head tight">About this event</h2>
            <p className="club-about">{event.description}</p>
          </div>
        </div>
        <aside className="card card-pad side-panel">
          <ul className="info-list">
            <li><Calendar size={18} aria-hidden="true" /><div><span className="muted small">Date</span><strong>{formatDate(event.date)}</strong></div></li>
            <li><Clock size={18} aria-hidden="true" /><div><span className="muted small">Time</span><strong>{formatTime(event.time)}</strong></div></li>
            <li><MapPin size={18} aria-hidden="true" /><div><span className="muted small">Location</span><strong>{event.location}</strong></div></li>
            <li><Users size={18} aria-hidden="true" /><div><span className="muted small">Seats</span><strong>{registered} of {event.capacity} taken, {left} left</strong></div></li>
          </ul>
          <div className="meter" aria-hidden="true"><span style={{ width: `${Math.min(100, (registered / event.capacity) * 100)}%` }} /></div>

          <div className="register-box">
            {myReg ? (
              <>
                <p className="notice notice-success"><CheckCircle2 size={17} aria-hidden="true" /> You're registered for this event.</p>
                {!past && <Button variant="secondary" onClick={() => setConfirmCancel(true)}>Cancel registration</Button>}
              </>
            ) : !user ? (
              <>
                <p className="muted small">Log in with a student account to register.</p>
                <Button to="/login" state={{ from: `/events/${eventId}` }}>Log in to register</Button>
              </>
            ) : isStudent ? (
              <>
                {blockReason && <p className="notice notice-info"><Info size={17} aria-hidden="true" /> {blockReason}</p>}
                <Button onClick={register} disabled={Boolean(blockReason)}>Register for this event</Button>
              </>
            ) : (
              <>
                <p className="notice notice-info"><Info size={17} aria-hidden="true" /> Only student accounts can register for events.</p>
                {isOwner && <Button to={`/organizer/events/${eventId}/participants`} variant="secondary">View participants</Button>}
              </>
            )}
          </div>
        </aside>
      </div>
      <ConfirmDialog open={confirmCancel} title="Cancel registration?" message={`Your seat at "${event.title}" will be released for other students.`} confirmLabel="Cancel registration" danger onConfirm={cancel} onCancel={() => setConfirmCancel(false)} />
    </div>
  );
}
