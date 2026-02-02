import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";
import OperaHeader from "@/components/layout/OperaHeader";
import ChatWidget from "@/components/intelligence/ChatWidget";

const ebGaramond = EB_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Four Seasons | Labor Optimization",
  description: "Guest-Informed Labor Optimization for Four Seasons Hotels & Resorts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ebGaramond.variable} ${inter.variable} ${inter.className} antialiased bg-gray-100`}>
        <OperaHeader />
        <main className="pt-[160px] min-h-screen">
          {children}
        </main>
        <ChatWidget />
      </body>
    </html>
  );
}
