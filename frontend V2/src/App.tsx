import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { router } from './router';

const ErrorFallback = ({ error, resetErrorBoundary }: import('react-error-boundary').FallbackProps) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-md p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Something went wrong</h2>
        <p className="text-sm font-mono text-red-800 dark:text-red-200 break-words mb-4">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
