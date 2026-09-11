import { createContext, useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getActiveOrgId, setActiveOrgId as persistActiveOrgId } from "../lib/apiClient";
import { createOrganization, getMyProfile, listMyOrganizations, touchSession } from "../lib/endpoints";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // undefined = not checked yet, null = checked and signed out.
  const [session, setSession] = useState(undefined);
  const [user, setUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [activeOrgId, setActiveOrgIdState] = useState(() => getActiveOrgId());
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);

  const switchOrganization = useCallback((orgId) => {
    persistActiveOrgId(orgId);
    setActiveOrgIdState(orgId);
  }, []);

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const [profile, orgs] = await Promise.all([getMyProfile(), listMyOrganizations()]);
      setUser(profile);
      setOrganizations(orgs);
      setActiveOrgIdState((current) => {
        const stillValid = orgs.some((o) => o.id === current);
        const next = stillValid ? current : (orgs[0]?.id ?? null);
        persistActiveOrgId(next);
        return next;
      });
      setError(null);
    } catch (err) {
      setError(err);
      setUser(null);
      setOrganizations([]);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session) {
        await touchSession().catch(() => {});
        await loadProfile();
      } else {
        setProfileLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (event === "SIGNED_IN") {
        touchSession().catch(() => {});
        loadProfile();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setOrganizations([]);
        switchOrganization(null);
        setProfileLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadProfile]);

  const signUp = useCallback(
    async ({ email, password, organizationName, organizationSlug }) => {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;

      if (!data.session) {
        // This Supabase project requires email confirmation before a session is
        // issued — org creation happens after the user confirms and logs in.
        return { needsEmailConfirmation: true };
      }

      await touchSession().catch(() => {});
      const org = await createOrganization({ name: organizationName, slug: organizationSlug });
      switchOrganization(org.id);
      await loadProfile();
      return { needsEmailConfirmation: false };
    },
    [loadProfile, switchOrganization]
  );

  const signIn = useCallback(async ({ email, password }) => {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = {
    session,
    user,
    organizations,
    activeOrgId,
    switchOrganization,
    isAuthenticated: !!session,
    loading: session === undefined || (!!session && profileLoading),
    error,
    signUp,
    signIn,
    signOut,
    refreshProfile: loadProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
