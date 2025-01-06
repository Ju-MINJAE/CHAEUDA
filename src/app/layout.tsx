import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import NavContainer from '@/containers/NavContainer/NavContainer';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '채우다',
  description: '전국 빈집을 채워보자',
};

const pretendard = localFont({
  src: '../font/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <body className={`${pretendard.className} flex flex-col min-h-screen`}>
        <NavContainer />
        <main className="flex-1 pt-[80px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
