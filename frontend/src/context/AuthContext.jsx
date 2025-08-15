import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../lib/supabaseClient.js";

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signInWithMagicLink: async (_email) => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      // Handle OAuth/Magic Link callback code in URL
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const errorDescription = url.searchParams.get("error_description");
        if (errorDescription) {
          // eslint-disable-next-line no-console
          console.warn("Auth callback error:", errorDescription);
        }
        if (code) {
          await supabase.auth.exchangeCodeForSession({ code });
          // Clean the URL
          url.searchParams.delete("code");
          url.searchParams.delete("type");
          url.searchParams.delete("error");
          url.searchParams.delete("error_description");
          window.history.replaceState(
            {},
            document.title,
            url.pathname + (url.search ? `?${url.searchParams.toString()}` : "")
          );
        }
      } catch {}

      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const signInWithMagicLink = useCallback(async (email) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ user, session, loading, signInWithMagicLink, signOut }),
    [user, session, loading, signInWithMagicLink, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
