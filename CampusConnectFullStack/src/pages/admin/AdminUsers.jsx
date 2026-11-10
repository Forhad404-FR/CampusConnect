import { useState } from 'react';
import { Users, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import SearchInput from '../../components/SearchInput';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { updateUserRole, setUserStatus, deleteUser } from '../../services/userService';
import { ROLES } from '../../utils/constants';

export default function AdminUsers() {
  const { db, act } = useAppData();
  const { user: me } = useAuth();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [target, setTarget] = useState(null);
  const q = query.trim().toLowerCase();
  const users = db.users.filter((u) => (!role || u.role === role) && (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));

  const changeRole = (u, value) => act((d) => updateUserRole(d, me, u.userId, value), `${u.name} is now ${value === ROLES.ADMIN ? 'an' : 'a'} ${value}.`);
  const toggleStatus = (u) => {
    const next = u.status === 'Active' ? 'Disabled' : 'Active';
    act((d) => setUserStatus(d, me, u.userId, next), `${u.name}'s account is now ${next.toLowerCase()}.`);
  };
  const remove = () => {
    act((d) => deleteUser(d, me, target.userId), (u) => `${u.name} was deleted.`);
    setTarget(null);
  };

  return (
    <>
      <PageHeader title="Users" subtitle={`${db.users.length} accounts on the platform.`} />
      <div className="toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by name or email" label="Search users" />
        <select className="input" value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filter by role">
          <option value="">All roles</option>
          {Object.values(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      {users.length ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {users.map((u) => {
                const self = u.userId === me.userId;
                return (
                  <tr key={u.userId}>
                    <td><strong>{u.name}</strong>{self && <span className="muted small"> (you)</span>}</td>
                    <td>{u.email}</td>
                    <td>
                      <select className="input input-sm" value={u.role} disabled={self} onChange={(e) => changeRole(u, e.target.value)} aria-label={`Role for ${u.name}`}>
                        {Object.values(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td><StatusBadge status={u.status} /></td>
                    <td className="actions">
                      <Button size="sm" variant="secondary" disabled={self} onClick={() => toggleStatus(u)}>{u.status === 'Active' ? 'Disable' : 'Enable'}</Button>
                      <Button size="sm" variant="ghost-danger" icon={Trash2} disabled={self} onClick={() => setTarget(u)} aria-label={`Delete ${u.name}`}>Delete</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={Users} title="No users found" text="Try a different search or clear the role filter." />
      )}
      <p className="muted small note">Changing a user away from Club Organizer unassigns their club. Changing a user away from Student removes their registrations.</p>
      <ConfirmDialog open={Boolean(target)} title="Delete this user?" message={target ? `${target.name} (${target.email}) and their event registrations will be permanently deleted.` : ''} confirmLabel="Delete user" danger onConfirm={remove} onCancel={() => setTarget(null)} />
    </>
  );
}
