import Link from "next/link";
import type { Metadata } from "next";
import { HeroSearch } from "@/components/hero-search";
import { ListingCard } from "@/components/listing-card";
import { Container, SectionTitle } from "@/components/ui";
import { activeListings, categories, getArticles, manufacturers, searchListings, seedDealers, vehicleModels } from "@/lib/store";

export const metadata: Metadata = {
  title: "Motora — Find your next ride",
  description: "Cars, motorcycles, scooters, EVs, commercial vehicles and bicycles — all in one place.",
};

const CATEGORY_CARDS = [
  { slug: "cars", name: "Cars", img: "/images/photos/cat-suv.jpg", blurb: "Hatchbacks to luxury SUVs" },
  { slug: "motorcycles", name: "Motorcycles", img: "/images/photos/cat-bike.jpg", blurb: "Commuter to adventure" },
  { slug: "scooters", name: "Scooters", img: "/images/photos/cat-scooter.jpg", blurb: "Petrol + electric" },
  { slug: "electric", name: "Electric", img: "/images/photos/cat-ev.jpg", blurb: "EV scooters & cars" },
  { slug: "commercial", name: "Commercial", img: "/images/photos/cat-truck.jpg", blurb: "Trucks, pickups, buses" },
  { slug: "bicycles", name: "Bicycles", img: "/images/photos/cat-cycle.jpg", blurb: "MTB, road, kids, e-bikes" },
];

export default function HomePage() {
  const total = activeListings().length;
  const latest = searchListings({ sort: "newest", perPage: 8 }).items;
  const featured = activeListings().filter((l) => l.featured).slice(0, 4);
  const bikes = searchListings({ category: "motorcycles", perPage: 4 }).items;
  const cars = searchListings({ category: "cars", perPage: 4 }).items;
  const articles = getArticles();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#060b1f] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_480px_at_15%_-10%,#1a5fd033,transparent),radial-gradient(900px_420px_at_90%_10%,#f96a3e1f,transparent),linear-gradient(180deg,#060b1f_0%,#0a1633_55%,#0f2050_100%)]" aria-hidden="true" />
        <div className="absolute inset-0 opacity-[0.14]" aria-hidden="true"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(700px 340px at 50% 0%, black, transparent)" }} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-glow-400/70 to-transparent" aria-hidden="true" />
        <Container className="relative py-12 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-teal-glow-400">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-glow-400" aria-hidden="true" /> India&apos;s multi-category marketplace
          </p>
          <h1 className="font-display mt-5 max-w-3xl text-[42px] font-bold leading-[1.02] sm:text-7xl">
            Find your next ride<span className="text-coral-500">.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Cars, motorcycles, scooters, EVs, commercial vehicles and bicycles — all in one place.
          </p>
          <div className="mt-7 max-w-4xl">
            <HeroSearch total={total} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-widest text-slate-500">Popular:</span>
            {[
              ["Classic 350", "/search?q=classic+350"],
              ["Scorpio N", "/search?q=scorpio"],
              ["Activa", "/search?q=activa"],
              ["450X", "/search?q=450x"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-semibold text-slate-200 hover:border-white/40 hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </Container>
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" aria-hidden="true" />
      </section>

      {/* BROWSE BY CATEGORY */}
      <section className="mt-10">
        <Container>
          <SectionTitle kicker="Marketplace" title="Browse by category" sub="Six marketplaces, one account. Your saved vehicles sync across web, PWA, Android and iOS." />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORY_CARDS.map((c) => (
              <Link key={c.slug} href={`/search?category=${c.slug}`} className="group relative overflow-hidden rounded-2xl bg-navy-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-105 sm:aspect-[4/4]" />
                <span className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" aria-hidden="true" />
                <span className="absolute inset-x-0 bottom-0 p-3">
                  <span className="block font-display text-[15px] font-bold text-white">{c.name}</span>
                  <span className="block text-[11px] text-slate-300">{c.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-slate-400">Category photography: Wikimedia Commons contributors, CC BY / CC BY-SA (see footer).</p>
        </Container>
      </section>

      {/* FEATURED */}
      {featured.length > 0 ? (
        <section className="mt-12">
          <Container>
            <SectionTitle kicker="Handpicked" title="Featured vehicles" action={<Link href="/search" className="text-sm font-bold text-motora-600">View all →</Link>} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((l) => (
                <ListingCard key={l.id} l={l} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* LATEST */}
      <section className="mt-12">
        <Container>
          <SectionTitle kicker="Fresh stock" title="Latest listings" sub="Live from the Motora catalogue — updated as sellers publish." action={<Link href="/search?sort=newest" className="text-sm font-bold text-motora-600">Newest first →</Link>} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
          </div>
        </Container>
      </section>

      {/* CARS + BIKES split */}
      <section className="mt-12 bg-slate-50 py-10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionTitle kicker="Four wheels" title="Popular cars" action={<Link href="/search?category=cars" className="text-sm font-bold text-motora-600">All cars →</Link>} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {cars.map((l) => (
                  <ListingCard key={l.id} l={l} />
                ))}
              </div>
            </div>
            <div>
              <SectionTitle kicker="Two wheels" title="Popular motorcycles" action={<Link href="/search?category=motorcycles" className="text-sm font-bold text-motora-600">All bikes →</Link>} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {bikes.map((l) => (
                  <ListingCard key={l.id} l={l} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* POPULAR MAKES + BODY TYPES (quick-search style directory) */}
      <section className="mt-12 bg-slate-50 py-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionTitle kicker="Directory" title="Popular makes" sub="Every make opens its models — pick a model to see variants and live stock." />
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {manufacturers.slice(0, 12).map((m) => {
                  const cat = m.categorySlugs.includes("cars") ? "cars" : m.categorySlugs[0] ?? "cars";
                  return (
                    <li key={m.id}>
                      <Link href={`/${cat}/${m.slug}`} className="flex h-12 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold hover:border-motora-500 hover:text-motora-600">
                        {m.name} <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <SectionTitle kicker="Directory" title="Shop by body type" sub="SUV, sedan, hatch, cruiser, adventure, e-scooter and more." />
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  ["SUV", "/search?category=cars&bodyType=suv", "🚙"],
                  ["Sedan", "/search?category=cars&bodyType=sedan", "🚗"],
                  ["Hatchback", "/search?category=cars&bodyType=hatchback", "🚗"],
                  ["Cruiser", "/search?category=motorcycles&bodyType=cruiser", "🏍️"],
                  ["Adventure", "/search?category=motorcycles&bodyType=adventure", "🏔️"],
                  ["Sports", "/search?category=motorcycles&bodyType=sports", "🏁"],
                  ["E-Scooter", "/search?category=scooters&bodyType=electric-scooter", "⚡"],
                  ["Petrol Scooter", "/search?category=scooters&bodyType=petrol-scooter", "🛵"],
                  ["Pickup", "/search?category=commercial&bodyType=pickup", "🛻"],
                ].map(([label, href, emoji]) => (
                  <li key={href}>
                    <Link href={href} className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold hover:border-motora-500 hover:text-motora-600">
                      <span aria-hidden="true">{emoji}</span> {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* BRANDS */}
      <section className="mt-12">
        <Container>
          <SectionTitle kicker="Catalogue" title="All makes A–Z" sub={`Backed by a master catalogue of ${manufacturers.length} manufacturers and ${vehicleModels.length} models — sellers pick, never free-type.`} />
          <div className="flex flex-wrap gap-2">
            {manufacturers.map((m) => (
              <Link key={m.id} href={`/search?make=${m.slug}`} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-navy-950 hover:border-motora-500 hover:text-motora-600">
                {m.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* DEALERS */}
      <section className="mt-12">
        <Container>
          <SectionTitle kicker="Dealers" title="Featured dealers" action={<Link href="/dealers" className="text-sm font-bold text-motora-600">All dealers →</Link>} />
          <div className="grid gap-4 md:grid-cols-2">
            {seedDealers.map((d) => (
              <Link key={d.id} href={`/dealer/${d.slug}`} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-motora-500 to-teal-glow-500 text-2xl font-black text-white">
                  {d.businessName[0]}
                </span>
                <span>
                  <span className="flex items-center gap-2 font-extrabold text-navy-950">{d.businessName} {d.verified ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">✓ VERIFIED</span> : null}</span>
                  <span className="mt-0.5 block text-sm text-slate-500">{d.city}, {d.state} · ★ {d.rating} ({d.reviewCount})</span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SELL CTA */}
      <section className="mt-12">
        <Container>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-navy-950 via-motora-700 to-teal-glow-500 p-8 text-white sm:p-12">
            <h2 className="text-2xl font-black sm:text-4xl">Sell your vehicle in minutes.</h2>
            <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">Step-by-step wizard, catalogue-powered specs, photo upload with progress, draft saving — works beautifully on your phone.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/sell" className="flex h-12 items-center rounded-full bg-white px-6 font-extrabold text-navy-950">+ Sell a Vehicle</Link>
              <Link href="/pricing" className="flex h-12 items-center rounded-full border border-white/40 px-6 font-bold text-white">See pricing</Link>
            </div>
          </div>
        </Container>
      </section>

      {/* GUIDES */}
      <section className="mt-12">
        <Container>
          <SectionTitle kicker="Research" title="Motora guides" action={<Link href="/research" className="text-sm font-bold text-motora-600">All research →</Link>} />
          <div className="grid gap-4 md:grid-cols-3">
            {articles.map((a) => (
              <Link key={a.id} href="/research" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.image} alt={a.title} className="aspect-[16/9] w-full object-cover" loading="lazy" />
                <div className="p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-coral-600">{a.category}</p>
                  <p className="mt-1 font-bold text-navy-950">{a.title}</p>
                  <p className="clamp-2 mt-1 text-sm text-slate-600">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* APP */}
      <section className="mt-12">
        <Container>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10">
            <h2 className="text-2xl font-black text-navy-950">Take Motora anywhere.</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Install the Motora PWA from your browser — home-screen icon, app-style launch, offline shell and push-ready notifications. One account syncs saved vehicles, searches, messages and alerts across web, Android and iOS.
            </p>
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Motora",
            url: "https://motora.com",
            description: "India's multi-category vehicle marketplace.",
          }),
        }}
      />
    </>
  );
}
