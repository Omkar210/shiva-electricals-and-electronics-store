import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    "Authorized local dealer for RO water purifiers, genuine replacement filter candles, ceiling fans, wiring, and certified doorstep installation services with same-day delivery.",
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
    "Local retailer and service center for RO water purifiers, replacement filter cartridges, ceiling fans, electrical wiring, and doorstep technical installations.",
  url: siteUrl,
  telephone: "+91-9876543210",
  priceRange: "₹₹",
  paymentAccepted: "Cash, UPI, Pay on Delivery",
  currenciesAccepted: "INR",
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
      </body>
    </html>
  );
}
