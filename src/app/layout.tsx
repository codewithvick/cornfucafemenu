import type { Metadata } from 'next';
import './globals.css';
import { POSProvider } from '../context/POSContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://menu.cornfucafe.shop'),
  title: 'Cornfu Café Menu | Great Food, Fresh Drinks, Everyday Joy',
  description:
    'Explore the official Cornfu Café digital menu. Freshly prepared shawarma, peppered wings, loaded mishai, boba tea, matcha, signature smoothies, and natural juices at 40 Ekenna Street, Aba.',
  keywords: [
    'Cornfu Cafe',
    'Cornfu Cafe Menu',
    'Cornfu Cafe Aba',
    'Shawarma Aba',
    'Boba Tea Aba',
    'Smoothies Aba',
    'Fast Food Aba',
    '40 Ekenna Street Aba',
  ],
  authors: [{ name: 'Cornfu Café' }],
  creator: 'Cornfu Café',
  publisher: 'Cornfu Café',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://menu.cornfucafe.shop',
    siteName: 'Cornfu Café Menu',
    title: 'Cornfu Café Menu | Great Food, Fresh Drinks, Everyday Joy',
    description:
      'Explore the official Cornfu Café digital menu. Freshly prepared shawarma, peppered wings, loaded mishai, boba tea, matcha, signature smoothies, and natural juices at 40 Ekenna Street, Aba.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cornfu Café Menu - 40 Ekenna Street, Aba',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cornfu Café Menu | Great Food, Fresh Drinks, Everyday Joy',
    description:
      'Explore the official Cornfu Café digital menu. Freshly prepared shawarma, peppered wings, loaded mishai, boba tea, smoothies, and juices at 40 Ekenna Street, Aba.',
    images: ['/og-image.png'],
  },
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

