import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Gift, Zap, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const { user, isLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error('Failed to sign in with Google');
      console.error('Sign in error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ellio-blue/10 via-background to-ellio-purple/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-ellio-blue to-ellio-purple rounded-2xl flex items-center justify-center mb-4">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-ellio-blue to-ellio-purple bg-clip-text text-transparent">
              Welcome to Ellio
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access all student services
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Welcome Bonus Banner */}
            <div className="bg-gradient-to-r from-ellio-green/20 to-ellio-teal/20 border border-ellio-green/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ellio-green/20 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-ellio-green" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Get 50 Free Coins!</p>
                  <p className="text-sm text-muted-foreground">Sign up now and start using services</p>
                </div>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button 
              onClick={handleGoogleSignIn}
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm"
              variant="outline"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-ellio-blue" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-ellio-green" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Coins className="w-4 h-4 text-ellio-purple" />
                <span>Coin Wallet</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gift className="w-4 h-4 text-ellio-pink" />
                <span>Referral Bonus</span>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
