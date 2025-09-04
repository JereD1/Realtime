'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Listen for auth state changes (recommended approach)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('User authenticated:', session.user.email);
        router.push('/');
      } else if (event === 'SIGNED_OUT') {
        console.error('Sign in error');
        router.push('/login?error=auth_failed');
      }
    });

    // Also check current session immediately
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('OAuth error:', error.message);
          router.push('/login?error=auth_failed');
          return;
        }

        if (session) {
          console.log('User authenticated:', session.user.email);
          router.push('/');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        router.push('/login?error=unexpected');
      }
    };

    checkSession();

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-700">Authenticating...</p>
      </div>
    </div>
  );
}