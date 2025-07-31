import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Use different auth config based on environment
const isDevMode = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_MODE === 'true';

export const authClient = createAuthClient({
    baseURL: (typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000") + "/api/auth",
    plugins: isDevMode ? [] : [inferAdditionalFields()],
    // Add timeout for development
    fetchOptions: isDevMode ? {
        signal: AbortSignal.timeout(3000) // 3 second timeout in dev mode
    } : undefined
});
