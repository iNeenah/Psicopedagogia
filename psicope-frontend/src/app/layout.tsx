import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from '@/components/providers/AuthProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "PsicoPe - Clínica Digital",
  description: "Sistema integral para clínicas de psicopedagogía y psicología",
  keywords: ['psicología', 'psicopedagogía', 'clínica', 'gestión', 'pacientes'],
  authors: [{ name: 'PsicoPe Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
