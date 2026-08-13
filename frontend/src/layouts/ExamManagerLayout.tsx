
import { Outlet } from 'react-router-dom';

export const ExamManagerLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* ExamManager sidebar will go here */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
