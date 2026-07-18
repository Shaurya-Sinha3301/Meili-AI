import { Outlet } from 'react-router-dom';

export const GuestLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
};
