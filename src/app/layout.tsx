import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daffa Dhiyaulhaq Khadafi | AI-Assisted Product Engineer",
  description: "Daffa Dhiyaulhaq Khadafi is an AI-Assisted Product Engineer & Founder, specializing in building high-velocity, defensible digital products, AI architectures, and modern web applications.",
  keywords: ["AI Engineer", "Product Manager", "Digital Product Builder", "Daffa Dhiyaulhaq Khadafi", "AI Architecture", "Product Engineer", "AAPE"],
  icons: {
    icon: "/assets/logo AAPE.png",
  },
  openGraph: {
    title: "Daffa Dhiyaulhaq Khadafi | AI-Assisted Product Engineer",
    description: "Transforming ambiguous problem spaces into high-velocity digital products.",
    url: "https://your-domain.com",
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
