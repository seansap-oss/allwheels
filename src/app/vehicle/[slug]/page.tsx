import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { VehicleClient } from "@/components/vehicle-client";
import { activeListings, getListingBySlug, isFavorite, searchListings, similarListings } from "@/lib/store";
import { currentUser } from "@/lib/auth";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const l = getListingBySlug(slug);
  if (!l) return { title: "Vehicle not found" };
  const url = `https://motora.com/vehicle/${l.slug}`;
  return {
    title: `${l.year} ${l.manufacturerName} ${l.modelName} for sale in ${l.city}`,
    description: `${l.title} — ₹${l.price.toLocaleString("en-IN")} in ${l.city}, ${l.state}. ${l.kms != null ? `${l.kms.toLocaleString("en-IN")} km` : ""} ${l.fuel ?? ""}. Contact the seller on Motora.`,
    alternates: { canonical: url },
    openGraph: {
      title: l.title,
      description: `₹${l.price.toLocaleString("en-IN")} · ${l.city}`,
      url,
      type: "website",
      images: l.media[0] ? [{ url: l.media[0].url }] : undefined,
    },
    twitter: { card: "summary_large_image", title: l.title, description: `₹${l.price.toLocaleString("en-IN")} · ${l.city}` },
  };
}

export default async function VehiclePage({ params }: Props) {
  const { slug } = await params;
  const l = getListingBySlug(slug);
  if (!l || (l.status !== "ACTIVE" && l.status !== "APPROVED")) notFound();
  const user = await currentUser();
  const similar = similarListings(l, 4);

  // Price guidance vs comparable active listings (same model).
  const comps = activeListings().filter((x) => x.modelId === l.modelId && x.id !== l.id);
  let pricePosition = "Fair price";
  if (comps.length > 0) {
    const prices = comps.map((c) => c.price).sort((a, b) => a - b);
    const median = prices[Math.floor(prices.length / 2)];
    if (l.price < median * 0.92) pricePosition = "Below market";
    else if (l.price > median * 1.08) pricePosition = "Above market";
  }

  return (
    <Container className="py-6">
      <VehicleClient l={l} similar={similar} isFav={user ? isFavorite(user.id, l.id) : false} pricePosition={pricePosition} />
      <p className="mt-6 text-xs text-slate-500">
        Estimated from comparable Motora listings. This is not a certified valuation.
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Vehicle",
            name: l.title,
            brand: l.manufacturerName,
            model: l.modelName,
            vehicleModelDate: String(l.year),
            offers: { "@type": "Offer", price: l.price, priceCurrency: "INR", availability: "https://schema.org/InStock" },
          }),
        }}
      />
    </Container>
  );
}
