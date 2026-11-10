import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Users, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import Button from '../../components/Button';
import SearchInput from '../../components/SearchInput';
import NoClub from './NoClub';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { getClubByOrganizer } from '../../services/clubService';
import { eventsForClub, registrationCount, sortByDate, deleteEvent } from '../../services/eventService';
import { formatDate, formatTime } from '../../utils/formatters';

export default function OrganizerEvents() {
  const { db, act } = useAppData();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [target, setTarget] = useState(null);
  const club = getClubByOrganizer(db, user.userId);
  if (!club) return (<><PageHeader title="My events" /><NoClub /></>);

  const q = query.trim().toLowerCase();
  const events = sortByDate(eventsForClub(db, club.clubId)).filter((e) => (!status || e.status === status) && (!q || e.title.toLowerCase().includes(q)));
  const regCount = target ? registrationCount(db, target.eventId) : 0;

  const remove = () => {
    act((d) => deleteEvent(d, user, target.eventId), (r) => `"${r.event.title}" was deleted.`);
    setTarget(null);
  };

  return (
    <>
      <PageHeader title="My events" subtitle={`Events for ${club.name}`} actions={<Button to="/organizer/events/new">Create event</Button>} />
      <div className="toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="Search your events" label="Search your events" />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          <option>Pending</option><option>Approved</option><option>Rejected</option>
        </select>
      </div>
      {events.length ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Event</th><th>Date and time</th><th>Registered</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.eventId}>
                  <td><Link to={`/events/${e.eventId}`} className="row-title">{e.title}</Link><div className="muted small">{e.location}</div></td>
                  <td>{formatDate(e.date)}<div className="muted small">{formatTime(e.time)}</div></td>
                  <td>{registrationCount(db, e.eventId)} / {e.capacity}</td>
                  <td><StatusBadge status={e.status} /></td>
                  <td className="actions">
                    <Button to={`/organizer/events/${e.eventId}/participants`} size="sm" variant="secondary" icon={Users}>Participants</Button>
                    <Button to={`/organizer/events/${e.eventId}/edit`} size="sm" variant="secondary" icon={Pencil} aria-label={`Edit ${e.title}`}>Edit</Button>
                    <Button size="sm" variant="ghost-danger" icon={Trash2} onClick={() => setTarget(e)} aria-label={`Delete ${e.title}`}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={CalendarDays} title={query || status ? 'No events match your filters' : 'No events yet'} text={query || status ? 'Try clearing the search or status filter.' : 'Create your first event. An administrator will review it before students can register.'} action={!query && !status ? <Button to="/organizer/events/new">Create event</Button> : null} />
      )}
      <ConfirmDialog open={Boolean(target)} title="Delete this event?" message={target ? `"${target.title}" will be permanently deleted${regCount ? `, along with its ${regCount} registration${regCount === 1 ? '' : 's'}` : ''}. This can't be undone.` : ''} confirmLabel="Delete event" danger onConfirm={remove} onCancel={() => setTarget(null)} />
    </>
  );
}
