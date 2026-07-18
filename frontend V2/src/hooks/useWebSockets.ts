import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../constants/queryKeys';

export function useWebSockets() {
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || !token) return;

    // Use window.location.host for WS if API is on the same host, or derive from VITE_API_URL
    const wsBaseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('http', 'ws').replace('/api/v1', '')
      : `ws://${window.location.host}`;
      
    const rolePath = user.role === 'agent' ? `agent/${user.id}` : `traveller/${user.id}`;
    const ws = new WebSocket(`${wsBaseUrl}/ws/${rolePath}`);

    ws.onopen = () => {
      console.log(`Connected to websocket as ${user.role}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket event:', data);
        
        if (data.type === 'JOB_COMPLETED' || data.type === 'JOB_STARTED') {
          // Invalidate trips and jobs to refresh dashboard
          queryClient.invalidateQueries({ queryKey: [queryKeys.trips] });
          queryClient.invalidateQueries({ queryKey: ['agent-jobs'] });
        }
      } catch (err) {
        console.error('Failed to parse websocket message', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [user, token, queryClient]);
}
