import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: '채우다',
  description: '전국 빈집을 채워보자',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
