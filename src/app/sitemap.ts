import type { MetadataRoute } from "next";
import { activeListings, manufacturers, vehicleModels } from "@/lib/store";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://motora.com";
  const pages = ["", "/search", "/dealers", "/research", "/news", "/pricing", "/about", "/contact", "/safety", "/terms", "/privacy"].map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: new Date(),
  }));
  const vehicles = activeListings().map((l) => ({
    url: `${base}/vehicle/${l.slug}`,
    lastModified: new Date(l.updatedAt),
  }));
  const models = vehicleModels.slice(0, 200).map((m) => {
    const mfr = manufacturers.find((x) => x.id === m.manufacturerId);
    return {
      url: `${base}/${m.categorySlug}/${mfr?.slug ?? "other"}/${m.slug}`,
      lastModified: new Date(),
    };
  });
  return [...pages, ...models, ...vehicles];
}
