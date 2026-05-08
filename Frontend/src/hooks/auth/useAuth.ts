import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';
import { logError } from '@/lib/errorUtils';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
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

          const response = await authApi.login(credentials);
          const { token, refreshToken, user } = response;

          // Store tokens in localStorage for axios interceptor
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', refreshToken);

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

          const response = await authApi.register(userData);
          const { token, refreshToken, user } = response;

          // Store tokens in localStorage for axios interceptor
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', refreshToken);

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
        authApi.logout().catch((error) => {
          logError(error, 'Auth Logout');
        });

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
  const store = useAuthStore();
  
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