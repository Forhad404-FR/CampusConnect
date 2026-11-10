import { useState } from 'react';
import Field from './Field';
import Button from './Button';
import { validateClub } from '../utils/validation';
import { CLUB_CATEGORIES, CLUB_STATUS } from '../utils/constants';

// adminMode adds the Status and Organizer fields (admin only). onSubmit(values) is called when valid.
export default function ClubForm({ initial, submitLabel = 'Save changes', onSubmit, onCancel, adminMode = false, organizerOptions = [], bare = false }) {
  const [values, setValues] = useState({ name: '', description: '', category: '', status: CLUB_STATUS.ACTIVE, ...initial, organizerId: initial?.organizerId || '' });
  const [errors, setErrors] = useState({});
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const found = validateClub(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(values);
  };

  return (
    <form className={bare ? 'form' : 'card card-pad form'} onSubmit={submit} noValidate>
      <Field id="club-name" label="Club name" error={errors.name}>
        <input id="club-name" className="input" value={values.name} onChange={set('name')} maxLength={80} aria-invalid={errors.name ? true : undefined} />
      </Field>
      <Field id="club-cat" label="Category" error={errors.category}>
        <select id="club-cat" className="input" value={values.category} onChange={set('category')} aria-invalid={errors.category ? true : undefined}>
          <option value="">Choose a category</option>
          {CLUB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field id="club-desc" label="Description" error={errors.description}>
        <textarea id="club-desc" className="input" rows={4} value={values.description} onChange={set('description')} aria-invalid={errors.description ? true : undefined} />
      </Field>
      {adminMode && (
        <div className="form-grid">
          <Field id="club-status" label="Status">
            <select id="club-status" className="input" value={values.status} onChange={set('status')}>
              <option value={CLUB_STATUS.ACTIVE}>Active (visible to students)</option>
              <option value={CLUB_STATUS.INACTIVE}>Inactive (hidden)</option>
            </select>
          </Field>
          <Field id="club-org" label="Club organizer">
            <select id="club-org" className="input" value={values.organizerId} onChange={set('organizerId')}>
              <option value="">Unassigned</option>
              {organizerOptions.map((u) => <option key={u.userId} value={u.userId}>{u.name}</option>)}
            </select>
          </Field>
        </div>
      )}
      <div className="form-actions">
        {onCancel && <Button variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
