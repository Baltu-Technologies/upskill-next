import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MessagesProvider } from './contexts/MessagesContext';
import { Toaster } from 'sonner';
// import { StagewiseToolbar } from '@stagewise/toolbar-next';
// import ClientOnly from './components/ClientOnly';

const inter = Inter({ subsets: ["latin"] });

// const stagewiseConfig = {
//   plugins: []
// };

export const metadata: Metadata = {
  title: "Upskill Next",
  description: "AI Powered Career Planning and Upskilling Platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Enable minimal UI mode on mobile browsers
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <MessagesProvider>
              {children}
              <Toaster 
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </MessagesProvider>
          </AuthProvider>
        </ThemeProvider>
        {/* {process.env.NODE_ENV === 'development' && (
          <ClientOnly>
            <StagewiseToolbar config={stagewiseConfig} />
          </ClientOnly>
        )} */}
      </body>
    </html>
  );
}
