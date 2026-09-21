import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Shiva Electrical & Electronics",
    template: "%s | Shiva Electrical & Electronics",
  },
  description:
    "RO purifiers, spare parts, fans, and electrical products with local delivery.",
  keywords: [
    "RO purifier",
    "water purifier",
    "RO spare parts",
    "fans",
    "electrical shop",
    "electronics",
    "local delivery",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
