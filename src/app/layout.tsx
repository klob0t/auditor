import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from '@/app/lib/providers'

const Serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: '400',
  style: ['normal', 'italic']
});

const Sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['italic', 'normal']
})

export const metadata: Metadata = {
  title: "Auditor",
  description: "The best Spotify profile rater",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${Serif.variable} ${Sans.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
