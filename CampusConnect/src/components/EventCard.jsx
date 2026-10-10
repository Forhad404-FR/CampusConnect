import { Link } from 'react-router-dom';
import { MapPin, Clock, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDateParts, formatTime, isPastEvent } from '../utils/formatters';

export default function EventCard({ event, clubName, registered }) {
  const { day, month } = formatDateParts(event.date);
  const past = isPastEvent(event);
  const full = registered >= event.capacity;
  return (
    <article className="card event-card">
      <div className="event-card-top">
        <div className="date-block" aria-hidden="true">
          <span className="date-month">{month}</span>
          <span className="date-day">{day}</span>
        </div>
        <div className="event-card-title">
          <h3><Link to={`/events/${event.eventId}`}>{event.title}</Link></h3>
          <span className="muted small">{clubName}</span>
        </div>
      </div>
      <ul className="meta-list">
        <li><Clock size={15} aria-hidden="true" />{formatTime(event.time)}</li>
        <li><MapPin size={15} aria-hidden="true" />{event.location}</li>
        <li><Users size={15} aria-hidden="true" />{registered} of {event.capacity} seats taken</li>
      </ul>
      <div className="event-card-foot">
        <div className="badge-row">
          {event.status !== 'Approved' && <StatusBadge status={event.status} />}
          {past ? <StatusBadge status="Past" /> : full ? <StatusBadge status="Full" /> : null}
        </div>
        <Link to={`/events/${event.eventId}`} className="link-strong">View details</Link>
      </div>
    </article>
  );
}
