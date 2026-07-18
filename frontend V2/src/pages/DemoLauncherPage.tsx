import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../stores/auth.store';
import { apiClient } from '../services/client';

const DEMO_PERSONAS = [
  {
    id: 'Family_Vacation',
    icon: '👨‍👩‍👧',
    name: 'Family Vacation',
    travelers: 4,
    destination: 'Delhi',
    budget: 'Medium Budget',
    description: 'A balanced trip with a mix of sightseeing, food, and family-friendly activities.',
  },
  {
    id: 'Luxury_Couple',
    icon: '🥂',
    name: 'Luxury Couple',
    travelers: 2,
    destination: 'Delhi',
    budget: 'High Budget',
    description: 'A relaxed, premium experience focusing on fine dining, nightlife, and culture.',
  },
  {
    id: 'Budget_Backpacker',
    icon: '🎒',
    name: 'Budget Backpacker',
    travelers: 1,
    destination: 'Delhi',
    budget: 'Low Budget',
    description: 'Fast-paced adventure hitting all major spots with high energy.',
  },
  {
    id: 'Elderly_Travelers',
    icon: '👴👵',
    name: 'Elderly Travelers',
    travelers: 2,
    destination: 'Delhi',
    budget: 'Medium Budget',
    description: 'Relaxed golden years trip focusing on history, religion, and accessibility.',
  },
  {
    id: 'Accessibility_Trip',
    icon: '♿',
    name: 'Accessibility Trip',
    travelers: 3,
    destination: 'Delhi',
    budget: 'Medium Budget',
    description: 'Tour focused on wheelchair-friendly locations with no stairs.',
  },
];

export function DemoLauncherPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLaunch = async (personaId: string) => {
    setLoading(personaId);
    setError(null);
    try {
      // Step 1: Call load demo
      const res = await apiClient.post(`/demo/load/${personaId}`);
      if (res.data.status === 'SUCCESS' && res.data.access_token) {
        // Step 2: Set Auth
        setAuth(res.data.user, res.data.access_token);
        // Step 3: Navigate to Dashboard
        navigate(ROUTES.DASHBOARD);
      } else {
        throw new Error('Failed to load demo session.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'An error occurred.');
    } finally {
      setLoading(null);
    }
  };

  const handleReset = async () => {
    setLoading('reset');
    setError(null);
    try {
      await apiClient.post('/demo/reset');
      alert('Demo database reset successfully.');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'An error occurred during reset.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Explore Merydian
            </h1>
            <p className="text-muted-foreground mt-2">
              Select a demo persona to experience the platform from different perspectives.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => navigate(ROUTES.LANDING)}>
              Back
            </Button>
            <Button variant="secondary" onClick={handleReset} loading={loading === 'reset'}>
              Reset Demo DB
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_PERSONAS.map((p) => (
            <Card key={p.id} padding="md" className="flex flex-col h-full">
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {p.name}
              </h3>
              <div className="text-sm text-muted-foreground space-y-1 mb-4 flex-1">
                <p>👥 {p.travelers} Travelers</p>
                <p>📍 {p.destination}</p>
                <p>💰 {p.budget}</p>
                <p className="mt-2 line-clamp-2">{p.description}</p>
              </div>
              <Button
                variant="primary"
                className="w-full"
                loading={loading === p.id}
                onClick={() => handleLaunch(p.id)}
              >
                Launch Demo
              </Button>
            </Card>
          ))}
          
          <Card padding="md" className="flex flex-col h-full bg-primary/5 border-primary/20">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-xl font-bold mb-2 text-primary" style={{ fontFamily: 'var(--font-display)' }}>
              Demo Administrator
            </h3>
            <div className="text-sm text-muted-foreground space-y-1 mb-4 flex-1">
              <p>Monitor jobs, inspect backend, and oversee all trip sessions.</p>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              loading={loading === 'admin'}
              onClick={async () => {
                setLoading('admin');
                try {
                  // Admin is provisioned with a known password. We can just login directly using standard auth
                  const params = new URLSearchParams();
                  params.append('username', 'admin@demo.merydian.com');
                  params.append('password', 'demo123');
                  const res = await apiClient.post('/auth/login', params);
                  if (res.data.access_token) {
                    setAuth(res.data.user, res.data.access_token);
                    navigate(ROUTES.DASHBOARD);
                  }
                } catch (err: any) {
                  setError(err.message || 'Failed to login as admin.');
                } finally {
                  setLoading(null);
                }
              }}
            >
              Launch Admin
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
