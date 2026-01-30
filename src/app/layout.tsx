import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const ebGaramond = EB_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      <body className={`${ebGaramond.variable} antialiased`}>
        <Header />
        <Sidebar />
        <main className="ml-56 mt-16 min-h-[calc(100vh-64px)] p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
