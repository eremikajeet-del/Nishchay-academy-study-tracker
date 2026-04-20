import { create } from 'zustand';

export type ViewType = 
  | 'dashboard' 
  | 'calendar' 
  | 'flashcards' 
  | 'quiz' 
  | 'focus' 
  | 'revisions'
  | 'topics'
  | 'goals'
  | 'analytics'
  | 'admin'
  | 'ai-coach'
  | 'mood'
  | 'achievements'
  | 'formulas'
  | 'search'
  | 'folders';

interface AppState {
  // Auth
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  authStatus: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'pending' | 'rejected';
  
  // Navigation
  currentView: ViewType;
  sidebarOpen: boolean;
  
  // UI State
  searchOpen: boolean;
  
  // Actions
  setUser: (user: any) => void;
  setToken: (token: string) => void;
  login: (user: any, token: string) => void;
  logout: () => void;
  setAuthStatus: (status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'pending' | 'rejected') => void;
  setCurrentView: (view: ViewType) => void;
  toggleSidebar: () => void;
  setSearchOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  authStatus: 'idle',
  currentView: 'dashboard',
  sidebarOpen: true,
  searchOpen: false,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('study_tracker_token', token);
    }
    set({ token });
  },
  login: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('study_tracker_token', token);
    }
    set({ user, token, isAuthenticated: true, authStatus: 'authenticated' });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('study_tracker_token');
    }
    set({ user: null, token: null, isAuthenticated: false, authStatus: 'unauthenticated', currentView: 'dashboard' });
  },
  setAuthStatus: (authStatus) => set({ authStatus }),
  setCurrentView: (currentView) => set({ currentView }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}));
