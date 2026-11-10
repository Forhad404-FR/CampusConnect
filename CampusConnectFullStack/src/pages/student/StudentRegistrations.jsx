import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { listStudentRegistrations, displayStatus, cancelRegistration } from '../../services/registrationService';
import { formatDate, formatTime, isPastEvent } from '../../utils/formatters';

export default function StudentRegistrations() {
  const { db, act } = useAppData();
  const { user } = useAuth();
  const [tab, setTab] = useState('all');
  const [target, setTarget] = useState(null);
  const regs = listStudentRegistrations(db, user.userId);
  const shown = regs.filter((r) => tab === 'all' || (tab === 'upcoming' ? !isPastEvent(r.event) : isPastEvent(r.event)));

  const confirmCancel = () => {
    act((d) => cancelRegistration(d, user, target.registrationId), 'Your registration was cancelled.');
    setTarget(null);
  };

  return (
    <>
      <PageHeader title="My registrations" subtitle="Every event you've registered for, with its current status." />
      <div className="tabs" role="tablist" aria-label="Filter registrations">
        {[['all', 'All'], ['upcoming', 'Upcoming'], ['past', 'Past']].map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} className={`tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>
      {shown.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Event</th><th>Club</th><th>Date and time</th><th>Registered on</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.registrationId}>
                  <td><Link to={`/events/${r.event.eventId}`} className="row-title">{r.event.title}</Link><div className="muted small">{r.event.location}</div></td>
                  <td>{r.club?.name || '-'}</td>
                  <td>{formatDate(r.event.date)}<div className="muted small">{formatTime(r.event.time)}</div></td>
                  <td>{formatDate(r.registrationDate)}</td>
                  <td><StatusBadge status={displayStatus(r)} /></td>
                  <td className="actions">
                    {!isPastEvent(r.event) ? <Button size="sm" variant="secondary" onClick={() => setTarget(r)}>Cancel</Button> : <span className="muted small">Completed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={Ticket} title="Nothing here yet" text={tab === 'all' ? "You haven't registered for any events." : `No ${tab} registrations.`} action={<Button to="/events">Browse events</Button>} />
      )}
      <ConfirmDialog open={Boolean(target)} title="Cancel registration?" message={target ? `Your seat at "${target.event.title}" will be released for other students.` : ''} confirmLabel="Cancel registration" danger onConfirm={confirmCancel} onCancel={() => setTarget(null)} />
    </>
  );
}
