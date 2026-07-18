export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
} as const;
