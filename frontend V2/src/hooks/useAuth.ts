import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth';
import type { UserCreate, LogoutRequest, TokenRefresh } from '../types/dto/auth';
import { useAuthStore } from '../stores/auth.store';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function useLogin() {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: (data: URLSearchParams) => authService.login(data),
    onSuccess: (data) => {
      setToken(data.access_token);
      const payload = parseJwt(data.access_token);
      const role = payload?.role || 'customer';
      setUser({ id: payload?.sub || 'temp', role });
    },
  });
}

export function useSignup() {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: (data: UserCreate) => authService.signup(data),
    onSuccess: (data) => {
      setToken(data.access_token);
      const payload = parseJwt(data.access_token);
      const role = payload?.role || 'customer';
      setUser({ id: payload?.sub || 'temp', role });
    },
  });
}

export function useLogout() {
  const logoutStore = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LogoutRequest = {}) => authService.logout(data),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: (data: TokenRefresh) => authService.refresh(data),
  });
}
