import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, CalendarDays, ClipboardCheck, RotateCcw, Database } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { api } from '../../services/api';
import { APP_INFO } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export default function AdminDashboard() {
  const { db, resetData } = useAppData();
  const [confirmReset, setConfirmReset] = useState(false);
  const [system, setSystem] = useState(null);
  useEffect(() => {
    let off = false;
    api.get('/system').then((s) => { if (!off) setSystem(s); }).catch(() => {});
    return () => { off = true; };
  }, [db]);
  const pending = db.events.filter((e) => e.status === 'Pending');
  const recent = [...db.registrations].sort((a, b) => b.registrationDate.localeCompare(a.registrationDate)).slice(0, 5);
  const eventTitle = (id) => db.events.find((e) => e.eventId === id)?.title || 'Deleted event';
  const userName = (r) => r.student?.name || db.users.find((u) => u.userId === r.studentId)?.name || 'Unknown student';
  const clubName = (id) => db.clubs.find((c) => c.clubId === id)?.name || 'Unknown club';

  return (
    <>
      <PageHeader title="Admin dashboard" subtitle="An overview of everything on CampusConnect." />
      <div className="stat-grid">
        <StatCard icon={Users} label="Total users" value={db.users.length} />
        <StatCard icon={Building2} label="Total clubs" value={db.clubs.length} />
        <StatCard icon={CalendarDays} label="Total events" value={db.events.length} />
        <StatCard icon={ClipboardCheck} label="Pending approvals" value={pending.length} hint={pending.length ? 'Needs your review' : 'All caught up'} />
      </div>

      <div className="two-col">
        <section className="card card-pad">
          <div className="section-head tight"><h2>Awaiting approval</h2><Link to="/admin/events" className="link-strong">Review events</Link></div>
          {pending.length ? (
            <ul className="list">
              {pending.map((e) => (
                <li key={e.eventId} className="list-row">
                  <div><span className="row-title">{e.title}</span><span className="muted small">{clubName(e.clubId)}, {formatDate(e.date)}</span></div>
                  <StatusBadge status="Pending" />
                </li>
              ))}
            </ul>
          ) : <p className="muted">No events are waiting for review.</p>}
        </section>

        <section className="card card-pad">
          <h2>Recent registrations</h2>
          {recent.length ? (
            <ul className="list">
              {recent.map((r) => (
                <li key={r.registrationId} className="list-row">
                  <div><span className="row-title">{userName(r)}</span><span className="muted small">{eventTitle(r.eventId)}</span></div>
                  <span className="muted small">{formatDate(r.registrationDate)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="muted">No registrations yet.</p>}
        </section>
      </div>

      <section className="card card-pad">
        <h2>System information</h2>
        <dl className="facts facts-wide">
          <div><dt>Application</dt><dd>{APP_INFO.name} {APP_INFO.version}</dd></div>
          <div><dt>Database</dt><dd><Database size={15} aria-hidden="true" /> {system ? system.database : 'Loading...'}</dd></div>
          <div><dt>Server</dt><dd>{system ? `Node.js ${system.nodeVersion}` : 'Loading...'}</dd></div>
          <div><dt>Server uptime</dt><dd>{system ? `${Math.floor(system.uptimeSeconds / 60)} min` : '-'}</dd></div>
          <div><dt>Records stored</dt><dd>{system ? `${system.counts.users} users, ${system.counts.clubs} clubs, ${system.counts.events} events, ${system.counts.registrations} registrations` : '-'}</dd></div>
          <div><dt>Server time</dt><dd>{system ? new Date(system.serverTime).toLocaleString('en-GB') : '-'}</dd></div>
        </dl>
        <div className="demo-tools">
          <div>
            <strong>Demo tools</strong>
            <p className="muted small">Restores the original sample users, clubs, events and registrations. Accounts and records people created are removed.</p>
          </div>
          <Button variant="danger" icon={RotateCcw} onClick={() => setConfirmReset(true)}>Reset demo data</Button>
        </div>
      </section>

      <ConfirmDialog open={confirmReset} title="Reset demo data?" message="Everything in the database, including new accounts, events and registrations, will be replaced by the original sample data. This affects everyone using the site." confirmLabel="Reset demo data" danger onConfirm={async () => { setConfirmReset(false); await resetData(); }} onCancel={() => setConfirmReset(false)} />
    </>
  );
}
