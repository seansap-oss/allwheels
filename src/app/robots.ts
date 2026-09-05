import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://motora.com";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/dealer/dashboard", "/messages", "/api/"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
