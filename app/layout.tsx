import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter font (SF Pro alternative) via next/font/google
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meet in the Middle",
  description: "Find the perfect meetup spot between you and your friend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased">{children}</body>
    </html>
  );
}
