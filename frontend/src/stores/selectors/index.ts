import { useUserStore } from '../user/user.store';

// Selectors allow components to subscribe to specific parts of state without re-rendering on every change.

export const selectUserProfile = (state: ReturnType<typeof useUserStore.getState>) => state.profile;
export const selectUserPreferences = (state: ReturnType<typeof useUserStore.getState>) => state.preferences;

// We could add more complex computed state selectors here, such as:
// export const selectIsAdmin = (state: any) => state.profile?.role === 'admin';
