import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppStoreProvider } from "@/store/app-store";
import AppStartupScreen from "./components/app-startup-screen";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import InstallPrompt from "./components/InstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CertifyHub — Exam Preparation & Practice",
  description:
    "Recap each topic, watch the key concepts, then practise sample professional exam questions in the real exam format and conditions.",
  applicationName: "CertifyHub",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "CertifyHub",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0E2F5E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppStartupScreen />
        <AppStoreProvider>
          {children}
        </AppStoreProvider>
        <ServiceWorkerRegister />
        <InstallPrompt />
      </body>
    </html>
  );
}

