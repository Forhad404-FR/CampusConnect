import { useState } from 'react';
import { CalendarX } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchInput from '../components/SearchInput';
import EventCard from '../components/EventCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { useAppData } from '../context/AppDataContext';
import { publicEvents, sortByDate, registrationCount } from '../services/eventService';
import { isPastEvent } from '../utils/formatters';

export default function Events() {
  const { db } = useAppData();
  const [query, setQuery] = useState('');
  const [clubId, setClubId] = useState('');
  const [when, setWhen] = useState('upcoming');
  const q = query.trim().toLowerCase();
  const clubName = (id) => db.clubs.find((c) => c.clubId === id)?.name || '';

  let list = sortByDate(publicEvents(db)).filter((e) => {
    const past = isPastEvent(e);
    if (when === 'upcoming' && past) return false;
    if (when === 'past' && !past) return false;
    if (clubId && e.clubId !== clubId) return false;
    if (q && !`${e.title} ${e.location} ${e.description} ${clubName(e.clubId)}`.toLowerCase().includes(q)) return false;
    return true;
  });
  if (when === 'past') list = list.reverse();
  const filtered = Boolean(q || clubId || when !== 'upcoming');

  return (
    <div className="container section">
      <PageHeader title="Events" subtitle="Approved events run by UITS clubs." />
      <div className="toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by title, location or club" label="Search events" />
        <select className="input" value={clubId} onChange={(e) => setClubId(e.target.value)} aria-label="Filter by club">
          <option value="">All clubs</option>
          {db.clubs.map((c) => <option key={c.clubId} value={c.clubId}>{c.name}</option>)}
        </select>
        <select className="input" value={when} onChange={(e) => setWhen(e.target.value)} aria-label="Filter by time">
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="all">All dates</option>
        </select>
      </div>
      {list.length ? (
        <div className="grid-cards">
          {list.map((e) => <EventCard key={e.eventId} event={e} clubName={clubName(e.clubId)} registered={registrationCount(db, e.eventId)} />)}
        </div>
      ) : (
        <EmptyState
          icon={CalendarX}
          title="No events found"
          text={filtered ? 'No events match these filters.' : 'There are no upcoming events right now.'}
          action={filtered ? <Button variant="secondary" onClick={() => { setQuery(''); setClubId(''); setWhen('upcoming'); }}>Clear filters</Button> : null}
        />
      )}
    </div>
  );
}
