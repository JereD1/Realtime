'use client'
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { AuthError } from '@supabase/supabase-js';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import type { AuthComponentProps, Database } from './auth';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface EmailPasswordAuthProps extends AuthComponentProps {
  isLogin: boolean;
  onToggleMode: () => void;
}

export default function EmailPasswordAuth({ 
  onSuccess, 
  onError, 
  loading, 
  setLoading,
  isLogin,
  onToggleMode 
}: EmailPasswordAuthProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleEmailAuth = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    
    if (!email || !password) {
      onError('Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      onError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      onError('');

      if (isLogin) {
        // Sign in with email & password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        onSuccess('Successfully signed in!');
      } else {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        
        if (error) throw error;

        if (data.user) {
          // Role is automatically added via SQL trigger in app_metadata
          onSuccess('Account created! Check your email for verification link.');
        } else {
          onSuccess('Check your email for verification link!');
        }
      }
    } catch (error) {
      const authError = error as AuthError;
      onError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (): void => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleToggleMode = (): void => {
    onToggleMode();
    resetForm();
    onError('');
  };

  return (
    <div>
      {/* Email */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
            placeholder="Enter your email"
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
            placeholder="Enter your password"
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Confirm Password (only for sign-up) */}
      {!isLogin && (
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </div>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleEmailAuth}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
      </button>

      {/* Toggle mode */}
      <div className="text-center">
        <p className="text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={handleToggleMode}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
