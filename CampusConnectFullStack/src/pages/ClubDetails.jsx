import { Link, useParams } from 'react-router-dom';
import { Building2, ArrowLeft, User } from 'lucide-react';
import { ClubAvatar } from '../components/ClubCard';
import EventCard from '../components/EventCard';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { useAppData } from '../context/AppDataContext';
import { getClub, organizerOf } from '../services/clubService';
import { eventsForClub, sortByDate, registrationCount } from '../services/eventService';
import { isPastEvent } from '../utils/formatters';

export default function ClubDetails() {
  const { clubId } = useParams();
  const { db } = useAppData();
  const club = getClub(db, clubId);

  if (!club) {
    return (
      <div className="container section">
        <EmptyState icon={Building2} title="Club not found" text="This club doesn't exist or has been removed." action={<Button to="/clubs">Back to clubs</Button>} />
      </div>
    );
  }
  const events = sortByDate(eventsForClub(db, clubId).filter((e) => e.status === 'Approved'));
  const upcoming = events.filter((e) => !isPastEvent(e));
  const past = events.filter(isPastEvent).reverse();
  const organizer = organizerOf(db, club);

  return (
    <div className="container section">
      <Link to="/clubs" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> All clubs</Link>
      <div className="card card-pad club-hero">
        <ClubAvatar club={club} size={64} />
        <div>
          <div className="title-row"><h1>{club.name}</h1><StatusBadge status={club.status} /></div>
          <p className="muted">{club.category}</p>
          <p className="club-about">{club.description}</p>
          <p className="small muted inline-meta"><User size={15} aria-hidden="true" /> Organizer: {organizer ? organizer.name : 'Not assigned yet'}</p>
        </div>
      </div>

      <h2 className="sub-head">Upcoming events</h2>
      {upcoming.length ? (
        <div className="grid-cards">
          {upcoming.map((e) => <EventCard key={e.eventId} event={e} clubName={club.name} registered={registrationCount(db, e.eventId)} />)}
        </div>
      ) : (
        <EmptyState title="No upcoming events" text="This club hasn't scheduled anything yet." />
      )}

      {past.length > 0 && (
        <>
          <h2 className="sub-head">Past events</h2>
          <div className="grid-cards">
            {past.map((e) => <EventCard key={e.eventId} event={e} clubName={club.name} registered={registrationCount(db, e.eventId)} />)}
          </div>
        </>
      )}
    </div>
  );
}
