// src/app/layout.tsx
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/theme-provider';
import { AuthProvider } from '../lib/context/AuthContext';
import { AuthRedirectHandler } from '../lib/components/AuthRedirect';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ViaTools - Advanced Tools for Logistics',
  description: 'A comprehensive suite of tools for logistics and supply chain optimization',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AuthRedirectHandler />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}