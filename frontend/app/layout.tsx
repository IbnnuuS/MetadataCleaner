import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Metadata Cleaner - Hapus Metadata Gambar Secara Instan & Aman",
  description: "Hapus EXIF, GPS, IPTC, XMP, dan metadata lainnya dari gambar secara instan tanpa mengurangi kualitas gambar. 100% aman, gratis, tanpa registrasi, dan berjalan di RAM.",
  keywords: "clean metadata, hapus exif, hapus metadata, hapus gps gambar, hapus metadata ai, exif cleaner, metadata remover",
  authors: [{ name: "AI Metadata Cleaner" }],
  openGraph: {
    title: "AI Metadata Cleaner - Hapus Metadata Gambar Secara Instan & Aman",
    description: "Hapus EXIF, GPS, IPTC, XMP, dan metadata lainnya dari gambar secara instan tanpa mengurangi kualitas gambar.",
    url: "https://aimetadata-cleaner.vercel.app",
    siteName: "AI Metadata Cleaner",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Metadata Cleaner Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Metadata Cleaner - Hapus Metadata Gambar Secara Instan & Aman",
    description: "Hapus EXIF, GPS, IPTC, XMP, dan metadata lainnya dari gambar secara instan tanpa mengurangi kualitas gambar.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://aimetadata-cleaner.vercel.app",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google_verification_placeholder",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
      </head>
      <body className="bg-radial-grid min-h-screen antialiased selection:bg-purple-500/30 selection:text-purple-200">
        {children}
      </body>
    </html>
  );
}
