import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer, BottomNav } from "@/components/chrome";
import { PwaRegister } from "@/components/pwa-register";
import { currentUser } from "@/lib/auth";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Motora — Find your next ride", template: "%s · Motora" },
  description: "Cars, motorcycles, scooters, EVs, commercial vehicles and bicycles — all in one place. Buy and sell across India.",
  applicationName: "Motora",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Motora" },
  formatDetection: { telephone: true },
  openGraph: {
    type: "website",
    siteName: "Motora",
    title: "Motora — Find your next ride",
    description: "India's multi-category vehicle marketplace.",
  },
  twitter: { card: "summary_large_image", title: "Motora", description: "Find your next ride." },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1633",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white text-slate-900 antialiased">
        <PwaRegister />
        <Header userName={user?.name ?? null} />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
