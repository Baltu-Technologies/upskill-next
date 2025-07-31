// Use different auth config based on environment
const isDevMode = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_MODE === 'true';

// Dynamic import based on environment
const getAuth = async () => {
  if (isDevMode) {
    const { auth } = await import("../../../../auth-no-db");
    return auth;
  } else {
    const { auth } = await import("../../../../auth");
    return auth;
  }
};

import { toNextJsHandler } from "better-auth/next-js";

// Create handlers with error handling
export async function GET(request: Request) {
  try {
    const auth = await getAuth();
    const handler = toNextJsHandler(auth.handler);
    return handler.GET(request);
  } catch (error) {
    console.error('Auth GET error:', error);
    return new Response(JSON.stringify({ error: 'Auth service unavailable' }), { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuth();
    const handler = toNextJsHandler(auth.handler);
    return handler.POST(request);
  } catch (error) {
    console.error('Auth POST error:', error);
    return new Response(JSON.stringify({ error: 'Auth service unavailable' }), { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 