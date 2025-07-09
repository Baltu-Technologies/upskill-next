import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0-client';
import { NextRequest } from 'next/server';
import EmployerLayout from '../components/EmployerLayout';

export default async function EmployerAccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const mockRequest = {
    headers: headersList,
    cookies: {
      get: (name: string) => {
        const cookieStore = require('next/headers').cookies();
        return cookieStore.get(name);
      }
    }
  } as NextRequest;

  // TEMPORARY: Disable Auth0 session check for development
  // const session = await auth0.getSession(mockRequest);
  
  // if (!session) {
  //   redirect('/api/auth0/login?returnTo=/employer-access');
  // }

  return (
    <EmployerLayout>
      {children}
    </EmployerLayout>
  );
} 