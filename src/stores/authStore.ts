/**
 * 认证状态管理
 */
import { useSyncExternalStore } from 'react';

export interface CurrentUser {
  id: number;
  username: string;
  realName: string;
  avatar: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: CurrentUser | null;
}

let state: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
};

const listeners = new Set<() => void>();

function getSnapshot(): AuthState {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChange() {
  listeners.forEach((l) => l());
}

export const authStore = {
  getSnapshot,
  subscribe,
  login: (token: string, user: CurrentUser) => {
    state = { ...state, token, user };
    if (token) localStorage.setItem('token', token);
    emitChange();
  },
  logout: () => {
    state = { token: null, user: null };
    localStorage.removeItem('token');
    emitChange();
  },
  isAuthenticated: () => !!state.token,
};

export function useAuthStore<T>(selector: (state: AuthState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()), () => selector(getSnapshot()));
}

export function useCurrentUser(): CurrentUser | null {
  return useAuthStore((s) => s.user);
}

export function useIsAuthenticated(): boolean {
  return useAuthStore((s) => !!s.token);
}
