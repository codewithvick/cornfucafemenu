import type { Metadata } from 'next';
import './globals.css';
import { POSProvider } from '../context/POSContext';

export const metadata: Metadata = {
  title: 'Cornfu Café Menu | Great Food, Fresh Drinks, Everyday Joy',
  description: 'Fast food & artisan boba cafe digital menu with prices and rich descriptions.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased selection:bg-brand/20 selection:text-brand">
        <POSProvider>{children}</POSProvider>
      </body>
    </html>
  );
}

