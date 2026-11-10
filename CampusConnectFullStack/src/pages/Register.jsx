import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Field from '../components/Field';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { validateRegister } from '../utils/validation';
import { roleHome, ROLES, SIGNUP_ROLES } from '../utils/constants';

export default function Register() {
  const { user, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '', role: ROLES.STUDENT });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={roleHome(user.role)} replace />;

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    const found = validateRegister(values);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) return;
    setSubmitting(true);
    try {
      const u = await register(values);
      toast.success(`Welcome to CampusConnect, ${u.name.split(' ')[0]}!`);
      navigate(roleHome(u.role), { replace: true });
    } catch (err) {
      setFormError(err.message);
      setSubmitting(false);
    }
  };
  const bad = (k) => (errors[k] ? true : undefined);

  return (
    <div className="container section auth-wrap">
      <form className="card card-pad form auth-single" onSubmit={submit} noValidate>
        <h1>Create your account</h1>
        <p className="muted">Choose how you will use CampusConnect, then fill in your details.</p>
        {formError && <p className="notice notice-error" role="alert">{formError}</p>}
        <fieldset className="role-picker">
          <legend>I am joining as</legend>
          {SIGNUP_ROLES.map((r) => (
            <label key={r.value} className={`role-option${values.role === r.value ? ' selected' : ''}`}>
              <input type="radio" name="role" value={r.value} checked={values.role === r.value} onChange={set('role')} />
              <span><strong>{r.label}</strong><small>{r.text}</small></span>
            </label>
          ))}
          {errors.role && <span className="field-error" role="alert">{errors.role}</span>}
          {values.role === ROLES.ORGANIZER && <p className="notice notice-info small">After signing up, an administrator assigns your club. You can create events once that is done.</p>}
        </fieldset>
        <Field id="reg-name" label="Full name" error={errors.name}>
          <input id="reg-name" className="input" autoComplete="name" value={values.name} onChange={set('name')} aria-invalid={bad('name')} />
        </Field>
        <Field id="reg-email" label="Email" error={errors.email}>
          <input id="reg-email" type="email" className="input" autoComplete="email" value={values.email} onChange={set('email')} aria-invalid={bad('email')} />
        </Field>
        <Field id="reg-password" label="Password" error={errors.password} hint="At least 8 characters, with a letter and a number.">
          <input id="reg-password" type="password" className="input" autoComplete="new-password" value={values.password} onChange={set('password')} aria-invalid={bad('password')} />
        </Field>
        <Field id="reg-confirm" label="Confirm password" error={errors.confirmPassword}>
          <input id="reg-confirm" type="password" className="input" autoComplete="new-password" value={values.confirmPassword} onChange={set('confirmPassword')} aria-invalid={bad('confirmPassword')} />
        </Field>
        <Button type="submit" className="btn-block" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</Button>
        <p className="muted small center">Already registered? <Link to="/login" className="link-strong">Log in</Link></p>
      </form>
    </div>
  );
}
