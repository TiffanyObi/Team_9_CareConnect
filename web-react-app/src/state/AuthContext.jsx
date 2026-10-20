import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createAccount,
  requestPasswordReset,
  restoreSession,
  signIn,
  signOut,
  updateAccount,
} from '../services/authRepository';

const AuthContext = createContext(null);

function applyPreferences(preferences = {}) {
  const root = document.documentElement;
  root.dataset.textScale = preferences.textScale || '100';
  root.dataset.highContrast = String(Boolean(preferences.highContrast));
  root.dataset.reducedMotion = String(Boolean(preferences.reducedMotion));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    restoreSession()
      .then((sessionUser) => {
        if (!active) return;
        setUser(sessionUser);
        applyPreferences(sessionUser?.preferences);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(credentials) {
      const nextUser = await signIn(credentials);
      setUser(nextUser);
      applyPreferences(nextUser.preferences);
      return nextUser;
    },
    async signup(account) {
      const nextUser = await createAccount(account);
      setUser(nextUser);
      applyPreferences(nextUser.preferences);
      return nextUser;
    },
    logout() {
      signOut();
      setUser(null);
      applyPreferences();
    },
    updateProfile(changes) {
      const nextUser = updateAccount(user.id, changes);
      setUser(nextUser);
      applyPreferences(nextUser.preferences);
      return nextUser;
    },
    completeOnboarding(preferences) {
      const nextUser = updateAccount(user.id, { preferences, onboardingComplete: true });
      setUser(nextUser);
      applyPreferences(nextUser.preferences);
      return nextUser;
    },
    requestPasswordReset,
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
