import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '11 Fight Camp Pontianak | Muay Thai, Boxing, BJJ, MMA & Combat Fitness',
  description:
    'Sasana beladiri dan combat fitness nomor satu di Pontianak, Kalimantan Barat. Kelas Muay Thai, Boxing, Brazilian Jiu-Jitsu (BJJ), MMA, dan Private Coaching.',
  keywords: [
    '11 Fight Camp',
    '11fightcamp',
    'Muay Thai Pontianak',
    'Boxing Pontianak',
    'BJJ Pontianak',
    'MMA Pontianak',
    'Tempat Tinju Pontianak',
    'Gym Bela Diri Pontianak',
  ],
  openGraph: {
    title: '11 Fight Camp Pontianak | Sasana Muay Thai & Beladiri',
    description: 'Forge Your Body. Master The Art of Combat. Booking kelas latihan bela diri online di Pontianak.',
    url: 'https://11fightcamp.com',
    siteName: '11 Fight Camp',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090a0c] text-zinc-100">
        {children}
      </body>
    </html>
  );
}
