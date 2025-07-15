import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth.ts";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: (typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000") + "/api/auth",
    plugins: [inferAdditionalFields<typeof auth>()],
});
