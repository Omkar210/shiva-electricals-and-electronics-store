import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shivaelectrical.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/delivery"],
        disallow: [
          "/admin",
          "/admin/*",
          "/account",
          "/account/*",
          "/cart",
          "/checkout",
          "/checkout/*",
          "/auth",
          "/auth/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
