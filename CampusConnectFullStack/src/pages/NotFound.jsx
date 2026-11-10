import { Compass } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="container section">
      <EmptyState icon={Compass} title="Page not found" text="The page you were looking for doesn't exist or has moved." action={<Button to="/">Back to home</Button>} />
    </div>
  );
}
