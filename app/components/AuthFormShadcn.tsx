'use client';

import { useState } from 'react';
// Temporarily disabled AWS Amplify auth functions
// import { signIn, signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle, Loader2, Sparkles, GraduationCap, Target, Shield } from 'lucide-react';
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
      // const result = await signIn({
      //   username: formData.email,
      //   password: formData.password
      // });
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
      // const result = await signUp({
      //   username: formData.email,
      //   password: formData.password,
      //   options: {
      //     userAttributes: {
      //       email: formData.email,
      //       given_name: formData.firstName.trim(),
      //       family_name: formData.lastName.trim()
      //     }
      //   }
      // });
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
      // const result = await confirmSignUp({
      //   username: pendingEmail,
      //   confirmationCode: formData.confirmationCode.trim()
      // });
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
      // await resendSignUpCode({ username: pendingEmail });
      setSuccess('Confirmation code resent to your email.');
    } catch (error: any) {
      console.error('Resend code error:', error);
      setError(error.message || 'Failed to resend confirmation code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200/95 via-slate-100/95 to-slate-200/95 dark:from-[hsl(222,84%,8%)] dark:via-[hsl(222,84%,6%)] dark:to-[hsl(222,84%,8%)] p-4">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 dark:from-blue-950/10 dark:via-transparent dark:to-purple-950/10" />
      
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <Card className="relative backdrop-blur-xl bg-slate-200/60 dark:bg-[hsl(222,84%,12%)] border border-slate-300/50 dark:border-[hsl(217,33%,17%)]/30 shadow-2xl overflow-hidden">
          {/* Enhanced Card glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-[hsl(217,91%,60%)]/30 to-[hsl(142,71%,45%)]/30 rounded-2xl blur-2xl opacity-75" />
          <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(217,91%,60%)]/20 to-[hsl(142,71%,45%)]/20 rounded-xl blur-lg opacity-90" />
          
          <div className="relative">
            <CardHeader className="text-center bg-gradient-to-r from-slate-300/40 to-slate-200/40 dark:from-[hsl(222,84%,15%)]/40 dark:to-[hsl(222,84%,12%)]/40 backdrop-blur-sm border-b border-slate-300/30 dark:border-[hsl(217,33%,17%)]/30 space-y-6">
              
              {/* Brand Section */}
              <div className="relative bg-gradient-to-r from-slate-200/60 to-slate-100/60 dark:from-[hsl(222,84%,12%)] dark:to-[hsl(222,84%,15%)] rounded-2xl p-6 backdrop-blur-xl border border-slate-300/50 dark:border-[hsl(217,33%,17%)]/30">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(142,71%,45%)] flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(142,71%,45%)] bg-clip-text text-transparent">
                    Upskill
                  </h1>
                </div>
                <p className="text-slate-600 dark:text-[hsl(210,40%,98%)]/70 text-sm">
                  Accelerate Your Learning Journey
                </p>
                
                {/* Feature badges */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200/60 dark:bg-[hsl(222,84%,8%)] backdrop-blur-sm">
                    <Target className="h-3 w-3 text-[hsl(217,91%,60%)]" />
                    <span className="text-xs font-medium text-slate-600 dark:text-[hsl(210,40%,98%)]/80">Career Ready</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200/60 dark:bg-[hsl(222,84%,8%)] backdrop-blur-sm">
                    <Shield className="h-3 w-3 text-[hsl(142,71%,45%)]" />
                    <span className="text-xs font-medium text-slate-600 dark:text-[hsl(210,40%,98%)]/80">Industry Focused</span>
                  </div>
                </div>
              </div>

              {/* Step Header */}
              <div className="flex items-center justify-center gap-2">
                {currentStep === 'signIn' && (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-[hsl(217,91%,60%)]" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-700 dark:text-[hsl(210,40%,98%)]">Welcome Back</CardTitle>
                  </>
                )}
                {currentStep === 'signUp' && (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-[hsl(142,71%,45%)]" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-700 dark:text-[hsl(210,40%,98%)]">Join Upskill</CardTitle>
                  </>
                )}
                {currentStep === 'confirmSignUp' && (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-700 dark:text-[hsl(210,40%,98%)]">Verify Email</CardTitle>
                  </>
                )}
              </div>
              
              <CardDescription className="text-slate-600 dark:text-[hsl(210,40%,98%)]/70">
                {currentStep === 'signIn' && 'Continue your learning journey with industry professionals'}
                {currentStep === 'signUp' && 'Start your path to career advancement today'}
                {currentStep === 'confirmSignUp' && `Check your email and enter the verification code sent to ${pendingEmail}`}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              {/* Error/Success Messages */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50/60 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 rounded-xl text-red-700 dark:text-red-400 text-sm backdrop-blur-sm">
                  <div className="w-5 h-5 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-3 w-3" />
                  </div>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 p-4 bg-green-50/60 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30 rounded-xl text-green-700 dark:text-green-400 text-sm backdrop-blur-sm">
                  <div className="w-5 h-5 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <span>{success}</span>
                </div>
              )}

              {/* Sign In Form */}
              {currentStep === 'signIn' && (
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="signin-email" className="text-sm font-medium text-slate-700 dark:text-[hsl(210,40%,98%)] flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[hsl(217,91%,60%)]" />
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
                      className="h-12 bg-slate-100/80 dark:bg-[hsl(222,84%,8%)] border-slate-300/50 dark:border-[hsl(217,33%,17%)]/50 rounded-xl backdrop-blur-sm focus:border-[hsl(217,91%,60%)] dark:focus:border-[hsl(217,91%,60%)] transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="signin-password" className="text-sm font-medium text-slate-700 dark:text-[hsl(210,40%,98%)] flex items-center gap-2">
                      <Lock className="h-4 w-4 text-[hsl(217,91%,60%)]" />
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
                        className="h-12 bg-slate-100/80 dark:bg-[hsl(222,84%,8%)] border-slate-300/50 dark:border-[hsl(217,33%,17%)]/50 rounded-xl backdrop-blur-sm focus:border-[hsl(217,91%,60%)] dark:focus:border-[hsl(217,91%,60%)] transition-all duration-300 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-slate-200/60 dark:hover:bg-[hsl(222,84%,15%)] text-slate-500 hover:text-[hsl(217,91%,60%)]"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(217,91%,70%)] hover:from-[hsl(217,91%,55%)] hover:to-[hsl(217,91%,65%)] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setCurrentStep('signUp')}
                      className="text-slate-600 dark:text-[hsl(210,40%,98%)]/70 hover:text-[hsl(217,91%,60%)] dark:hover:text-[hsl(217,91%,60%)] transition-colors duration-300"
                    >
                      Don't have an account? <span className="font-medium">Create one</span>
                    </Button>
                  </div>
                </form>
              )}

              {/* Sign Up Form */}
              {currentStep === 'signUp' && (
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="signup-firstname" className="text-sm font-medium text-slate-700 dark:text-[hsl(210,40%,98%)] flex items-center gap-2">
                        <User className="h-4 w-4 text-[hsl(142,71%,45%)]" />
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
                        className="h-12 bg-slate-100/80 dark:bg-[hsl(222,84%,8%)] border-slate-300/50 dark:border-[hsl(217,33%,17%)]/50 rounded-xl backdrop-blur-sm focus:border-[hsl(142,71%,45%)] dark:focus:border-[hsl(142,71%,45%)] transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="signup-lastname" className="text-sm font-medium text-slate-700 dark:text-[hsl(210,40%,98%)]">
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
                        className="h-12 bg-slate-100/80 dark:bg-[hsl(222,84%,8%)] border-slate-300/50 dark:border-[hsl(217,33%,17%)]/50 rounded-xl backdrop-blur-sm focus:border-[hsl(142,71%,45%)] dark:focus:border-[hsl(142,71%,45%)] transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="text-sm font-medium text-slate-700 dark:text-[hsl(210,40%,98%)] flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[hsl(142,71%,45%)]" />
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
                      className="h-12 bg-slate-100/80 dark:bg-[hsl(222,84%,8%)] border-slate-300/50 dark:border-[hsl(217,33%,17%)]/50 rounded-xl backdrop-blur-sm focus:border-[hsl(142,71%,45%)] dark:focus:border-[hsl(142,71%,45%)] transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="text-sm font-medium text-slate-700 dark:text-[hsl(210,40%,98%)] flex items-center gap-2">
                      <Lock className="h-4 w-4 text-[hsl(142,71%,45%)]" />
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
                        className="h-12 bg-slate-100/80 dark:bg-[hsl(222,84%,8%)] border-slate-300/50 dark:border-[hsl(217,33%,17%)]/50 rounded-xl backdrop-blur-sm focus:border-[hsl(142,71%,45%)] dark:focus:border-[hsl(142,71%,45%)] transition-all duration-300 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-slate-200/60 dark:hover:bg-[hsl(222,84%,15%)] text-slate-500 hover:text-[hsl(142,71%,45%)]"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[hsl(210,40%,98%)]/60">Password must be at least 8 characters long</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="signup-confirm-password" className="text-sm font-medium text-slate-700 dark:text-[hsl(210,40%,98%)] flex items-center gap-2">
                      <Lock className="h-4 w-4 text-[hsl(142,71%,45%)]" />
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
                        className="h-12 bg-slate-100/80 dark:bg-[hsl(222,84%,8%)] border-slate-300/50 dark:border-[hsl(217,33%,17%)]/50 rounded-xl backdrop-blur-sm focus:border-[hsl(142,71%,45%)] dark:focus:border-[hsl(142,71%,45%)] transition-all duration-300 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-slate-200/60 dark:hover:bg-[hsl(222,84%,15%)] text-slate-500 hover:text-[hsl(142,71%,45%)]"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-[hsl(142,71%,45%)] to-[hsl(142,71%,55%)] hover:from-[hsl(142,71%,40%)] hover:to-[hsl(142,71%,50%)] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setCurrentStep('signIn')}
                      className="text-slate-600 dark:text-[hsl(210,40%,98%)]/70 hover:text-[hsl(142,71%,45%)] dark:hover:text-[hsl(142,71%,45%)] transition-colors duration-300"
                    >
                      Already have an account? <span className="font-medium">Sign in</span>
                    </Button>
                  </div>
                </form>
              )}

              {/* Confirmation Form */}
              {currentStep === 'confirmSignUp' && (
                <form onSubmit={handleConfirmSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="confirmation-code" className="text-sm font-medium text-slate-700 dark:text-[hsl(210,40%,98%)] flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
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
                      className="h-12 bg-slate-100/80 dark:bg-[hsl(222,84%,8%)] border-slate-300/50 dark:border-[hsl(217,33%,17%)]/50 rounded-xl backdrop-blur-sm focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-300 text-center text-lg tracking-wider font-mono"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        Confirm Email
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="w-full h-12 bg-slate-100/80 dark:bg-[hsl(222,84%,8%)] border-slate-300/50 dark:border-[hsl(217,33%,17%)]/50 hover:bg-slate-200/80 dark:hover:bg-[hsl(222,84%,12%)] text-slate-700 dark:text-[hsl(210,40%,98%)] rounded-xl backdrop-blur-sm transition-all duration-300"
                    >
                      Resend Code
                    </Button>
                    
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setCurrentStep('signIn')}
                      className="w-full text-slate-600 dark:text-[hsl(210,40%,98%)]/70 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
} 