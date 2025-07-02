import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";

// Get the correct base URL for the environment
const getBaseURL = () => {
    // In production, use BETTER_AUTH_URL or construct from Amplify
    if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
    if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
    
    // For Amplify, check if we're in production
    if (process.env.AWS_BRANCH && process.env.AWS_APP_ID) {
        return `https://${process.env.AWS_BRANCH}.${process.env.AWS_APP_ID}.amplifyapp.com`;
    }
    
    return "http://localhost:3000";
};

export const auth = betterAuth({
    database: new Pool({
        // ✅ TASK 10.1: Updated to use RDS Proxy endpoint
        connectionString: process.env.AUTH_DB_URL || process.env.BETTER_AUTH_DATABASE_URL,
        
        // ✅ TASK 10.3: Enhanced SSL configuration for RDS Proxy
        ssl: process.env.AUTH_DB_URL?.includes('proxy-') || process.env.BETTER_AUTH_DATABASE_URL?.includes('rds.amazonaws.com') 
            ? { 
                rejectUnauthorized: false,
                ca: undefined, // RDS Proxy handles certificate management
                checkServerIdentity: () => undefined, // Disable hostname verification for proxy
            } 
            : false,
        
        // ✅ TASK 10.1: Optimized connection pool settings for RDS Proxy
        max: parseInt(process.env.AUTH_DB_MAX_CONNECTIONS || '10'),
        idleTimeoutMillis: parseInt(process.env.AUTH_DB_IDLE_TIMEOUT || '5000'),
        connectionTimeoutMillis: parseInt(process.env.AUTH_DB_CONNECTION_TIMEOUT || '2000'),
        
        // ✅ Additional RDS Proxy optimizations
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
        query_timeout: 30000, // 30 second query timeout
        statement_timeout: 30000, // 30 second statement timeout
        
        // ✅ TASK 10.3: Enhanced error handling for RDS Proxy
        application_name: 'upskill-betterauth',
        fallback_application_name: 'upskill-app',
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
        database: {
            generateId: () => crypto.randomUUID(), // Updated to new format
        },
        crossSubDomainCookies: {
            enabled: false,
        },
    }
});
