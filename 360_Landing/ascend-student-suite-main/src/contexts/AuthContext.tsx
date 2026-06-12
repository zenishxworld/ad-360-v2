import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import { preferenceStore } from "@/store/preferences";
import { applicationStore } from "@/store/applications";
import { savedItemsStore } from "@/store/savedItems";

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

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: any) => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    Promise.all([
      preferenceStore.init(mockUser.uuid),
      applicationStore.init(mockUser.id),
      savedItemsStore.init(mockUser.id)
    ]).finally(() => {
      setIsInitializing(false);
    });
  }, []);

  const value = useMemo(
    () => ({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: async () => {},
      signUp: async () => {},
      logout: async () => {},
      resetPassword: async () => {},
      clearError: () => {},
      loginWithGoogle: async () => {},
      updateUserProfile: async (data: any) => ({ ...mockUser, ...data }),
      setPassword: async () => ({ success: true }),
      selectedCountry: "DE",
      isCountryToggleDisabled: false,
      setSelectedCountry: () => {},
    }),
    []
  );

  if (isInitializing) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse">Loading workspace...</div></div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
