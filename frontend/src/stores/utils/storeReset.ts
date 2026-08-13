import { useAuthStore as useGlobalAuthStore } from '../auth/auth.store';
import { useUserStore } from '../user/user.store';
import { usePermissionStore } from '../permissions/permission.store';
import { useSessionStore } from '../session/session.store';
import { useCandidateStore } from '../candidate/candidate.store';
import { useExamStore } from '../exam/exam.store';
import { useAuthStore as useFeatureAuthStore } from '@/features/auth/store/useAuthStore';
import { useAuthStore as useLegacyAuthStore } from '@/store/auth.store';

/**
 * Resets all non-persisted application stores to their default states.
 * Highly useful on user logout or token expiration.
 */
export const resetAllStores = () => {
  useGlobalAuthStore.getState().logout();
  useFeatureAuthStore.getState().clearAuth();
  useLegacyAuthStore.getState().logout();

  useUserStore.getState().clearUser();
  usePermissionStore.getState().clearPermissions();
  useSessionStore.getState().setStatus('idle');
  useCandidateStore.getState().clearCandidate();
  useExamStore.getState().endExam();
  
  // Clean up all localStorage auth tokens and states
  localStorage.removeItem('examguard_auth_tokens');
  localStorage.removeItem('auth');
  localStorage.removeItem('auth-storage');
};
