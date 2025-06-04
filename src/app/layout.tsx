import type { Metadata } from "next";
import { Instrument_Serif, Inter, Miss_Fajardose } from "next/font/google";
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

const Cursive = Miss_Fajardose({
  variable: '--font-cursive',
  subsets: ['latin'],
  weight: '400',
  style: 'normal'
})

export const metadata: Metadata = {
  title: "The Auditor",
  description: "Internet's best music connoisseur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${Serif.variable} ${Sans.variable} ${Cursive.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
