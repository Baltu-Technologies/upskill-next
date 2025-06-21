import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";

// Get the correct base URL for the environment
const getBaseURL = () => {
    console.log('Environment variables check:', {
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        AWS_BRANCH: process.env.AWS_BRANCH,
        AWS_APP_ID: process.env.AWS_APP_ID,
        NODE_ENV: process.env.NODE_ENV
    });
    
    // In production, use BETTER_AUTH_URL or construct from Amplify
    if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
    if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
    
    // For Amplify, check if we're in production
    if (process.env.AWS_BRANCH && process.env.AWS_APP_ID) {
        return `https://${process.env.AWS_BRANCH}.${process.env.AWS_APP_ID}.amplifyapp.com`;
    }
    
    return "http://localhost:3000";
};

console.log('Google OAuth configuration check:', {
    clientId: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
    baseURL: getBaseURL(),
    redirectURI: process.env.NODE_ENV === 'production' 
        ? "https://main.d2q5p14flkja4s.amplifyapp.com/api/auth/callback/google"
        : "http://localhost:3000/api/auth/callback/google",
});

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
    baseURL: getBaseURL(),
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "https://main.d2q5p14flkja4s.amplifyapp.com",
        "https://4flkja4s.amplifyapp.com"
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
            redirectURI: process.env.NODE_ENV === 'production' 
                ? "https://main.d2q5p14flkja4s.amplifyapp.com/api/auth/callback/google"
                : "http://localhost:3000/api/auth/callback/google",
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
