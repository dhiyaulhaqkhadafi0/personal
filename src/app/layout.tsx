import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daffa Dhiyaulhaq Khadafi - Digital Product Builder",
  description: "Bridging the gap between user needs, business goals, and technical execution.",
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
