
import { Outlet } from 'react-router-dom';

export const ExamManagerLayout = () => {
  return (
    <div className="h-full bg-background text-foreground flex flex-col">
      {/* ExamManager sidebar will go here */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
