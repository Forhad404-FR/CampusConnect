import { Building2 } from 'lucide-react';
import EmptyState from '../../components/EmptyState';

export default function NoClub() {
  return <EmptyState icon={Building2} title="No club assigned" text="Your organizer account is ready, but it isn't linked to a club yet. An administrator needs to assign you to a club before you can create events." />;
}
