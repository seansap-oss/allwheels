import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionTitle } from "@/components/ui";
import { getArticles, manufacturers, searchListings, vehicleModels } from "@/lib/store";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  const articles = getArticles();
  return (
    <Container className="py-8">
      <SectionTitle kicker="Research" title="Research vehicles" sub="Catalogue knowledge separated from classified ads — specs, price ranges, then live inventory." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vehicleModels.slice(0, 12).map((m) => {
          const live = searchListings({ model: m.slug, perPage: 1 });
          const mfr = manufacturers.find((x) => x.id === m.manufacturerId);
          const href = mfr ? `/${m.categorySlug}/${mfr.slug}/${m.slug}` : `/search?model=${m.slug}`;
          return (
            <Link key={m.id} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg">
              <p className="font-extrabold text-navy-950">{mfr?.name} {m.name}</p>
              <p className="text-xs text-slate-500">{m.categorySlug} · {m.status}</p>
              <p className="mt-2 text-sm font-bold text-motora-600">{live.total} used for sale →</p>
            </Link>
          );
        })}
      </div>
      <h2 className="mt-10 text-xl font-black">Buying guides & news</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {articles.map((a) => (
          <article key={a.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.image} alt={a.title} className="aspect-[16/9] w-full object-cover" loading="lazy" />
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-coral-600">{a.category}</p>
              <p className="mt-1 font-bold">{a.title}</p>
              <p className="mt-1 text-sm text-slate-600">{a.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}
