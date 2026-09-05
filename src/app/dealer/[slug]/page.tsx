import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { ListingCard } from "@/components/listing-card";
import { dealerListings, getDealerBySlug } from "@/lib/store";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDealerBySlug(slug);
  return { title: d ? `${d.businessName} — dealer in ${d.city}` : "Dealer not found" };
}

export default async function DealerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDealerBySlug(slug);
  if (!d) notFound();
  const inv = dealerListings(d.id);

  return (
    <Container className="py-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="h-36 bg-gradient-to-r from-navy-950 via-motora-700 to-teal-glow-500 sm:h-48" />
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="-mt-12 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl font-black shadow-lg sm:-mt-16 sm:h-24 sm:w-24">{d.businessName[0]}</span>
            <div className="min-w-0">
              <h1 className="flex flex-wrap items-center gap-2 text-2xl font-black text-navy-950 sm:text-3xl">
                {d.businessName}
                {d.verified ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">✓ VERIFIED DEALER</span> : null}
              </h1>
              <p className="text-sm text-slate-500">{d.city}, {d.state} · ★ {d.rating} ({d.reviewCount}) · {d.openingHours}</p>
            </div>
            <div className="ml-auto grid w-full grid-cols-3 gap-2 sm:w-auto sm:grid-cols-3">
              <a href={`tel:${d.phone}`} className="flex h-12 items-center justify-center rounded-xl bg-navy-950 px-4 text-sm font-extrabold text-white">Call</a>
              <a href={`https://wa.me/${d.whatsapp?.replace(/[^0-9]/g, "") ?? ""}`} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-extrabold text-white">WhatsApp</a>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(d.address)}`} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-bold">Directions</a>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm text-slate-600">{d.description}</p>
          <p className="mt-2 text-sm text-slate-500">📍 {d.address}</p>
        </div>
      </div>

      <h2 className="mt-8 text-xl font-black text-navy-950">Inventory ({inv.length})</h2>
      {inv.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">No live vehicles right now — check back soon.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {inv.map((l) => (
            <ListingCard key={l.id} l={l} />
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:grid-cols-2">
        <div>
          <h3 className="font-extrabold">About</h3>
          <p className="mt-1 text-sm text-slate-600">Hours: {d.openingHours}</p>
          {d.website ? <p className="mt-1 text-sm"><a className="font-bold text-motora-600" href={d.website} target="_blank" rel="noreferrer">{d.website}</a></p> : null}
        </div>
        <form action="/api/v1/leads" method="post" className="grid gap-2">
          <h3 className="font-extrabold">Contact dealer</h3>
          <input type="hidden" name="dealerId" value={d.id} />
          <input name="name" required placeholder="Your name" className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-[16px] sm:text-sm" />
          <input name="phone" required placeholder="Phone" className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-[16px] sm:text-sm" />
          <textarea name="message" placeholder="I'm interested in…" rows={2} className="rounded-xl border border-slate-300 bg-white p-3 text-[16px] sm:text-sm" />
          <button className="h-12 rounded-xl bg-navy-950 font-extrabold text-white">Send enquiry</button>
          <p className="text-xs text-slate-500">Also served at <code>{d.slug}.motora.com</code> via wildcard subdomain.</p>
        </form>
      </div>
    </Container>
  );
}
