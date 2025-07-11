/**
 * Shared Authentication Types
 * 
 * Common types used across both BetterAuth and Auth0 systems
 */

// Shared Authentication Provider Types
export type AuthProvider = 'betterauth' | 'auth0';

export type AuthenticationStatus = 
  | 'authenticated' 
  | 'unauthenticated' 
  | 'loading' 
  | 'error';

// Universal User Types
export interface BaseUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  provider: AuthProvider;
  createdAt?: string;
  updatedAt?: string;
}

// Universal Session Types
export interface BaseSession {
  user: BaseUser;
  expires?: string;
  provider: AuthProvider;
}

// Route Protection Types
export interface RouteAccessConfig {
  pattern: string;
  provider: AuthProvider;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallbackUrl?: string;
}

export interface AuthRouteRule {
  path: string;
  provider: AuthProvider;
  public?: boolean;
  requiresAuth?: boolean;
  roles?: string[];
  permissions?: string[];
  redirectTo?: string;
}

// Cross-Authentication Prevention
export interface AuthConflictRule {
  sourceProvider: AuthProvider;
  targetPattern: string;
  action: 'redirect' | 'block' | 'allow';
  redirectUrl?: string;
  message?: string;
}

// Universal Error Types
export interface AuthError {
  code: string;
  message: string;
  provider: AuthProvider;
  statusCode?: number;
  cause?: string;
}

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider: AuthProvider,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(
    message: string,
    public required: string[],
    public current: string[],
    public provider: AuthProvider
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class CrossAuthError extends Error {
  constructor(
    message: string,
    public sourceProvider: AuthProvider,
    public targetProvider: AuthProvider,
    public attemptedPath: string
  ) {
    super(message);
    this.name = 'CrossAuthError';
  }
}

// Middleware Integration Types
export interface AuthMiddlewareConfig {
  betterauth: {
    enabled: boolean;
    patterns: string[];
    sessionEndpoint: string;
    loginUrl: string;
    logoutUrl: string;
  };
  auth0: {
    enabled: boolean;
    patterns: string[];
    domain: string;
    clientId: string;
    loginUrl: string;
    logoutUrl: string;
    callbackUrl: string;
  };
  crossAuth: {
    preventConflicts: boolean;
    rules: AuthConflictRule[];
  };
  publicRoutes: string[];
  protectedRoutes: AuthRouteRule[];
}

export interface AuthMiddlewareContext {
  provider: AuthProvider | null;
  isAuthenticated: boolean;
  user: BaseUser | null;
  roles: string[];
  permissions: string[];
  route: {
    path: string;
    isPublic: boolean;
    requiredProvider?: AuthProvider;
  };
}

// Navigation and UI Types
export interface AuthAwareNavigation {
  provider: AuthProvider;
  user: BaseUser;
  navigation: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  requiredRoles?: string[];
  requiredPermissions?: string[];
  provider?: AuthProvider;
  external?: boolean;
}

// Hook Integration Types
export interface UseAuthReturn {
  user: BaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  provider: AuthProvider | null;
  error: AuthError | null;
  login: (provider?: AuthProvider) => void | Promise<void>;
  logout: () => void | Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

export interface UseProviderAuthReturn<T extends BaseUser = BaseUser> {
  user: T | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
  session: BaseSession | null;
  refreshSession: () => Promise<void>;
  clearSession: () => Promise<void>;
}

// Component Protection Types
export interface AuthGuardProps {
  provider?: AuthProvider;
  roles?: string[];
  permissions?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
  children: React.ReactNode;
}

export interface ProviderGuardProps {
  requiredProvider: AuthProvider;
  fallback?: React.ReactNode;
  redirectTo?: string;
  children: React.ReactNode;
}

// Configuration and Setup Types
export interface DualAuthConfig {
  providers: {
    betterauth: {
      enabled: boolean;
      baseUrl: string;
      sessionCookie: string;
      routes: {
        signIn: string;
        signUp: string;
        signOut: string;
        session: string;
      };
    };
    auth0: {
      enabled: boolean;
      domain: string;
      clientId: string;
      audience?: string;
      scope: string;
      routes: {
        login: string;
        logout: string;
        callback: string;
      };
    };
  };
  routing: {
    defaultProvider: AuthProvider;
    crossAuthPrevention: boolean;
    publicPaths: string[];
    providerPaths: Record<AuthProvider, string[]>;
  };
  security: {
    sessionTimeout: number;
    refreshThreshold: number;
    maxConcurrentSessions: number;
    enforceProviderIsolation: boolean;
  };
}

// API Integration Types
export interface AuthApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  provider: AuthProvider;
  requiresAuth: boolean;
  roles?: string[];
  permissions?: string[];
}

export interface AuthApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AuthError;
  provider: AuthProvider;
  timestamp: string;
}

// Event and Logging Types
export interface AuthEvent {
  type: 'login' | 'logout' | 'session_refresh' | 'role_change' | 'error' | 'cross_auth_attempt';
  provider: AuthProvider;
  userId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  error?: AuthError;
}

export interface AuthAuditLog {
  id: string;
  event: AuthEvent;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
}

// Testing and Development Types
export interface MockAuthUser extends BaseUser {
  roles: string[];
  permissions: string[];
  metadata?: Record<string, any>;
}

export interface AuthTestConfig {
  provider: AuthProvider;
  mockUsers: MockAuthUser[];
  scenarios: {
    authenticated: boolean;
    crossAuthAttempt: boolean;
    insufficientPermissions: boolean;
    sessionExpired: boolean;
  };
}

// Utility Types
export type AuthProviderConfig<T extends AuthProvider> = 
  T extends 'betterauth' ? DualAuthConfig['providers']['betterauth'] :
  T extends 'auth0' ? DualAuthConfig['providers']['auth0'] :
  never;

export type ProviderUser<T extends AuthProvider> = 
  T extends 'betterauth' ? BaseUser & { role: string } :
  T extends 'auth0' ? BaseUser & { organization?: string; roles: string[] } :
  BaseUser;

export type AuthAction = 
  | { type: 'LOGIN_START'; provider: AuthProvider }
  | { type: 'LOGIN_SUCCESS'; user: BaseUser; provider: AuthProvider }
  | { type: 'LOGIN_ERROR'; error: AuthError; provider: AuthProvider }
  | { type: 'LOGOUT'; provider: AuthProvider }
  | { type: 'SESSION_REFRESH'; provider: AuthProvider }
  | { type: 'CROSS_AUTH_BLOCKED'; sourceProvider: AuthProvider; targetProvider: AuthProvider };

// Constants
export const AUTH_PROVIDERS = ['betterauth', 'auth0'] as const;

export const DEFAULT_AUTH_ROUTES = {
  betterauth: {
    base: '/api/auth',
    session: '/api/auth/session',
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    signOut: '/auth/signout',
  },
  auth0: {
    base: '/api/auth/auth0',
    login: '/api/auth/auth0/login',
    logout: '/api/auth/auth0/logout',
    callback: '/api/auth/auth0/callback',
    profile: '/employer-access/profile',
  },
} as const;

export const DEFAULT_PROVIDER_PATTERNS = {
  betterauth: ['/dashboard/*', '/admin/*', '/profile/*', '/settings/*'],
  auth0: ['/employer-access/*'],
} as const;

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  CROSS_AUTH_CONFLICT: 'CROSS_AUTH_CONFLICT',
  PROVIDER_ERROR: 'PROVIDER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ORGANIZATION_REQUIRED: 'ORGANIZATION_REQUIRED',
} as const; 