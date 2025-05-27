'use client';

import { useState } from 'react';
import { signIn, signUp, confirmSignUp, resendSignUpCode, getCurrentUser } from 'aws-amplify/auth';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import styles from './AuthForm.module.css';

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

export default function AuthForm({ onSuccess }: AuthFormProps) {
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
      
      // Immediately call onSuccess to trigger parent component re-render
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

  const renderSignInForm = () => (
    <motion.form 
      onSubmit={handleSignIn}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={styles.form}
    >
      <div className={styles.formHeader}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to continue your learning journey</p>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="signin-email" className={styles.label}>
          <Mail size={16} />
          Email Address
        </label>
        <input
          id="signin-email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={styles.input}
          placeholder="Enter your email"
          autoComplete="email"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="signin-password" className={styles.label}>
          <Lock size={16} />
          Password
        </label>
        <div className={styles.passwordInput}>
          <input
            id="signin-password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={styles.input}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.passwordToggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`${styles.primaryButton} ${isLoading ? styles.loading : ''}`}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className={styles.spinner} />
            Signing In...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <div className={styles.divider}>
        <span>Don't have an account?</span>
      </div>

      <button
        type="button"
        onClick={() => setCurrentStep('signUp')}
        className={styles.secondaryButton}
      >
        Create Account
      </button>
    </motion.form>
  );

  const renderSignUpForm = () => (
    <motion.form 
      onSubmit={handleSignUp}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={styles.form}
    >
      <div className={styles.formHeader}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Join thousands of learners on Upskill</p>
      </div>

      <div className={styles.nameRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="signup-firstname" className={styles.label}>
            <User size={16} />
            First Name
          </label>
          <input
            id="signup-firstname"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={styles.input}
            placeholder="First name"
            autoComplete="given-name"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="signup-lastname" className={styles.label}>
            Last Name
          </label>
          <input
            id="signup-lastname"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={styles.input}
            placeholder="Last name"
            autoComplete="family-name"
            required
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="signup-email" className={styles.label}>
          <Mail size={16} />
          Email Address
        </label>
        <input
          id="signup-email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={styles.input}
          placeholder="Enter your email"
          autoComplete="email"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="signup-password" className={styles.label}>
          <Lock size={16} />
          Password
        </label>
        <div className={styles.passwordInput}>
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={styles.input}
            placeholder="Create a password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.passwordToggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className={styles.hint}>Password must be at least 8 characters long</p>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="signup-confirm-password" className={styles.label}>
          <Lock size={16} />
          Confirm Password
        </label>
        <div className={styles.passwordInput}>
          <input
            id="signup-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={styles.input}
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={styles.passwordToggle}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`${styles.primaryButton} ${isLoading ? styles.loading : ''}`}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className={styles.spinner} />
            Creating Account...
          </>
        ) : (
          <>
            Create Account
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <div className={styles.divider}>
        <span>Already have an account?</span>
      </div>

      <button
        type="button"
        onClick={() => setCurrentStep('signIn')}
        className={styles.secondaryButton}
      >
        Sign In
      </button>
    </motion.form>
  );

  const renderConfirmationForm = () => (
    <motion.form 
      onSubmit={handleConfirmSignUp}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={styles.form}
    >
      <div className={styles.formHeader}>
        <h2 className={styles.title}>Confirm Your Email</h2>
        <p className={styles.subtitle}>
          We sent a confirmation code to <strong>{pendingEmail}</strong>
        </p>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="confirmation-code" className={styles.label}>
          <CheckCircle size={16} />
          Confirmation Code
        </label>
        <input
          id="confirmation-code"
          type="text"
          value={formData.confirmationCode}
          onChange={(e) => handleInputChange('confirmationCode', e.target.value)}
          className={styles.input}
          placeholder="Enter 6-digit code"
          maxLength={6}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`${styles.primaryButton} ${isLoading ? styles.loading : ''}`}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className={styles.spinner} />
            Confirming...
          </>
        ) : (
          <>
            Confirm Email
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <div className={styles.divider}>
        <span>Didn't receive a code?</span>
      </div>

      <button
        type="button"
        onClick={handleResendCode}
        disabled={isLoading}
        className={styles.secondaryButton}
      >
        Resend Code
      </button>

      <button
        type="button"
        onClick={() => setCurrentStep('signIn')}
        className={styles.textButton}
      >
        Back to Sign In
      </button>
    </motion.form>
  );

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 'signIn':
        return renderSignInForm();
      case 'signUp':
        return renderSignUpForm();
      case 'confirmSignUp':
        return renderConfirmationForm();
      default:
        return renderSignInForm();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🚀</span>
            <span className={styles.logoText}>Upskill</span>
          </div>
          <p className={styles.tagline}>Accelerate Your Learning</p>
        </div>

        <AnimatePresence mode="wait">
          {renderCurrentForm()}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.errorMessage}
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.successMessage}
          >
            <CheckCircle size={16} />
            {success}
          </motion.div>
        )}
      </div>
    </div>
  );
} 