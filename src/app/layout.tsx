// src/app/layout.tsx
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/context/AuthContext";
import { AuthRedirectHandler } from "../lib/components/AuthRedirect";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "movomint - Advanced Toolbox for Logistics",
  description:
    "A comprehensive suite of tools for logistics and supply chain optimization",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <AuthRedirectHandler />
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
