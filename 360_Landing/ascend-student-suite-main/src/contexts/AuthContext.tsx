import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import { preferenceStore } from "@/store/preferences";
import { applicationStore } from "@/store/applications";
import { savedItemsStore } from "@/store/savedItems";
import { documentStore } from "@/store/documents";
import { authService } from "@/lib/supabase/services/AuthService";
import { StudentProfileRepository } from "@/lib/supabase/repositories/StudentProfileRepository";
import { DEMO_MODE } from "@/config/demoMode";

const profileRepo = new StudentProfileRepository();

const mockUser = {
  id: 1,
  uuid: "ST2025-000001",
  email: "john.doe@example.com",
  name: "John Doe",
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  username: "john.doe",
  isVerified: true,
  emailVerified: true,
  phoneVerified: true,
  userType: "STUDENT",
  status: "ACTIVE",
  isFirstLogin: false,
  isStudent: true,
  isAdmin: false,
  roles: ["STUDENT"],
  permissions: [],
  authProvider: "LOCAL",
  provider: "LOCAL",
  hasPassword: true,
  targetCountries: ["Germany", "UK"],
};

const AuthContext = createContext<any>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: any) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initStores = async (authUser: any) => {
    // 1. Fetch profile to get numeric ID (handle race condition with trigger)
    let profile = null;
    let attempts = 0;
    while (!profile && attempts < 3) {
      profile = await profileRepo.getProfile(authUser.id);
      if (!profile && !DEMO_MODE) {
        await new Promise((res) => setTimeout(res, 500)); // wait 500ms
        attempts++;
      } else {
        break;
      }
    }

    // 2. Initialize stores
    const numericId = profile?.id || 1;
    await Promise.all([
      preferenceStore.init(authUser.id),
      applicationStore.init(numericId),
      savedItemsStore.init(numericId),
      documentStore.init(numericId)
    ]);

    // 3. Construct user object
    const mappedUser = {
      ...mockUser,
      id: numericId,
      uuid: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Unknown',
      firstName: (authUser.user_metadata?.full_name || 'Unknown').split(' ')[0],
      fullName: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Unknown',
      avatarUrl: authUser.user_metadata?.avatar_url || '',
    };

    setUser(mappedUser);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    let mounted = true;

    const setupSession = async () => {
      try {
        const { data, error } = await authService.getSession();
        if (error) throw error;
        
        if (data.session?.user && mounted) {
          await initStores(data.session.user);
        } else {
          if (mounted) {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error("Session fetch error:", err);
      } finally {
        if (mounted) setIsInitializing(false);
      }
    };

    setupSession();

    const { data: authListener } = authService.onAuthStateChange(async (event, session) => {
      if (session?.user && mounted) {
        await initStores(session.user);
      } else if (!session && mounted) {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      mounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      user: user || (DEMO_MODE ? mockUser : null),
      isAuthenticated: isAuthenticated || DEMO_MODE,
      isLoading: isInitializing,
      error: null,
      login: async () => {},
      signUp: async () => {},
      logout: async () => {
        await authService.signOut();
      },
      resetPassword: async () => {},
      clearError: () => {},
      loginWithGoogle: async () => {
        await authService.signInWithGoogle();
      },
      updateUserProfile: async (data: any) => ({ ...(user || mockUser), ...data }),
      setPassword: async () => ({ success: true }),
      selectedCountry: "DE",
      isCountryToggleDisabled: false,
      setSelectedCountry: () => {},
    }),
    [user, isAuthenticated, isInitializing]
  );

  if (isInitializing) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse">Loading workspace...</div></div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
