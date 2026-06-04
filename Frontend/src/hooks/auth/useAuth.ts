import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/api/authService';
import { logError } from '@/lib/error';
import { setSentryUser, clearSentryUser } from '@/lib/error/errorMonitoring';
import { AuthStore } from '@/types/auth';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.login(credentials);
          const { token, refreshToken, user } = response;

          // Store tokens in localStorage for axios interceptor
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', refreshToken);

          // Set user context for error monitoring
          setSentryUser(user.id, user.email, user.firstName);

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          logError(error, 'Auth Login');
          
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.register(userData);
          const { token, refreshToken, user } = response;

          // Store tokens in localStorage for axios interceptor
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', refreshToken);

          // Set user context for error monitoring
          setSentryUser(user.id, user.email, user.firstName);

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          logError(error, 'Auth Register');
          
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          
          throw error;
        }
      },

      logout: () => {
        // Call logout API (fire and forget)
        authService.logout().catch((error) => {
          logError(error, 'Auth Logout');
        });

        // Clear user context from error monitoring
        clearSentryUser();

        // Clear tokens from localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Hook for authentication functionality
 */
export const useAuth = () => {
  const store = useAuthStore((s) => s);
  
  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    
    // Actions
    login: store.login,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
  };
};
