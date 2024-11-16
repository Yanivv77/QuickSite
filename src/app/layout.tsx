import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: {
    template: "%s | QuickBooks",
    default: "QuickBooks",
  },
  description: "A performant site built with Next.js",
};

export const revalidate = 86400;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" className={`h-full ${GeistSans.variable} ${GeistMono.variable}`} dir="rtl">
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}