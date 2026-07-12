import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-emerald-brand">404</p>
        <h1 className="text-2xl font-bold text-foreground mt-2">Page not found</h1>
        <p className="text-foreground-subtle mt-2 max-w-md">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex gap-3 justify-center mt-6">
          <Link to="/"><Button variant="outline">Go home</Button></Link>
          <Link to="/dashboard"><Button>Dashboard</Button></Link>
        </div>
      </div>
    </div>
  );
}
