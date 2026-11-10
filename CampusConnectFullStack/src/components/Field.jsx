// Label + control + error message. The caller sets the same `id` on the control.
export default function Field({ id, label, error, hint, children }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error" id={`${id}-error`} role="alert">{error}</span>}
    </div>
  );
}
