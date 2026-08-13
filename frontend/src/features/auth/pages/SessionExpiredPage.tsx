import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { ClockAlert } from 'lucide-react';

export const SessionExpiredPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md bg-background p-8 rounded-xl shadow-lg border text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-6">
          <ClockAlert className="h-8 w-8 text-orange-600" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Session Expired</h2>
        <p className="text-muted-foreground mb-8">
          Your session has expired due to inactivity. For your security, you need to sign in again to continue.
        </p>
        <Link to="/login">
          <Button className="w-full py-2.5">Sign In Again</Button>
        </Link>
      </div>
    </div>
  );
};
