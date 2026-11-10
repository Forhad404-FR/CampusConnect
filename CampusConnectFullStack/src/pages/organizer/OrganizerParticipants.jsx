import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Lock, Users, Check, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { getClubByOrganizer } from '../../services/clubService';
import { getEvent } from '../../services/eventService';
import { listParticipants, setAttendance } from '../../services/registrationService';
import { formatDate, formatTime } from '../../utils/formatters';

export default function OrganizerParticipants() {
  const { eventId } = useParams();
  const { db, act } = useAppData();
  const { user } = useAuth();
  const club = getClubByOrganizer(db, user.userId);
  const event = getEvent(db, eventId);

  if (!club || !event || event.clubId !== club.clubId) {
    return (
      <>
        <PageHeader title="Participants" />
        <EmptyState icon={Lock} title="You can't manage this event" text="It doesn't exist, or it belongs to a different club." action={<Button to="/organizer/events">Back to my events</Button>} />
      </>
    );
  }

  const people = listParticipants(db, user, eventId);
  const present = people.filter((p) => p.attendance === 'Present').length;
  const mark = (p, value) => act((d) => setAttendance(d, user, p.registrationId, value), `${p.student?.name || 'Participant'} marked ${value.toLowerCase()}.`);

  return (
    <>
      <Link to="/organizer/events" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> My events</Link>
      <PageHeader title={event.title} subtitle={`${formatDate(event.date)} at ${formatTime(event.time)}, ${event.location}`} actions={<StatusBadge status={event.status} />} />
      <div className="stat-grid compact">
        <StatCard icon={Users} label="Registered" value={`${people.length} / ${event.capacity}`} />
        <StatCard icon={Check} label="Present" value={present} />
        <StatCard icon={X} label="Absent" value={people.length - present} />
      </div>
      {people.length ? (
        <>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Participant</th><th>Email</th><th>Registered on</th><th>Attendance</th><th>Mark attendance</th></tr></thead>
              <tbody>
                {people.map((p) => (
                  <tr key={p.registrationId}>
                    <td><strong>{p.student?.name || 'Unknown student'}</strong></td>
                    <td>{p.student?.email || '-'}</td>
                    <td>{formatDate(p.registrationDate)}</td>
                    <td><StatusBadge status={p.attendance} /></td>
                    <td className="actions">
                      <Button size="sm" variant="secondary" icon={Check} disabled={p.attendance === 'Present'} onClick={() => mark(p, 'Present')}>Present</Button>
                      <Button size="sm" variant="secondary" icon={X} disabled={p.attendance === 'Absent'} onClick={() => mark(p, 'Absent')}>Absent</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted small note">New registrations start as Absent until you mark them Present.</p>
        </>
      ) : (
        <EmptyState icon={Users} title="No participants yet" text="Students who register for this event will appear here." />
      )}
    </>
  );
}
