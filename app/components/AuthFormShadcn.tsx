'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/auth-client';

interface AuthFormProps {
  onSuccess: () => void;
}

type AuthStep = 'signIn' | 'signUp';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export default function AuthFormShadcn({ onSuccess }: AuthFormProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>('signIn');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (currentStep === 'signIn') {
        await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
          callbackURL: '/dashboard'
        });
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        await authClient.signUp.email({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          callbackURL: '/dashboard'
        });
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err?.message || `Failed to ${currentStep === 'signIn' ? 'sign in' : 'sign up'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#101b23] flex items-center justify-center p-4"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="w-full max-w-md bg-[#101b23] rounded-2xl shadow-2xl border border-[#223949]/30 overflow-hidden">
        {/* Hero Image Section */}
        <div className="@container">
          <div className="p-4">
            <div
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl h-48"
              style={{
                backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <div className="p-6 bg-gradient-to-t from-black/50 to-transparent">
                <h1 className="text-white text-xl font-bold">Welcome to Upskill</h1>
                <p className="text-white/80 text-sm mt-1">Your journey to mastery starts here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Title */}
        <h2 className="text-white tracking-light text-2xl font-bold leading-tight px-6 text-center pb-3 pt-2">
          {currentStep === 'signIn' ? 'Log in to Upskill' : 'Create your account'}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="px-6">
          {/* Name Fields for Sign Up */}
          {currentStep === 'signUp' && (
            <div className="flex gap-3 mb-4">
              <label className="flex flex-col flex-1">
                <input
                  type="text"
                  placeholder="First Name"
                  className="form-input flex w-full resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#223949] focus:border-none h-12 placeholder:text-[#90b2cb] px-4 text-sm font-normal leading-normal"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col flex-1">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="form-input flex w-full resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#223949] focus:border-none h-12 placeholder:text-[#90b2cb] px-4 text-sm font-normal leading-normal"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </label>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label className="flex flex-col">
              <input
                type="email"
                placeholder="Email"
                className="form-input flex w-full resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#223949] focus:border-none h-12 placeholder:text-[#90b2cb] px-4 text-sm font-normal leading-normal"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </label>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="flex flex-col relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="form-input flex w-full resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#223949] focus:border-none h-12 placeholder:text-[#90b2cb] px-4 pr-12 text-sm font-normal leading-normal"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#90b2cb] hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>
          </div>

          {/* Confirm Password Field for Sign Up */}
          {currentStep === 'signUp' && (
            <div className="mb-4">
              <label className="flex flex-col relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  className="form-input flex w-full resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#223949] focus:border-none h-12 placeholder:text-[#90b2cb] px-4 pr-12 text-sm font-normal leading-normal"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#90b2cb] hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <div className="mb-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#0c92f2] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0b7fd1] transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {currentStep === 'signIn' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <span className="truncate">
                  {currentStep === 'signIn' ? 'Login' : 'Create Account'}
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center px-6 py-4">
          <div className="flex-1 h-px bg-[#223949]"></div>
          <span className="px-3 text-[#90b2cb] text-sm">or</span>
          <div className="flex-1 h-px bg-[#223949]"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="px-6 mb-6 space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#223949] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#2a4155] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
          

        </div>

        {/* Terms and Toggle */}
        <div className="px-6 pb-6">
          <p className="text-[#90b2cb] text-xs font-normal leading-normal text-center mb-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
          <button
            onClick={() => setCurrentStep(currentStep === 'signIn' ? 'signUp' : 'signIn')}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent text-[#90b2cb] text-sm font-medium leading-normal tracking-[0.015em] hover:bg-[#223949]/30 hover:text-white transition-colors"
          >
            <span className="truncate">
              {currentStep === 'signIn' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  );
} 