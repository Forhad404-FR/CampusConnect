import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Field from '../components/Field';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { validateRegister } from '../utils/validation';
import { roleHome } from '../utils/constants';

export default function Register() {
  const { user, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  if (user) return <Navigate to={roleHome(user.role)} replace />;

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const found = validateRegister(values);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) return;
    try {
      const u = register(values);
      toast.success(`Welcome to CampusConnect, ${u.name.split(' ')[0]}!`);
      navigate(roleHome(u.role), { replace: true });
    } catch (err) {
      setFormError(err.message);
    }
  };
  const bad = (k) => (errors[k] ? true : undefined);

  return (
    <div className="container section auth-wrap">
      <form className="card card-pad form auth-single" onSubmit={submit} noValidate>
        <h1>Create a student account</h1>
        <p className="muted">Demo registration: your account is saved only in this browser.</p>
        {formError && <p className="notice notice-error" role="alert">{formError}</p>}
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
        <p className="small muted">Don't reuse a real password. Demo passwords are stored unencrypted in your browser.</p>
        <Button type="submit" className="btn-block">Create account</Button>
        <p className="muted small center">Already registered? <Link to="/login" className="link-strong">Log in</Link></p>
      </form>
    </div>
  );
}
