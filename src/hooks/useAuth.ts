// Mock auth hook for demo mode
export interface AuthUser {
  id: string;
  email: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    study_streak: number;
    total_study_hours: number;
  };
}

export const useAuth = () => {
  // Mock user for demo mode
  const mockUser: AuthUser = {
    id: 'demo-user-123',
    email: 'demo@gapguru.com',
    profile: {
      full_name: 'Demo User',
      avatar_url: null,
      study_streak: 7,
      total_study_hours: 45
    }
  };

  return {
    user: mockUser,
    loading: false,
    signUp: async () => ({ data: null, error: new Error('Demo mode - authentication disabled') }),
    signIn: async () => ({ data: null, error: new Error('Demo mode - authentication disabled') }),
    signOut: async () => ({ error: null }),
    isAuthenticated: true,
  };
};