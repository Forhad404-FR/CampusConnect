import { useState } from 'react';
import Field from './Field';
import Button from './Button';
import { validateEvent } from '../utils/validation';
import { todayISO } from '../utils/formatters';

const EMPTY = { title: '', description: '', date: '', time: '', location: '', capacity: '' };

// Shared create/edit form. onSubmit(values) -> boolean (true = success).
export default function EventForm({ initial, submitLabel, onSubmit, onCancel, isEdit = false }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const changedWhen = !isEdit || values.date !== initial.date || values.time !== initial.time;

  const submit = (e) => {
    e.preventDefault();
    const found = validateEvent(values, { requireFuture: changedWhen });
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(values);
  };
  const bad = (k) => (errors[k] ? true : undefined);

  return (
    <form className="card card-pad form" onSubmit={submit} noValidate>
      <Field id="ev-title" label="Event title" error={errors.title}>
        <input id="ev-title" className="input" value={values.title} onChange={set('title')} maxLength={100} aria-invalid={bad('title')} />
      </Field>
      <Field id="ev-desc" label="Description" error={errors.description}>
        <textarea id="ev-desc" className="input" rows={4} value={values.description} onChange={set('description')} aria-invalid={bad('description')} />
      </Field>
      <div className="form-grid">
        <Field id="ev-date" label="Date" error={errors.date}>
          <input id="ev-date" type="date" className="input" min={isEdit ? undefined : todayISO()} value={values.date} onChange={set('date')} aria-invalid={bad('date')} />
        </Field>
        <Field id="ev-time" label="Start time" error={errors.time}>
          <input id="ev-time" type="time" className="input" value={values.time} onChange={set('time')} aria-invalid={bad('time')} />
        </Field>
        <Field id="ev-loc" label="Location" error={errors.location}>
          <input id="ev-loc" className="input" value={values.location} onChange={set('location')} aria-invalid={bad('location')} />
        </Field>
        <Field id="ev-cap" label="Capacity (seats)" error={errors.capacity}>
          <input id="ev-cap" type="number" min="1" max="5000" className="input" value={values.capacity} onChange={set('capacity')} aria-invalid={bad('capacity')} />
        </Field>
      </div>
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
