'use client';
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GoogleAuth from './GoogleAuth';
import EmailPasswordAuth from './EmailPassword';
import MagicLinkAuth from './MagicLinkAuth';

export default function AuthPage() {
  const router = useRouter(); // ✅ Router for redirect
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [authMode, setAuthMode] = useState<'email' | 'magic'>('email');

  const handleSuccess = (msg: string) => {
    setMessage(msg);
    setError('');
    
    // Redirect after successful login or signup
    setTimeout(() => {
      router.push('/'); // Redirect to home page
    }, 1000); // slight delay so user sees success message
  };

  const handleError = (err: string) => {
    setError(err);
    setMessage('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Sign up for a new account'}
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Google OAuth */}
        <GoogleAuth
          onSuccess={handleSuccess}
          onError={handleError}
          loading={loading}
          setLoading={setLoading}
        />

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Switch between Email/Password & Magic Link */}
        {authMode === 'email' ? (
          <EmailPasswordAuth
            onSuccess={handleSuccess}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
            isLogin={isLogin}
            onToggleMode={toggleMode}
          />
        ) : (
          <MagicLinkAuth
            onSuccess={handleSuccess}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
          />
        )}

        <div className="text-center mt-4">
          <button
            onClick={() => setAuthMode(authMode === 'email' ? 'magic' : 'email')}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {authMode === 'email'
              ? 'Use Magic Link instead'
              : 'Use Email + Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
