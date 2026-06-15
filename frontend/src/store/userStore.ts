import { create } from 'zustand';

interface UserState {
  user: any | null;
  isAuthenticated: boolean;
  setUser: (user: any, token?: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  setUser: (user, token) => {
    if (token) localStorage.setItem('auth_token', token);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, isAuthenticated: false });
  },
}));
