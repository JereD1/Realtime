'use client';
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { AuthError } from '@supabase/supabase-js';
import { Mail } from 'lucide-react';
import type { AuthComponentProps, Database } from './auth';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MagicLinkAuth({ onSuccess, onError, loading, setLoading }: AuthComponentProps) {
  const [email, setEmail] = useState('');

  const handleMagicLink = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email) {
      onError('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      onError('');

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      onSuccess('Check your email for the magic link!');
    } catch (error) {
      const authError = error as AuthError;
      onError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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

      <button
        onClick={handleMagicLink}
        disabled={loading}
        className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </div>
  );
}
