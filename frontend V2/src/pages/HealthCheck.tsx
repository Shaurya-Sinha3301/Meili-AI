import { useEffect, useState } from 'react';
import apiClient from '../services/client';
import { useAuthStore } from '../stores/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../providers/ThemeProvider';
import { ENV } from '../config/env';

export const HealthCheck = () => {
  const { theme } = useTheme();
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const [apiLive, setApiLive] = useState<'checking' | 'ok' | 'error'>('checking');
  const [apiReady, setApiReady] = useState<'checking' | 'ok' | 'error'>('checking');
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    apiClient.get('/health/live')
      .then(() => {
        setApiLive('ok');
        setLatency(Math.round(performance.now() - start));
      })
      .catch(() => setApiLive('error'));
      
    apiClient.get('/health/ready')
      .then(() => setApiReady('ok'))
      .catch(() => setApiReady('error'));
  }, []);

  return (
    <div className="p-8 space-y-4 font-mono text-sm">
      <h1 className="text-xl font-bold mb-6">System Health Check</h1>
      
      <div className="flex justify-between max-w-sm p-4 border rounded">
        <span>Environment:</span>
        <span className="text-blue-500 font-bold">{ENV.APP_ENV}</span>
      </div>

      <div className="flex justify-between max-w-sm p-4 border rounded">
        <span>React Router:</span>
        <span className="text-green-500 font-bold">OK</span>
      </div>
      
      <div className="flex justify-between max-w-sm p-4 border rounded">
        <span>React Query Provider:</span>
        <span className="text-green-500 font-bold">{queryClient ? 'OK' : 'Error'}</span>
      </div>
      
      <div className="flex justify-between max-w-sm p-4 border rounded">
        <span>Zustand Store:</span>
        <span className="text-green-500 font-bold">OK (Token: {token ? 'Present' : 'None'})</span>
      </div>
      
      <div className="flex justify-between max-w-sm p-4 border rounded">
        <span>Backend Reachable (Live):</span>
        <span className={`font-bold ${apiLive === 'ok' ? 'text-green-500' : apiLive === 'error' ? 'text-red-500' : 'text-yellow-500'}`}>
          {apiLive.toUpperCase()} {latency !== null && `(${latency}ms)`}
        </span>
      </div>
      
      <div className="flex justify-between max-w-sm p-4 border rounded">
        <span>Backend Ready (DB):</span>
        <span className={`font-bold ${apiReady === 'ok' ? 'text-green-500' : apiReady === 'error' ? 'text-red-500' : 'text-yellow-500'}`}>
          {apiReady.toUpperCase()}
        </span>
      </div>
    </div>
  );
};