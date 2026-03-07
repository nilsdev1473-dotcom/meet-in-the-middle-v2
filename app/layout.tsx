import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// SF Pro Display via next/font/local
// Falls back to system-ui if font files not present
const sfPro = localFont({
  src: [
    {
      path: "../public/fonts/SF-Pro-Display-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/SF-Pro-Display-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/SF-Pro-Display-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/SF-Pro-Display-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
  fallback: ["system-ui", "sans-serif"],
  display: "swap",
  preload: false, // avoid 404 errors if font files not present
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
    <html lang="en" className={sfPro.variable}>
      <body className="font-sf-pro antialiased">{children}</body>
    </html>
  );
}
