import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, SectionTitle } from "@/components/ui";
import { ListingCard } from "@/components/listing-card";
import { categoryOf } from "../page";
import { manufacturers, searchListings, vehicleModels } from "@/lib/store";

export async function generateMetadata({ params }: { params: Promise<{ category: string; make: string }> }): Promise<Metadata> {
  const { category, make } = await params;
  const mfr = manufacturers.find((m) => m.slug === make);
  if (!mfr || !categoryOf(category)) return { title: "Not found" };
  return {
    title: `${mfr.name} ${categoryOf(category)} for sale in India`,
    description: `Every ${mfr.name} model with specs, variants and live used stock on Motora.`,
  };
}

export default async function MakePage({ params }: { params: Promise<{ category: string; make: string }> }) {
  const { category, make } = await params;
  if (!categoryOf(category)) notFound();
  const mfr = manufacturers.find((m) => m.slug === make);
  if (!mfr) notFound();
  const models = vehicleModels.filter((m) => m.manufacturerId === mfr.id);
  const result = searchListings({ make, perPage: 8, sort: "newest" });

  return (
    <Container className="py-8">
      <p className="text-sm text-slate-500">
        <Link href={`/${category}`} className="font-semibold text-motora-600">{categoryOf(category)}</Link> / {mfr.name}
      </p>
      <h1 className="mt-1 text-3xl font-black tracking-tight text-navy-950 sm:text-4xl">{mfr.name}</h1>
      <p className="mt-1 text-sm text-slate-600">{models.length} models · {result.total} live listings from {mfr.country}</p>

      <section className="mt-8">
        <SectionTitle title="Models" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <Link key={m.id} href={`/${category}/${mfr.slug}/${m.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-lg">
              <p className="font-extrabold text-navy-950">{m.name}</p>
              <p className="text-xs text-slate-500">{m.status}{m.bodyTypes.length > 0 ? ` · ${m.bodyTypes.join(", ")}` : ""}</p>
              <p className="mt-1 text-sm font-bold text-motora-600">Research + live stock →</p>
            </Link>
          ))}
        </div>
      </section>

      {result.items.length > 0 ? (
        <section className="mt-10">
          <SectionTitle title={`Latest used ${mfr.name}`} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {result.items.map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
