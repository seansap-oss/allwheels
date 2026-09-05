import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, SectionTitle } from "@/components/ui";
import { ListingCard } from "@/components/listing-card";
import { categoryOf } from "../../page";
import { getVariantsByModel, manufacturers, searchListings } from "@/lib/store";
import { inr } from "@/lib/utils";

export async function generateStaticParams() {
  const { vehicleModels } = await import("@/lib/store");
  return vehicleModels.slice(0, 120).map((m) => {
    const mfr = manufacturers.find((x) => x.id === m.manufacturerId);
    return { category: m.categorySlug === "electric" ? "electric" : m.categorySlug, make: mfr?.slug ?? "other", model: m.slug };
  });
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; make: string; model: string }> }): Promise<Metadata> {
  const { category, make, model } = await params;
  const { vehicleModels } = await import("@/lib/store");
  const m = vehicleModels.find((x) => x.slug === model);
  const mfr = manufacturers.find((x) => x.slug === make);
  if (!m || !mfr || !categoryOf(category)) return { title: "Not found" };
  const url = `https://motora.com/${category}/${make}/${model}`;
  return {
    title: `${mfr.name} ${m.name}: price, variants, specs & used stock`,
    description: `${mfr.name} ${m.name} research — variants, specifications, ex-showroom price range and live used listings across India.`,
    alternates: { canonical: url },
  };
}

export default async function ModelPage({ params }: { params: Promise<{ category: string; make: string; model: string }> }) {
  const { category, make, model } = await params;
  if (!categoryOf(category)) notFound();
  const { vehicleModels } = await import("@/lib/store");
  const m = vehicleModels.find((x) => x.slug === model);
  const mfr = manufacturers.find((x) => x.slug === make);
  if (!m || !mfr || m.manufacturerId !== mfr.id) notFound();

  const variants = getVariantsByModel(m.id);
  const live = searchListings({ model: m.slug, perPage: 8, sort: "newest" });
  const prices = variants.map((v) => v.priceExShowroom).filter((p): p is number => p != null);
  const min = prices.length > 0 ? Math.min(...prices) : null;
  const max = prices.length > 0 ? Math.max(...prices) : null;

  return (
    <Container className="py-8">
      <p className="text-sm text-slate-500">
        <Link href={`/${category}`} className="font-semibold text-motora-600">{categoryOf(category)}</Link> /{" "}
        <Link href={`/${category}/${mfr.slug}`} className="font-semibold text-motora-600">{mfr.name}</Link> / {m.name}
      </p>
      <h1 className="mt-1 text-3xl font-black tracking-tight text-navy-950 sm:text-4xl">{mfr.name} {m.name}</h1>
      <p className="mt-1 text-sm text-slate-600">
        {m.status}{m.bodyTypes.length > 0 ? ` · ${m.bodyTypes.join(" · ")}` : ""}
        {min != null ? ` · Ex-showroom ${inr(min)} – ${inr(max!)} (catalogue guide)` : ""}
      </p>

      <section className="mt-8">
        <SectionTitle title={`Variants (${variants.length})`} sub="Seller forms auto-fill engine, fuel, transmission and price from this data." />
        {variants.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">Variant data for this model is being compiled by the catalogue team.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[720px] text-sm">
              <thead><tr className="text-left text-xs uppercase text-slate-500"><th className="p-3">Variant</th><th className="p-3">Fuel</th><th className="p-3">Gearbox</th><th className="p-3">Engine</th><th className="p-3">Power</th><th className="p-3">Ex-showroom</th></tr></thead>
              <tbody>
                {variants.map((v) => (
                  <tr key={v.id} className="border-t border-slate-100">
                    <td className="p-3 font-bold">{v.name} <span className="text-xs font-normal text-slate-400">{v.year}</span></td>
                    <td className="p-3">{v.fuel ?? "—"}</td>
                    <td className="p-3">{v.transmission ?? "—"}</td>
                    <td className="p-3">{v.engineCc ? `${v.engineCc} cc` : "EV"}</td>
                    <td className="p-3">{v.powerPs ? `${v.powerPs} PS` : "—"}</td>
                    <td className="p-3 font-bold">{v.priceExShowroom ? inr(v.priceExShowroom) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <SectionTitle title={`Used ${m.name} for sale`} sub="Live Motora inventory for this exact model." action={<Link href={`/search?model=${m.slug}`} className="text-sm font-bold text-motora-600">View all →</Link>} />
        {live.items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">No live listings right now — save a search to get alerted.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {live.items.map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
