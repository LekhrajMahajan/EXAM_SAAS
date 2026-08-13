import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-red-100 p-6 mb-6 dark:bg-red-900/20">
        <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">Access Denied</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        You don&apos;t have permission to access this page. Please contact your administrator if you believe this is a mistake.
      </p>
      <div className="flex gap-4">
        <Link to="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Go to Home</Button>
        </Link>
      </div>
    </div>
  );
};
