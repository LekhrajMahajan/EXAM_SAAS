import React from 'react';

export function AuthLayout({ children, illustration }: { children: React.ReactNode, illustration?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[540px] bg-white shadow-xl z-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-slate-900 text-2xl tracking-tight">PracticeExam</span>
          </div>
          {children}
        </div>
      </div>
      
      {/* Right side illustration/banner */}
      <div className="hidden lg:block relative w-0 flex-1 bg-slate-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-400 via-slate-900 to-slate-900"></div>
          
          <div className="relative z-10 max-w-lg">
            {illustration || (
              <>
                <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                  The Complete Platform for Assessment Management
                </h2>
                <p className="text-lg text-slate-400">
                  Streamline your examinations, automate evaluations, and generate insights with our comprehensive suite of tools.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
