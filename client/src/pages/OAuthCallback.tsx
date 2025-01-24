import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tokensSaved, setTokensSaved] = useState(false);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      navigate(`/login?error=${error}`);
      return;
    }

    if (accessToken && refreshToken) {
      try {
        // Save tokens to localStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          // After saving, set state to trigger navigation
          setTokensSaved(true);
        } else {
          console.error('LocalStorage is not available');
          navigate('/login');
        }
      } catch (e) {
        console.error('Error saving tokens to localStorage:', e);
        navigate('/login');
      }
    } else {
      console.log('AccessToken or RefreshToken is missing. Redirecting to login.');
      navigate('/login');
    }
  }, [navigate, searchParams]);

  useEffect(() => {
    // Delay navigation after tokens are saved successfully
    if (tokensSaved) {
      setTimeout(() => {
        navigate('/');
      }, 500); // Small delay to ensure everything is set
    }
  }, [tokensSaved, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Processing...</h2>
        <p className="text-muted-foreground">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}