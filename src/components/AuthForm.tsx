import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { authService } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'signup' | 'forgot-password';

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!email) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (mode !== 'forgot-password' && !password) {
      toast({
        title: "Validation Error",
        description: "Password is required",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (mode === 'signup') {
      if (!fullName) {
        toast({
          title: "Validation Error",
          description: "Full name is required",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        toast({
          title: "Validation Error",
          description: "Passwords don't match",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        toast({
          title: "Validation Error",
          description: "Password must be at least 6 characters",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      if (mode === 'login') {
        const result = await authService.login(email, password);
        if (result.success) {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
            className: "bg-teal text-white"
          });
          navigate('/dashboard');
        } else {
          toast({
            title: "Login Failed",
            description: result.message || "Invalid credentials",
            variant: "destructive"
          });
        }
      } else if (mode === 'signup') {
        const result = await authService.signup(email, password, fullName);
        if (result.success) {
          toast({
            title: "Account Created",
            description: "Welcome! You've been logged in.",
            className: "bg-teal text-white"
          });
          navigate('/dashboard');
        } else {
          toast({
            title: "Signup Failed",
            description: result.message || "Failed to create account",
            variant: "destructive"
          });
        }
      } else if (mode === 'forgot-password') {
        const result = await authService.resetPassword(email);
        toast({
          title: result.success ? "Password Reset Email Sent" : "Reset Failed",
          description: result.message,
          className: result.success ? "bg-teal text-white" : "",
          variant: result.success ? "default" : "destructive"
        });
        if (result.success) {
          setMode('login');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'forgot-password': return 'Reset Password';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Sign in to your account to continue';
      case 'signup': return 'Create a new account to get started';
      case 'forgot-password': return 'Enter your email to receive reset instructions';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-teal/10 to-navy/5 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-navy to-dark-blue rounded-full flex items-center justify-center">
                {mode === 'forgot-password' ? (
                  <Mail className="w-6 h-6 text-white" />
                ) : mode === 'signup' ? (
                  <User className="w-6 h-6 text-white" />
                ) : (
                  <Lock className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-dark-blue">{getTitle()}</CardTitle>
              <CardDescription className="text-dark-blue/70 mt-2">{getDescription()}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2 animate-slide-in">
                  <Label htmlFor="fullName" className="text-dark-blue font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-blue/50 w-4 h-4" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 border-2 border-cream focus:border-teal transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-dark-blue font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-blue/50 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-2 border-cream focus:border-teal transition-colors"
                  />
                </div>
              </div>

              {mode !== 'forgot-password' && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-dark-blue font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-blue/50 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 border-2 border-cream focus:border-teal transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-blue/50 hover:text-dark-blue transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-2 animate-slide-in">
                  <Label htmlFor="confirmPassword" className="text-dark-blue font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-blue/50 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 border-2 border-cream focus:border-teal transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-blue/50 hover:text-dark-blue transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-navy to-dark-blue hover:from-dark-blue hover:to-navy text-white font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  mode === 'forgot-password' ? 'Send Reset Email' : 
                  mode === 'signup' ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            <div className="space-y-4">
              {mode === 'forgot-password' ? (
                <Button 
                  variant="ghost" 
                  onClick={() => setMode('login')}
                  className="w-full text-dark-blue hover:text-navy hover:bg-cream/50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              ) : (
                <>
                  {mode === 'login' && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setMode('forgot-password')}
                      className="w-full text-teal hover:text-navy hover:bg-cream/50 transition-colors"
                    >
                      Forgot your password?
                    </Button>
                  )}

                  <Separator className="bg-cream" />

                  <div className="text-center">
                    <span className="text-dark-blue/70">
                      {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <Button 
                      variant="ghost" 
                      onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                      className="ml-2 text-teal hover:text-navy hover:bg-cream/50 transition-colors p-0 h-auto font-semibold"
                    >
                      {mode === 'login' ? 'Sign up' : 'Sign in'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-dark-blue/50 text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
