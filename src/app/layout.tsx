import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";

const helvetica = localFont({
  src: "./fonts/HelveticaNeueLTPro-Md.woff",
  variable: "--font-helvetica",
});
const helveticaRoman = localFont({
  src: "./fonts/HelveticaNeueLTPro-Roman.woff",
  variable: "--font-helvetica-roman",
});

const futura = localFont({
  src: "./fonts/FuturaLTPro-BoldCond.woff2",
  variable: "--font-futura",
});

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
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" className="h-full" dir="rtl">


      <body
        className={`${helvetica.variable} ${helveticaRoman.variable} ${futura.variable} flex min-h-screen flex-col antialiased`}
      >
        <Header />
        
        <main className="flex-1">
          {children}

        </main>
      </body>
    </html>
  );
}