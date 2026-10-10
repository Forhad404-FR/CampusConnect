import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import ClubForm from '../../components/ClubForm';
import NoClub from './NoClub';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { getClubByOrganizer, updateClub } from '../../services/clubService';
import { eventsForClub } from '../../services/eventService';

export default function OrganizerClub() {
  const { db, act } = useAppData();
  const { user } = useAuth();
  const club = getClubByOrganizer(db, user.userId);
  if (!club) return (<><PageHeader title="My club" /><NoClub /></>);

  const eventCount = eventsForClub(db, club.clubId).length;
  const save = (values) => act((d) => updateClub(d, user, club.clubId, values), 'Club information saved.');

  return (
    <>
      <PageHeader title="My club" subtitle="Keep your club's public information up to date." />
      <div className="two-col wide-left">
        <ClubForm key={club.clubId} initial={club} onSubmit={save} />
        <aside className="card card-pad">
          <h2>Club overview</h2>
          <dl className="facts">
            <div><dt>Status</dt><dd><StatusBadge status={club.status} /></dd></div>
            <div><dt>Organizer</dt><dd>{user.name}</dd></div>
            <div><dt>Events created</dt><dd>{eventCount}</dd></div>
          </dl>
          <p className="muted small">Only an administrator can change a club's status or its assigned organizer.</p>
        </aside>
      </div>
    </>
  );
}
