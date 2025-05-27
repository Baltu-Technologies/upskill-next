'use client';

import { useState } from 'react';
import { signIn, signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from './ThemeToggle';

interface AuthFormProps {
  onSuccess: () => void;
}

type AuthStep = 'signIn' | 'signUp' | 'confirmSignUp';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  confirmationCode: string;
}

export default function AuthFormShadcn({ onSuccess }: AuthFormProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>('signIn');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    confirmationCode: ''
  });

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      confirmationCode: ''
    });
    setError(null);
    setSuccess(null);
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signIn({
        username: formData.email,
        password: formData.password
      });
      setSuccess('Successfully signed in!');
      onSuccess();
      resetForm();
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.name === 'UserNotConfirmedException') {
        setPendingEmail(formData.email);
        setCurrentStep('confirmSignUp');
        setError('Please confirm your email address to complete sign up');
      } else {
        setError(error.message || 'Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First and last name are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            given_name: formData.firstName.trim(),
            family_name: formData.lastName.trim()
          }
        }
      });
      setPendingEmail(formData.email);
      setCurrentStep('confirmSignUp');
      setSuccess('Account created! Please check your email for a confirmation code.');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirmationCode.trim()) {
      setError('Confirmation code is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await confirmSignUp({
        username: pendingEmail,
        confirmationCode: formData.confirmationCode.trim()
      });
      setSuccess('Email confirmed! You can now sign in.');
      setTimeout(() => {
        setCurrentStep('signIn');
        setFormData(prev => ({ ...prev, email: pendingEmail, confirmationCode: '' }));
        setSuccess(null);
      }, 2000);
    } catch (error: any) {
      console.error('Confirmation error:', error);
      setError(error.message || 'Invalid confirmation code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await resendSignUpCode({ username: pendingEmail });
      setSuccess('Confirmation code resent to your email.');
    } catch (error: any) {
      console.error('Resend code error:', error);
      setError(error.message || 'Failed to resend confirmation code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🚀 Upskill
          </h1>
          <p className="text-muted-foreground mt-2">Accelerate Your Learning</p>
        </div>

        <Card className="backdrop-blur-xl bg-card/50 border border-border/50 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {currentStep === 'signIn' && 'Welcome Back'}
              {currentStep === 'signUp' && 'Create Account'}
              {currentStep === 'confirmSignUp' && 'Confirm Email'}
            </CardTitle>
            <CardDescription>
              {currentStep === 'signIn' && 'Sign in to continue your learning journey'}
              {currentStep === 'signUp' && 'Join thousands of learners on Upskill'}
              {currentStep === 'confirmSignUp' && `We sent a code to ${pendingEmail}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md text-green-500 text-sm">
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            {/* Sign In Form */}
            {currentStep === 'signIn' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signin-email" className="text-sm font-medium flex items-center gap-2">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="signin-password" className="text-sm font-medium flex items-center gap-2">
                    <Lock size={16} />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setCurrentStep('signUp')}
                    className="text-muted-foreground"
                  >
                    Don't have an account? Create one
                  </Button>
                </div>
              </form>
            )}

            {/* Sign Up Form */}
            {currentStep === 'signUp' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="signup-firstname" className="text-sm font-medium flex items-center gap-2">
                      <User size={16} />
                      First Name
                    </label>
                    <Input
                      id="signup-firstname"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="First name"
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-lastname" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="signup-lastname"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Last name"
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium flex items-center gap-2">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium flex items-center gap-2">
                    <Lock size={16} />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-confirm-password" className="text-sm font-medium flex items-center gap-2">
                    <Lock size={16} />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setCurrentStep('signIn')}
                    className="text-muted-foreground"
                  >
                    Already have an account? Sign in
                  </Button>
                </div>
              </form>
            )}

            {/* Confirmation Form */}
            {currentStep === 'confirmSignUp' && (
              <form onSubmit={handleConfirmSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="confirmation-code" className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle size={16} />
                    Confirmation Code
                  </label>
                  <Input
                    id="confirmation-code"
                    type="text"
                    value={formData.confirmationCode}
                    onChange={(e) => handleInputChange('confirmationCode', e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      Confirm Email
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Resend Code
                  </Button>
                  
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setCurrentStep('signIn')}
                    className="text-muted-foreground"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 