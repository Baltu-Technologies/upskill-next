import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
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

// Script to prevent flash of incorrect theme
const themeScript = `
(function() {
  try {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    let actualTheme = 'dark';
    
    if (savedTheme === 'light' || savedTheme === 'dark') {
      actualTheme = savedTheme;
    } else if (savedTheme === 'system') {
      actualTheme = systemTheme;
    }
    
    if (actualTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Set custom colors if they exist
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    const savedAccentColor = localStorage.getItem('accentColor');
    
    if (savedPrimaryColor) {
      document.documentElement.style.setProperty('--primary', savedPrimaryColor);
      const primaryHue = savedPrimaryColor.match(/hsl\\((\\d+),/)?.[1] || '217';
      document.documentElement.style.setProperty('--primary-glow', \`hsl(\${primaryHue}, 91%, 70%)\`);
    }
    
    if (savedAccentColor) {
      document.documentElement.style.setProperty('--accent', savedAccentColor);
      const accentHue = savedAccentColor.match(/hsl\\((\\d+),/)?.[1] || '142';
      document.documentElement.style.setProperty('--accent-glow', \`hsl(\${accentHue}, 100%, 60%)\`);
    }
  } catch (e) {
    console.warn('Theme initialization error:', e);
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
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
