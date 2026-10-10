import { useState } from 'react';
import { CalendarDays, Check, X, Eye } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import SearchInput from '../../components/SearchInput';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { setEventStatus, registrationCount, sortByDate } from '../../services/eventService';
import { formatDate, formatTime } from '../../utils/formatters';

const TABS = ['All', 'Pending', 'Approved', 'Rejected'];

export default function AdminEvents() {
  const { db, act } = useAppData();
  const { user } = useAuth();
  const [tab, setTab] = useState('Pending');
  const [query, setQuery] = useState('');
  const [reviewId, setReviewId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const q = query.trim().toLowerCase();
  const club = (id) => db.clubs.find((c) => c.clubId === id);
  const organizer = (e) => db.users.find((u) => u.userId === club(e.clubId)?.organizerId);
  const count = (t) => (t === 'All' ? db.events.length : db.events.filter((e) => e.status === t).length);
  const events = sortByDate(db.events).filter((e) => (tab === 'All' || e.status === tab) && (!q || e.title.toLowerCase().includes(q) || (club(e.clubId)?.name || '').toLowerCase().includes(q)));
  const review = db.events.find((e) => e.eventId === reviewId) || null;

  const approve = (e) => act((d) => setEventStatus(d, user, e.eventId, 'Approved'), `"${e.title}" was approved and is now open for registration.`);
  const reject = () => {
    act((d) => setEventStatus(d, user, rejectTarget.eventId, 'Rejected'), `"${rejectTarget.title}" was rejected.`);
    setRejectTarget(null);
    setReviewId(null);
  };

  return (
    <>
      <PageHeader title="Event approvals" subtitle="Approve or reject events submitted by club organizers." />
      <div className="tabs" role="tablist" aria-label="Filter by approval status">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t} <span className="tab-count">{count(t)}</span>
          </button>
        ))}
      </div>
      <div className="toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Search by title or club" label="Search events" /></div>

      {events.length ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Event</th><th>Club</th><th>Date and time</th><th>Capacity</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.eventId}>
                  <td><strong>{e.title}</strong><div className="muted small">{e.location}</div></td>
                  <td>{club(e.clubId)?.name || '-'}</td>
                  <td>{formatDate(e.date)}<div className="muted small">{formatTime(e.time)}</div></td>
                  <td>{e.capacity}</td>
                  <td><StatusBadge status={e.status} /></td>
                  <td className="actions">
                    <Button size="sm" variant="secondary" icon={Eye} onClick={() => setReviewId(e.eventId)} aria-label={`Review ${e.title}`}>Review</Button>
                    {e.status === 'Pending' && (
                      <>
                        <Button size="sm" icon={Check} onClick={() => approve(e)} aria-label={`Approve ${e.title}`}>Approve</Button>
                        <Button size="sm" variant="ghost-danger" icon={X} onClick={() => setRejectTarget(e)} aria-label={`Reject ${e.title}`}>Reject</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={CalendarDays} title={tab === 'Pending' && !q ? 'Nothing to review' : 'No events found'} text={tab === 'Pending' && !q ? 'No events are waiting for approval.' : 'Try another status tab or search term.'} />
      )}

      <Modal open={Boolean(review)} title="Review event" onClose={() => setReviewId(null)} wide>
        {review && (
          <>
            <div className="title-row"><h3 className="modal-title">{review.title}</h3><StatusBadge status={review.status} /></div>
            <p className="club-about">{review.description}</p>
            <dl className="facts facts-wide">
              <div><dt>Club</dt><dd>{club(review.clubId)?.name || '-'}</dd></div>
              <div><dt>Organizer</dt><dd>{organizer(review)?.name || 'Unassigned'}</dd></div>
              <div><dt>Date</dt><dd>{formatDate(review.date)}</dd></div>
              <div><dt>Time</dt><dd>{formatTime(review.time)}</dd></div>
              <div><dt>Location</dt><dd>{review.location}</dd></div>
              <div><dt>Capacity</dt><dd>{review.capacity} seats ({registrationCount(db, review.eventId)} registered)</dd></div>
            </dl>
            <div className="form-actions">
              <Button variant="secondary" onClick={() => setReviewId(null)}>Close</Button>
              {review.status === 'Pending' && (
                <>
                  <Button variant="danger" icon={X} onClick={() => setRejectTarget(review)}>Reject</Button>
                  <Button icon={Check} onClick={() => { approve(review); setReviewId(null); }}>Approve</Button>
                </>
              )}
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog open={Boolean(rejectTarget)} title="Reject this event?" message={rejectTarget ? `"${rejectTarget.title}" will be marked Rejected and students won't be able to register. The organizer can edit and resubmit it.` : ''} confirmLabel="Reject event" danger onConfirm={reject} onCancel={() => setRejectTarget(null)} />
    </>
  );
}
