import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { ApiError, api, DEMO_TOKEN, type AppleSignInPayload, type AuthRequestOptions, type AuthUser } from "../services/api";
import { refreshApiAuthToken, setApiAuthToken } from "../services/authTokenState";
import { ensureLocalCardCacheSeeded } from "../services/localCardCache";
import { configureRevenueCat } from "../services/revenueCat";
import { isScreenshotMode, screenshotUser } from "../services/screenshotMode";
import { storage, storageKeys } from "../services/storage";

/** True for any error that signals the stored token is no longer valid. */
function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  hasOnboarded: boolean;
  isBooting: boolean;
  login: (email: string, password: string, options?: AuthRequestOptions) => Promise<void>;
  register: (email: string, password: string, name?: string, options?: AuthRequestOptions) => Promise<void>;
  loginWithApple: (payload: AppleSignInPayload) => Promise<void>;
  continueAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  redeemPromoCode: (code: string) => Promise<void>;
  syncRevenueCatSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(isScreenshotMode ? DEMO_TOKEN : null);
  const [user, setUser] = useState<AuthUser | null>(isScreenshotMode ? screenshotUser : null);
  const [hasOnboarded, setHasOnboarded] = useState(isScreenshotMode);
  const [isBooting, setIsBooting] = useState(!isScreenshotMode);

  useEffect(() => {
    let cancelled = false;

    /**
     * Wipes every persisted scrap of the session. Used when:
     *   - The keychain token survived an iOS uninstall but the cached user JSON did not.
     *   - The API responds 401 to our validation probe (token expired/invalidated server-side).
     * After this runs the React state is null and `RootNavigator` routes to LoginRegister.
     */
    async function clearStoredSession() {
      setApiAuthToken(null);
      setToken(null);
      setUser(null);
      await Promise.all([
        storage.removeItem(storageKeys.authToken),
        storage.removeItem(storageKeys.authUser)
      ]);
    }

    async function bootstrap() {
      try {
        if (isScreenshotMode) {
          setApiAuthToken(DEMO_TOKEN);
          setToken(DEMO_TOKEN);
          setUser(screenshotUser);
          setHasOnboarded(true);
          return;
        }

        await ensureLocalCardCacheSeeded();

        const [storedToken, storedUserRaw, storedOnboarded] = await Promise.all([
          refreshApiAuthToken(() => storage.getItem(storageKeys.authToken)),
          storage.getItem(storageKeys.authUser),
          storage.getItem(storageKeys.hasOnboarded)
        ]);

        if (cancelled) return;

        setHasOnboarded(storedOnboarded === "true");

        let storedUser: AuthUser | null = null;
        if (storedUserRaw) {
          try {
            storedUser = JSON.parse(storedUserRaw) as AuthUser;
          } catch (parseError) {
            console.warn("Stored CardWise user data is invalid; clearing session.", parseError);
            await clearStoredSession();
            return;
          }
        }

        // Case A: no token at all → unauthenticated, nothing to validate.
        if (!storedToken) {
          return;
        }

        // Case B: demo token → never hits the backend; trust local user data.
        // If the user JSON is missing the demo session is corrupt, treat as logged out.
        if (storedToken === DEMO_TOKEN) {
          if (storedUser) {
            setToken(storedToken);
            setUser(storedUser);
            await configureRevenueCat(storedUser.id);
          } else {
            await clearStoredSession();
          }
          return;
        }

        // Case C: orphaned token. iOS keychain (SecureStore) persists across app
        // uninstalls but AsyncStorage (where the user JSON lives) does not. After a
        // reinstall the token can survive without its companion user — treat as stale.
        if (!storedUser) {
          await clearStoredSession();
          return;
        }

        // Case D: token + cached user. Validate against the server before declaring
        // the user authenticated. Reuse the existing subscription endpoint because it
        // already returns the canonical plan and requires a valid Bearer token.
        try {
          const status = await api.getSubscriptionStatus();
          if (cancelled) return;

          const validatedUser: AuthUser = { ...storedUser, plan: status.plan };
          setToken(storedToken);
          setUser(validatedUser);
          await storage.setItem(storageKeys.authUser, JSON.stringify(validatedUser));
          await configureRevenueCat(validatedUser.id);
        } catch (validationError) {
          if (cancelled) return;

          if (isUnauthorizedError(validationError)) {
            // Server rejected the token — purge it and start at login.
            await clearStoredSession();
            return;
          }

          // Network failure or timeout. Keep the cached session so the app still
          // opens offline; routes that need the API will surface their own errors.
          setToken(storedToken);
          setUser(storedUser);
          await configureRevenueCat(storedUser.id);
        }
      } catch (error) {
        console.warn("Unable to restore CardWise session.", error);
        if (!cancelled) {
          setApiAuthToken(null);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsBooting(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
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
      login: async (email, password, options) => {
        const response = await api.login({ email, password }, options);
        await persistSession(response.token, response.user);
      },
      register: async (email, password, name, options) => {
        const response = await api.register({ email, password, name }, options);
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
        try {
          await Promise.all([storage.removeItem(storageKeys.authToken), storage.removeItem(storageKeys.authUser)]);
        } catch (logoutError) {
          console.warn("Unable to fully clear persisted CardWise session.", logoutError);
        }
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
      },
      redeemPromoCode: async (code) => {
        if (!token || !user) {
          return;
        }

        const status = await api.redeemPromoCode(code);
        const nextUser = { ...user, plan: status.plan };
        setUser(nextUser);
        await storage.setItem(storageKeys.authUser, JSON.stringify(nextUser));
      },
      syncRevenueCatSubscription: async () => {
        if (!token || !user) {
          return;
        }

        const status = await api.syncRevenueCatSubscription();
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
