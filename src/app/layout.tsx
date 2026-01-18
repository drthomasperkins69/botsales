import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'BotSales - Australia\'s #1 Robot Marketplace',
  description: 'Buy and sell consumer robots in Australia. From robot vacuums to drones, find your perfect robotic companion on BotSales.',
  keywords: 'robots, robot marketplace, buy robots, sell robots, robot vacuum, drones, educational robots, Australia',
  openGraph: {
    title: 'BotSales - Australia\'s #1 Robot Marketplace',
    description: 'Buy and sell consumer robots in Australia. From robot vacuums to drones, find your perfect robotic companion.',
    type: 'website',
    locale: 'en_AU',
    siteName: 'BotSales',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
