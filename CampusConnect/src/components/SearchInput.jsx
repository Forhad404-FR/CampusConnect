import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search', label = 'Search' }) {
  return (
    <div className="search-input">
      <Search size={17} aria-hidden="true" />
      <input type="search" className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={label} />
    </div>
  );
}
