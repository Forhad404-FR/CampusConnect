const TONES = {
  Pending: 'amber', Approved: 'green', Rejected: 'red',
  Present: 'green', Absent: 'red', Registered: 'blue',
  Active: 'green', Inactive: 'slate', Disabled: 'red',
  Full: 'amber', Past: 'slate', Upcoming: 'blue',
};

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${TONES[status] || 'slate'}`}>{status}</span>;
}
