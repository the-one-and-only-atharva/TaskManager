import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

function createStubClient() {
  const subscription = { unsubscribe: () => {} };
  const notConfiguredError = new Error('Supabase not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  return {
    auth: {
      async getSession() {
        return { data: { session: null }, error: null };
      },
      onAuthStateChange(_cb) {
        return { data: { subscription } };
      },
      async signInWithOtp() {
        return { data: null, error: notConfiguredError };
      },
      async signOut() {
        return { error: null };
      },
      async exchangeCodeForSession() {
        return { data: null, error: null };
      },
    },
  };
}

let supabase;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // eslint-disable-next-line no-console
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Running with auth disabled.');
  supabase = createStubClient();
}

export { supabase };


