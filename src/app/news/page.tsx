import type { Metadata } from "next";
import { Container, SectionTitle } from "@/components/ui";
import { getArticles } from "@/lib/store";

export const metadata: Metadata = { title: "News & Reviews" };

export default function NewsPage() {
  const articles = getArticles();
  return (
    <Container className="py-8">
      <SectionTitle kicker="Editorial" title="News & reviews" sub="New launches, EV news, ownership and maintenance guides." />
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((a) => (
          <article key={a.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.image} alt={a.title} className="aspect-[16/9] w-full object-cover" loading="lazy" />
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-coral-600">{a.category} · {a.date}</p>
              <p className="mt-1 font-bold">{a.title}</p>
              <p className="mt-1 text-sm text-slate-600">{a.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}
