import { useState } from 'react';
import { Building2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchInput from '../components/SearchInput';
import ClubCard from '../components/ClubCard';
import EmptyState from '../components/EmptyState';
import { useAppData } from '../context/AppDataContext';
import { activeClubs } from '../services/clubService';
import { publicEvents } from '../services/eventService';
import { CLUB_CATEGORIES } from '../utils/constants';
import { isPastEvent } from '../utils/formatters';

export default function Clubs() {
  const { db } = useAppData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const upcoming = publicEvents(db).filter((e) => !isPastEvent(e));
  const q = query.trim().toLowerCase();
  const clubs = activeClubs(db).filter(
    (c) => (!category || c.category === category) && (!q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
  );

  return (
    <div className="container section">
      <PageHeader title="Clubs" subtitle="Find a community that matches your interests." />
      <div className="toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="Search clubs" label="Search clubs" />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {CLUB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {clubs.length ? (
        <div className="grid-cards">
          {clubs.map((c) => <ClubCard key={c.clubId} club={c} upcomingCount={upcoming.filter((e) => e.clubId === c.clubId).length} />)}
        </div>
      ) : (
        <EmptyState icon={Building2} title="No clubs match your search" text="Try a different keyword or clear the category filter." />
      )}
    </div>
  );
}
