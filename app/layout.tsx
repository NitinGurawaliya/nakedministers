import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ScrollRestorationManager } from '@/components/ScrollRestorationManager';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Naked Ministers — Track Indian MPs' declared wealth growth",
  description:
    "A civic transparency tool tracking declared wealth growth of Indian MPs from public election affidavits. Every rupee they declared. Every year they grew richer.",
  openGraph: {
    title: "Naked Ministers — Track Indian MPs' declared wealth growth",
    description:
      'A civic transparency tool tracking declared wealth growth of Indian MPs from public election affidavits.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <ScrollRestorationManager />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
