import { NextRequest } from 'next/server';

interface Auth0User {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  'https://employer-portal.upskill.com/roles'?: string[];
  'https://employer-portal.upskill.com/permissions'?: string[];
  'https://employer-portal.upskill.com/organization'?: string;
  'https://employer-portal.upskill.com/organization_name'?: string;
}

interface Auth0Session {
  user: Auth0User;
  idToken: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export class Auth0Client {
  async getSession(request: NextRequest): Promise<Auth0Session | null> {
    try {
      const sessionCookie = request.cookies.get('auth0-session');
      
      if (!sessionCookie?.value) {
        return null;
      }
      
      const sessionData = JSON.parse(sessionCookie.value) as Auth0Session;
      
      // Check if session is expired
      if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
        return null;
      }
      
      return sessionData;
    } catch (error) {
      console.error('Error parsing Auth0 session:', error);
      return null;
    }
  }

  async getUserInfo(accessToken: string): Promise<Auth0User | null> {
    try {
      const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!userResponse.ok) {
        return null;
      }
      
      return await userResponse.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  }
}

export const auth0 = new Auth0Client(); 