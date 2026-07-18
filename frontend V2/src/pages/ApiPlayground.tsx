import { useState } from 'react';
import { useTrips } from '../hooks/useTrips';
import { useTimeline } from '../hooks/useTimeline';
import { useSettings } from '../hooks/useSettings';

export const ApiPlayground = () => {
  const [lastResult, setLastResult] = useState<unknown>(null);
  const [lastError, setLastError] = useState<unknown>(null);

  const trips = useTrips();
  const timeline = useTimeline();
  const settings = useSettings();

  const handleResult = (data: unknown, error: unknown) => {
    setLastResult(data);
    setLastError(error);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">API Playground</h1>
      <p className="text-muted-foreground">Test endpoints before building UI</p>
      
      <div className="flex gap-4">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => handleResult(trips.data, trips.error)}
        >
          Test Trips
        </button>
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => handleResult(timeline.data, timeline.error)}
        >
          Test Timeline
        </button>
        <button 
          className="px-4 py-2 bg-purple-600 text-white rounded"
          onClick={() => handleResult(settings.data, settings.error)}
        >
          Test Settings
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-900 rounded overflow-auto" style={{ maxHeight: '400px' }}>
        <h3 className="font-bold mb-2">Last Result:</h3>
        <pre className="text-sm">
          {lastError ? JSON.stringify(lastError, null, 2) : JSON.stringify(lastResult, null, 2) || 'No data'}
        </pre>
      </div>
    </div>
  );
};
