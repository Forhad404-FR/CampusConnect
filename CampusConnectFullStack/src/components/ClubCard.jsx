import { Link } from 'react-router-dom';
import { CATEGORY_COLORS } from '../utils/constants';
import { initials } from '../utils/formatters';

export function ClubAvatar({ club, size = 44 }) {
  return (
    <span className="club-avatar" style={{ background: CATEGORY_COLORS[club.category] || '#475569', width: size, height: size, fontSize: size * 0.36 }} aria-hidden="true">
      {initials(club.name.replace('&', ''))}
    </span>
  );
}

export default function ClubCard({ club, upcomingCount }) {
  return (
    <article className="card club-card">
      <div className="club-card-head">
        <ClubAvatar club={club} />
        <div>
          <h3><Link to={`/clubs/${club.clubId}`}>{club.name}</Link></h3>
          <span className="muted small">{club.category}</span>
        </div>
      </div>
      <p className="club-desc">{club.description}</p>
      <div className="event-card-foot">
        <span className="muted small">{upcomingCount} upcoming {upcomingCount === 1 ? 'event' : 'events'}</span>
        <Link to={`/clubs/${club.clubId}`} className="link-strong">View club</Link>
      </div>
    </article>
  );
}
