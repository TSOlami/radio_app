import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: "Freeman Firms - Investment Platform",
    template: "%s | Freeman Firms",
  },
  description: "Professional investment platform with role-based access for users, administrators, and super administrators.",
  keywords: ["investment", "finance", "portfolio", "admin", "dashboard"],
  authors: [{ name: "Freeman Firms" }],
  creator: "Freeman Firms",
  publisher: "Freeman Firms",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://freeman-firms.com",
    title: "Freeman Firms - Investment Platform",
    description: "Professional investment platform with role-based access",
    siteName: "Freeman Firms",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freeman Firms - Investment Platform",
    description: "Professional investment platform with role-based access",
    creator: "@freeman_firms",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${montserrat.className} antialiased min-h-screen bg-gray-50`}>
        <AuthProvider>
          <div id="root" className="min-h-screen">
            {children}
          </div>
          <div id="modal-root" />
          <div id="toast-root" />
        </AuthProvider>
      </body>
    </html>
  );
}