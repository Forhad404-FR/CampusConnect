import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import EventForm from '../../components/EventForm';
import NoClub from './NoClub';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { getClubByOrganizer } from '../../services/clubService';
import { createEvent } from '../../services/eventService';

export default function OrganizerEventNew() {
  const { db, act } = useAppData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const club = getClubByOrganizer(db, user.userId);
  if (!club) return (<><PageHeader title="Create event" /><NoClub /></>);

  const submit = (values) => {
    const res = act((d) => createEvent(d, user, values), 'Event created and sent to an administrator for approval.');
    if (res.ok) navigate('/organizer/events');
  };

  return (
    <>
      <PageHeader title="Create event" subtitle={`New event for ${club.name}. It will be Pending until an administrator approves it.`} />
      <div className="form-narrow">
        <EventForm submitLabel="Create event" onSubmit={submit} onCancel={() => navigate('/organizer/events')} />
      </div>
    </>
  );
}
