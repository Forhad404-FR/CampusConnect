import { useNavigate, useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import EventForm from '../../components/EventForm';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { getClubByOrganizer } from '../../services/clubService';
import { getEvent, updateEvent } from '../../services/eventService';

export default function OrganizerEventEdit() {
  const { eventId } = useParams();
  const { db, act } = useAppData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const club = getClubByOrganizer(db, user.userId);
  const event = getEvent(db, eventId);

  if (!club || !event || event.clubId !== club.clubId) {
    return (
      <>
        <PageHeader title="Edit event" />
        <EmptyState icon={Lock} title="You can't edit this event" text="It doesn't exist, or it belongs to a different club." action={<Button to="/organizer/events">Back to my events</Button>} />
      </>
    );
  }

  const submit = (values) => {
    const res = act((d) => updateEvent(d, user, eventId, values), (e) => (e.status === 'Pending' ? 'Changes saved. The event is awaiting administrator approval.' : 'Event changes saved.'));
    if (res.ok) navigate('/organizer/events');
  };

  return (
    <>
      <PageHeader title="Edit event" subtitle={event.status === 'Rejected' ? 'This event was rejected. Saving your changes will resubmit it for approval.' : event.title} />
      <div className="form-narrow">
        <EventForm key={event.eventId} isEdit initial={{ ...event, capacity: String(event.capacity) }} submitLabel="Save changes" onSubmit={submit} onCancel={() => navigate('/organizer/events')} />
      </div>
    </>
  );
}
