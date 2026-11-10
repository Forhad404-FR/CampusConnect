import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, text, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true"><Icon size={26} /></span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}
