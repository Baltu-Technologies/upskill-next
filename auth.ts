import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.BETTER_AUTH_DATABASE_URL,
        ssl: process.env.BETTER_AUTH_DATABASE_URL?.includes('rds.amazonaws.com') 
            ? { rejectUnauthorized: false } 
            : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    }),
    secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET, // Fallback for compatibility
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "https://main.d2q5p14flkja4s.amplifyapp.com"
    ],
    appName: "upskill-next",
    plugins: [nextCookies()],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true if you want email verification
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5 // 5 minutes
        }
    },
    user: {
        additionalFields: {
            firstName: {
                type: "string",
                required: false,
            },
            lastName: {
                type: "string", 
                required: false,
            },
        }
    },
    advanced: {
        generateId: () => crypto.randomUUID(), // Enable ID generation
        crossSubDomainCookies: {
            enabled: false,
        },
    }
});
