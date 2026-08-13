
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useUserStore } from '@/stores/user/user.store';
import { Badge } from '@/shared/components/ui/badge';
import { Sparkles, Shield } from 'lucide-react';

const ROLE_COLORS: Record<string, string> = {
  'Master Admin': 'bg-gradient-to-br from-violet-600 to-purple-700',
  'Company Admin': 'bg-gradient-to-br from-indigo-600 to-blue-700',
  'Exam Manager': 'bg-gradient-to-br from-sky-600 to-cyan-700',
  'Paper Setter': 'bg-gradient-to-br from-emerald-600 to-teal-700',
  'Observer': 'bg-gradient-to-br from-amber-600 to-orange-700',
  'Technical Manager': 'bg-gradient-to-br from-slate-600 to-zinc-700',
  'Command Center': 'bg-gradient-to-br from-rose-600 to-red-700',
  'AI Proctor': 'bg-gradient-to-br from-fuchsia-600 to-pink-700',
  'Branch Manager': 'bg-gradient-to-br from-lime-600 to-green-700',
  'Center Manager': 'bg-gradient-to-br from-teal-600 to-emerald-700',
  'Biometric Verifier': 'bg-gradient-to-br from-blue-600 to-indigo-700',
  'Entry Checker': 'bg-gradient-to-br from-orange-500 to-amber-600',
  'Invigilator': 'bg-gradient-to-br from-cyan-500 to-sky-600',
  'Govt Authority': 'bg-gradient-to-br from-purple-600 to-violet-700',
  'Candidate': 'bg-gradient-to-br from-green-500 to-emerald-600',
};

const ROLE_TAGLINES: Record<string, string> = {
  'Master Admin': 'Full platform control at your fingertips.',
  'Company Admin': 'Orchestrate your exams, centers, and staff.',
  'Exam Manager': 'Plan, schedule, and oversee every examination.',
  'Paper Setter': 'Craft high-quality question papers with precision.',
  'Observer': 'Monitor, report, and ensure exam integrity.',
  'Technical Manager': 'Keep infrastructure running at peak performance.',
  'Command Center': 'Real-time oversight of all live exam operations.',
  'AI Proctor': 'AI-powered surveillance for secure examinations.',
  'Branch Manager': 'Manage branch operations and readiness.',
  'Center Manager': "Your center is ready — let's run a perfect exam.",
  'Biometric Verifier': 'Secure candidate identity verification.',
  'Entry Checker': 'Smooth and secure candidate entry management.',
  'Invigilator': 'Ensure discipline and fairness in every room.',
  'Govt Authority': 'Platform-wide compliance and transparency.',
  'Candidate': 'Your exam journey starts here.',
};

interface WelcomeBannerProps {
  unreadCount?: number;
  pendingApprovals?: number;
}

export function WelcomeBanner({ unreadCount = 0, pendingApprovals = 0 }: WelcomeBannerProps) {
  const { user } = useAuthStore();
  const profile = useUserStore((state) => state.profile);

  const role = user?.role || profile?.roleId || 'User';
  const name = user?.name || 'Welcome';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const gradient = ROLE_COLORS[role] || 'bg-gradient-to-br from-slate-600 to-slate-700';
  const tagline = ROLE_TAGLINES[role] || 'Welcome to ExamGuard Pro.';

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${gradient}`}>
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/10 blur-xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white/70" />
            <span className="text-sm font-medium text-white/80">{greeting}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
          <p className="text-sm text-white/75 max-w-md">{tagline}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm gap-1 text-xs"
          >
            <Shield className="w-3 h-3" />
            {role}
          </Badge>
          {unreadCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-amber-400/30 text-white border-amber-300/30 hover:bg-amber-400/40 backdrop-blur-sm text-xs"
            >
              {unreadCount} unread
            </Badge>
          )}
          {pendingApprovals > 0 && (
            <Badge
              variant="secondary"
              className="bg-rose-400/30 text-white border-rose-300/30 hover:bg-rose-400/40 backdrop-blur-sm text-xs"
            >
              {pendingApprovals} pending
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
