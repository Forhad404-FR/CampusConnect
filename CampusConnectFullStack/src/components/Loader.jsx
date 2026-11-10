import { Brand } from './Navbar';

// Full-page states shown while the app connects to the server (free hosting can take ~30-60 s to wake up).
export function PageLoader() {
  return (
    <div className="boot" role="status" aria-live="polite">
      <Brand />
      <div className="spinner" aria-hidden="true" />
      <p><strong>Loading CampusConnect...</strong></p>
      <p className="muted small">If the site hasn't been used for a while, the free server may need up to a minute to wake up.</p>
    </div>
  );
}

export function ServerError({ message, onRetry }) {
  return (
    <div className="boot" role="alert">
      <Brand />
      <p><strong>We couldn't reach the server</strong></p>
      <p className="muted small">{message}</p>
      <button className="btn btn-primary btn-md" onClick={onRetry}>Try again</button>
    </div>
  );
}
