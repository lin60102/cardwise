import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { api, DEMO_TOKEN, type AppleSignInPayload, type AuthUser } from "../services/api";
import { setApiAuthToken } from "../services/authTokenState";
import { ensureLocalCardCacheSeeded } from "../services/localCardCache";
import { configureRevenueCat } from "../services/revenueCat";
import { storage, storageKeys } from "../services/storage";

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  hasOnboarded: boolean;
  isBooting: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  loginWithApple: (payload: AppleSignInPayload) => Promise<void>;
  continueAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        await ensureLocalCardCacheSeeded();

        const [storedToken, storedUser, storedOnboarded] = await Promise.all([
          storage.getItem(storageKeys.authToken),
          storage.getItem(storageKeys.authUser),
          storage.getItem(storageKeys.hasOnboarded)
        ]);

        setApiAuthToken(storedToken);
        setToken(storedToken);
        setUser(storedUser ? (JSON.parse(storedUser) as AuthUser) : null);
        setHasOnboarded(storedOnboarded === "true");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser) as AuthUser;
          await configureRevenueCat(parsedUser.id);
        }
      } catch (error) {
        console.warn("Unable to restore CardWise session.", error);
      } finally {
        setIsBooting(false);
      }
    }

    void bootstrap();
  }, []);

  async function persistSession(nextToken: string, nextUser: AuthUser) {
    setApiAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
    await Promise.all([
      storage.setItem(storageKeys.authToken, nextToken),
      storage.setItem(storageKeys.authUser, JSON.stringify(nextUser)),
      configureRevenueCat(nextUser.id)
    ]);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      hasOnboarded,
      isBooting,
      login: async (email, password) => {
        const response = await api.login({ email, password });
        await persistSession(response.token, response.user);
      },
      register: async (email, password, name) => {
        const response = await api.register({ email, password, name });
        await persistSession(response.token, response.user);
      },
      loginWithApple: async (payload) => {
        const response = await api.signInWithApple(payload);
        await persistSession(response.token, response.user);
      },
      continueAsDemo: async () => {
        await persistSession(DEMO_TOKEN, {
          id: "demo-user",
          email: "demo@cardwise.local",
          name: "Demo User",
          plan: "FREE"
        });
      },
      logout: async () => {
        setApiAuthToken(null);
        setToken(null);
        setUser(null);
        await Promise.all([storage.removeItem(storageKeys.authToken), storage.removeItem(storageKeys.authUser)]);
      },
      completeOnboarding: async () => {
        setHasOnboarded(true);
        await storage.setItem(storageKeys.hasOnboarded, "true");
      },
      refreshSubscription: async () => {
        if (!token || !user) {
          return;
        }

        const status = await api.getSubscriptionStatus();
        const nextUser = { ...user, plan: status.plan };
        setUser(nextUser);
        await storage.setItem(storageKeys.authUser, JSON.stringify(nextUser));
      }
    }),
    [hasOnboarded, isBooting, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
