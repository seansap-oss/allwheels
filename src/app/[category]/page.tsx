import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, SectionTitle } from "@/components/ui";
import { ListingCard } from "@/components/listing-card";
import { getManufacturerBySlug, manufacturers, searchListings, vehicleModels } from "@/lib/store";

export const CATEGORIES: Record<string, string> = {
  cars: "Cars",
  motorcycles: "Motorcycles",
  scooters: "Scooters",
  electric: "Electric",
  commercial: "Commercial",
  bicycles: "Bicycles",
};

export function categoryOf(slug: string): string | null {
  return CATEGORIES[slug] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const name = categoryOf(category);
  if (!name) return { title: "Not found" };
  return {
    title: `${name} for sale in India`,
    description: `Buy new and used ${name.toLowerCase()} across India on Motora — verified sellers, price guidance, full specs.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const name = categoryOf(category);
  if (!name) notFound();
  const result = searchListings({ category, perPage: 8, sort: "newest" });
  const models = vehicleModels.filter((m) => m.categorySlug === category).slice(0, 24);

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-black tracking-tight text-navy-950 sm:text-4xl">{name} for sale</h1>
      <p className="mt-1 text-sm text-slate-600">
        {result.total.toLocaleString("en-IN")} live listings ·{" "}
        <Link href={`/search?category=${category}`} className="font-bold text-motora-600">Search all {name.toLowerCase()} →</Link>
      </p>

      <section className="mt-8">
        <SectionTitle title={`Popular ${name.toLowerCase()} models`} sub="Every model page carries specs, variants, price range and live stock." />
        <div className="flex flex-wrap gap-2">
          {models.map((m) => (
            <ModelChip key={m.id} category={category} model={m} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle title="Latest listings" action={<Link href={`/search?category=${category}`} className="text-sm font-bold text-motora-600">View all →</Link>} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {result.items.map((l) => (
            <ListingCard key={l.id} l={l} />
          ))}
        </div>
      </section>
    </Container>
  );
}

function ModelChip({ category, model }: { category: string; model: { slug: string; name: string; manufacturerId: string } }) {
  const mfr = getManufacturerBySlug(manufacturers.find((x) => x.id === model.manufacturerId)?.slug ?? "");
  if (!mfr) return null;
  return (
    <Link href={`/${category}/${mfr.slug}/${model.slug}`} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold hover:border-motora-500 hover:text-motora-600">
      {model.name}
    </Link>
  );
}
