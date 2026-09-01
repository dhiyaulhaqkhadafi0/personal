import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://khadafidaffa.com"),
  title: "Daffa Dhiyaulhaq Khadafi | AI-Assisted Product Engineer",
  description: "Daffa Dhiyaulhaq Khadafi is an AI-Assisted Product Engineer & Founder, specializing in building high-velocity, defensible digital products, AI architectures, and modern web applications.",
  keywords: ["AI Engineer", "Product Manager", "Digital Product Builder", "Daffa Dhiyaulhaq Khadafi", "AI Architecture", "Product Engineer", "AAPE"],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/favicon/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/favicon/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/favicon/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/favicon/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/favicon/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/favicon/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/favicon/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/favicon/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/favicon/apple-icon-precomposed.png",
      },
    ],
  },
  manifest: "/favicon/manifest.json",
  openGraph: {
    title: "Daffa Dhiyaulhaq Khadafi | AI-Assisted Product Engineer",
    description: "Transforming ambiguous problem spaces into high-velocity digital products.",
    url: "https://khadafidaffa.com",
    siteName: "Daffa Dhiyaulhaq Khadafi Persona",
    images: [
      {
        url: "/assets/cover gerakasa.png",
        width: 1200,
        height: 630,
      }
    ],
    locale: "id_ID",
    type: "website",
  },
  verification: {
    google: "tvDzvqzKpVqYpHuHxRtfaLJHT6_mTg4AeQpKmp44m6k",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen bg-brand-bg text-brand-primary font-sans">
        {children}
      </body>
    </html>
  );
}
