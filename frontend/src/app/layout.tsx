import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProviderWrapper } from '@/components/providers/AuthProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

// Temporarily disabled to fix React Server Components error
// export const metadata = {
//   title: 'TON Platform - Vehicle Rental, Workshop Service, and Spare Parts Shop',
//   description: 'Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop',
//   keywords: ['vehicle rental', 'workshop service', 'spare parts', 'business management', 'TON Platform'],
//   authors: [{ name: 'TON Platform Team' }],
// };

// export const viewport = {
//   width: 'device-width',
//   initialScale: 1,
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}