import { Building2 } from 'lucide-react';
import EmptyState from '../../components/EmptyState';

export default function NoClub() {
  return <EmptyState icon={Building2} title="No club assigned" text="Your account isn't linked to a club yet. Ask an administrator to assign you as a club organizer." />;
}
