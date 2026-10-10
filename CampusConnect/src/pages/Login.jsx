import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Field from '../components/Field';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { validateLogin } from '../utils/validation';
import { DEMO_ACCOUNTS, DEMO_PASSWORD, roleHome } from '../utils/constants';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  if (user) return <Navigate to={roleHome(user.role)} replace />;

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const found = validateLogin(values);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) return;
    try {
      const u = login(values.email, values.password);
      const from = location.state?.from;
      navigate(from && !from.startsWith('/login') ? from : roleHome(u.role), { replace: true });
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="container section auth-wrap">
      <div className="auth-grid">
        <form className="card card-pad form" onSubmit={submit} noValidate>
          <h1>Log in</h1>
          <p className="muted">Welcome back. Log in to manage your registrations, club or events.</p>
          {formError && <p className="notice notice-error" role="alert">{formError}</p>}
          <Field id="login-email" label="Email" error={errors.email}>
            <input id="login-email" type="email" autoComplete="username" className="input" value={values.email} onChange={set('email')} aria-invalid={errors.email ? true : undefined} />
          </Field>
          <Field id="login-password" label="Password" error={errors.password}>
            <input id="login-password" type="password" autoComplete="current-password" className="input" value={values.password} onChange={set('password')} aria-invalid={errors.password ? true : undefined} />
          </Field>
          <Button type="submit" className="btn-block">Log in</Button>
          <p className="muted small center">New student? <Link to="/register" className="link-strong">Create an account</Link></p>
        </form>

        <aside className="card card-pad demo-panel" aria-label="Demo access">
          <h2>Demo access</h2>
          <p className="muted small">Frontend demo only. These sample accounts live in your browser's localStorage and are not real, secure logins.</p>
          <ul className="demo-list">
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.email}>
                <div>
                  <strong>{a.role}</strong>
                  <code>{a.email}</code>
                </div>
                <Button size="sm" variant="secondary" onClick={() => { setValues({ email: a.email, password: DEMO_PASSWORD }); setErrors({}); setFormError(''); }}>Fill in</Button>
              </li>
            ))}
          </ul>
          <p className="small">Password for all demo accounts: <code>{DEMO_PASSWORD}</code></p>
          <p className="notice notice-info small"><ShieldAlert size={16} aria-hidden="true" /> A real deployment would use server-side authentication.</p>
        </aside>
      </div>
    </div>
  );
}
