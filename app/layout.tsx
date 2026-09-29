import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shivaelectrical.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shiva Electrical & Electronics | RO Purifiers, Spares & Home Electricals",
    template: "%s | Shiva Electrical & Electronics",
  },
  description:
    "Trusted local retailer and service specialist for RO water purifiers, genuine replacement filter candles, ceiling fans, wiring, and certified doorstep installation with same-day local delivery.",
  keywords: [
    "RO purifier",
    "water purifier",
    "RO spare parts",
    "sediment filter",
    "carbon block",
    "RO membrane",
    "ceiling fans",
    "electrical shop",
    "electronics store",
    "doorstep installation",
    "water purifier repair",
    "Solapur electricals",
    "local delivery",
  ],
  authors: [{ name: "Shiva Electrical & Electronics" }],
  creator: "Shiva Electrical & Electronics",
  publisher: "Shiva Electrical & Electronics",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Shiva Electrical & Electronics",
    title: "Shiva Electrical & Electronics | Water Purifiers & Home Electricals",
    description:
      "Buy genuine RO water purifiers, replacement filters, fans, and electrical supplies with same-day doorstep local delivery and certified installation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shiva Electrical & Electronics",
    description:
      "Your trusted local store for RO purifiers, spares, and electrical supplies with doorstep delivery.",
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

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeGoodsStore",
  name: "Shiva Electrical & Electronics",
  description:
    "Local independent multi-brand retailer and certified service center for RO water purifiers, replacement filter cartridges, ceiling fans, electrical wiring, and doorstep technical installations.",
  url: siteUrl,
  telephone: "+91-9876543210",
  email: "contact@shivaelectrical.in",
  priceRange: "₹₹",
  paymentAccepted: "Cash, UPI, Pay on Delivery",
  currenciesAccepted: "INR",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop No. 4, Market Yard Commercial Complex, Main Market Road",
    addressLocality: "Solapur",
    addressRegion: "Maharashtra",
    postalCode: "413001",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "10:00",
      closes: "14:00",
    },
  ],
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Solapur & Nearby District Pincodes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={localBusinessSchema} />
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-700 selection:text-white`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
