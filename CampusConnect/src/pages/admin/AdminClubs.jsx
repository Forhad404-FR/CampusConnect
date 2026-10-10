import { useState } from 'react';
import { Building2, Pencil, Trash2, Plus } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import SearchInput from '../../components/SearchInput';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import Modal from '../../components/Modal';
import ClubForm from '../../components/ClubForm';
import Button from '../../components/Button';
import { ClubAvatar } from '../../components/ClubCard';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { createClub, updateClub, deleteClub, setClubStatus, availableOrganizers, organizerOf } from '../../services/clubService';
import { eventsForClub } from '../../services/eventService';

export default function AdminClubs() {
  const { db, act } = useAppData();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null); // club object, or 'new'
  const [target, setTarget] = useState(null);
  const q = query.trim().toLowerCase();
  const clubs = db.clubs.filter((c) => !q || c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));

  const save = (values) => {
    const res = editing === 'new'
      ? act((d) => createClub(d, user, values), 'Club created.')
      : act((d) => updateClub(d, user, editing.clubId, values), 'Club updated.');
    if (res.ok) setEditing(null);
  };
  const toggle = (c) => {
    const next = c.status === 'Active' ? 'Inactive' : 'Active';
    act((d) => setClubStatus(d, user, c.clubId, next), `${c.name} is now ${next.toLowerCase()}.`);
  };
  const remove = () => {
    act((d) => deleteClub(d, user, target.clubId), (r) => `${r.club.name} was deleted.`);
    setTarget(null);
  };
  const eventCount = target ? eventsForClub(db, target.clubId).length : 0;

  return (
    <>
      <PageHeader title="Clubs" subtitle={`${db.clubs.length} clubs on the platform.`} actions={<Button icon={Plus} onClick={() => setEditing('new')}>Add club</Button>} />
      <div className="toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Search by name or category" label="Search clubs" /></div>
      {clubs.length ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Club</th><th>Organizer</th><th>Events</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {clubs.map((c) => (
                <tr key={c.clubId}>
                  <td><div className="cell-flex"><ClubAvatar club={c} size={36} /><div><strong>{c.name}</strong><div className="muted small">{c.category}</div></div></div></td>
                  <td>{organizerOf(db, c)?.name || <span className="muted">Unassigned</span>}</td>
                  <td>{eventsForClub(db, c.clubId).length}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="actions">
                    <Button size="sm" variant="secondary" onClick={() => toggle(c)}>{c.status === 'Active' ? 'Deactivate' : 'Activate'}</Button>
                    <Button size="sm" variant="secondary" icon={Pencil} onClick={() => setEditing(c)} aria-label={`Edit ${c.name}`}>Edit</Button>
                    <Button size="sm" variant="ghost-danger" icon={Trash2} onClick={() => setTarget(c)} aria-label={`Delete ${c.name}`}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={Building2} title="No clubs found" text={query ? 'Try a different search.' : 'Add the first club to get started.'} action={!query ? <Button icon={Plus} onClick={() => setEditing('new')}>Add club</Button> : null} />
      )}

      <Modal open={Boolean(editing)} title={editing === 'new' ? 'Add club' : 'Edit club'} onClose={() => setEditing(null)}>
        {editing && (
          <ClubForm
            key={editing === 'new' ? 'new' : editing.clubId}
            bare
            adminMode
            initial={editing === 'new' ? undefined : editing}
            organizerOptions={availableOrganizers(db, editing === 'new' ? null : editing.clubId)}
            submitLabel={editing === 'new' ? 'Create club' : 'Save changes'}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog open={Boolean(target)} title="Delete this club?" message={target ? `${target.name} will be permanently deleted${eventCount ? `, along with its ${eventCount} event${eventCount === 1 ? '' : 's'} and their registrations` : ''}. This can't be undone.` : ''} confirmLabel="Delete club" danger onConfirm={remove} onCancel={() => setTarget(null)} />
    </>
  );
}
