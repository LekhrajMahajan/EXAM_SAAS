import { Outlet } from 'react-router-dom';
import { CandidateSidebar } from '../features/candidate/components/layout/CandidateSidebar';
import { CandidateHeader } from '../features/candidate/components/layout/CandidateHeader';

export const CandidateLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <CandidateSidebar />
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <CandidateHeader />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
