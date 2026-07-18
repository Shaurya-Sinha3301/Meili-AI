import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants/routes';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            M
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Merydian
          </h1>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full h-14 text-lg" 
            variant="primary" 
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Sign in to your account
          </Button>
          
          <Button 
            className="w-full h-14 text-lg" 
            variant="secondary" 
            onClick={() => navigate(ROUTES.DEMO)}
          >
            Explore Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
