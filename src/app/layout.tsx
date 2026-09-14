import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#090a0c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://11fightcamp.vercel.app'),
  title: '11th Universe MMA | 11 Fight Camp Pontianak',
  description:
    'Sasana beladiri dan combat fitness nomor satu di Pontianak, Kalimantan Barat. Kelas Striking, Boxing, Brazilian Jiu-Jitsu (BJJ), MMA, Hyrox, dan Private Coaching.',
  keywords: [
    '11th Universe MMA',
    '11 Fight Camp',
    '11fightcamp',
    'Muay Thai Pontianak',
    'Boxing Pontianak',
    'BJJ Pontianak',
    'MMA Pontianak',
    'Tempat Tinju Pontianak',
    'Gym Bela Diri Pontianak',
  ],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: '11th Universe MMA | 11 Fight Camp Pontianak',
    description: 'Forge Your Body. Master The Art of Combat. Booking kelas latihan bela diri online di Pontianak.',
    url: 'https://11fightcamp.vercel.app',
    siteName: '11th Universe MMA',
    images: [
      {
        url: '/hero-full-bg.jpg',
        width: 1200,
        height: 630,
        alt: '11th Universe MMA Pontianak',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ExerciseGym',
  name: '11th Universe MMA (11 Fight Camp)',
  image: 'https://11fightcamp.vercel.app/hero-full-bg.jpg',
  logo: 'https://11fightcamp.vercel.app/logo.png',
  url: 'https://11fightcamp.vercel.app',
  telephone: '+6281255562211',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Dr. Rubini No. 11, Akcaya, Kec. Pontianak Selatan',
    addressLocality: 'Pontianak',
    addressRegion: 'Kalimantan Barat',
    postalCode: '78113',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -0.040187,
    longitude: 109.336495,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '21:30',
    },
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#090a0c] text-zinc-100">
        {children}
      </body>
    </html>
  );
}
