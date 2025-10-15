import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cluefind - Developer Portfolio & Endorsements",
  description: "Showcase your developer portfolio and get verified skill endorsements from colleagues",
  keywords: ["developer", "portfolio", "endorsements", "skills", "projects"],
  authors: [{ name: "Cluefind Team" }],
  creator: "Cluefind",
  publisher: "Cluefind",
  formatDetection: {
   email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "Cluefind - Developer Portfolio & Endorsements",
    description: "Showcase your developer portfolio and get verified skill endorsements from colleagues",
    siteName: "Cluefind",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cluefind - Developer Portfolio & Endorsements",
    description: "Showcase your developer portfolio and get verified skill endorsements from colleagues",
    creator: "@Cluefind",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}