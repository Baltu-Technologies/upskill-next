import { Pool } from "pg";
import { betterAuth } from "better-auth";

// Create a minimal database pool
const dbPool = new Pool({
    connectionString: process.env.BETTER_AUTH_DATABASE_URL,
    ssl: false
});

export const auth = betterAuth({
    database: dbPool,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: "http://localhost:3000",
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24 // 1 day
    }
}); 