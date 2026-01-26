import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rainbow Gun - Interactive Web Synthesizer",
  description: "A fun experimental web-based music synthesizer with 15 knobs, MIDI control, and gun sound synthesis. Play chromatic scales, switch chords, and control sub-bass with an interactive browser instrument.",
  keywords: ["web synthesizer", "web audio", "MIDI controller", "Tone.js", "interactive music", "browser instrument", "audio synthesis", "computer music"],
  authors: [{ name: "Rainbow Gun Team" }],
  openGraph: {
    title: "Rainbow Gun - Interactive Web Synthesizer",
    description: "A fun experimental web-based music synthesizer with MIDI control and gun sound synthesis",
    type: "website",
    url: "https://rainbow-gun.pages.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rainbow Gun - Interactive Web Synthesizer",
    description: "A fun experimental web-based music synthesizer with MIDI control and gun sound synthesis",
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
