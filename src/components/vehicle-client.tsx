"use client";

import { useState } from "react";
import Link from "next/link";
import { inr, timeAgo } from "@/lib/utils";
import type { Listing } from "@/lib/types";
import { ListingCard } from "@/components/listing-card";

export function VehicleClient({ l, similar, isFav, pricePosition }: { l: Listing; similar: Listing[]; isFav: boolean; pricePosition: string }) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [fav, setFav] = useState(isFav);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const media = l.media.length > 0 ? l.media : [{ id: "none", url: "/images/seed/bike-1.svg", thumbUrl: "/images/seed/bike-1.svg", kind: "IMAGE" as const, sort: 1 }];
  const cur = media[Math.min(idx, media.length - 1)];

  async function toggleFav() {
    const r = await fetch(`/api/v1/favorites/${l.id}`, { method: "POST" });
    if (r.ok) setFav((v) => !v);
    else window.location.href = "/login";
  }

  async function share() {
    const url = window.location.href;
    const data = { title: l.title, text: `${l.title} — ${inr(l.price)} on Motora`, url };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* dismissed */
      }
    }
    await navigator.clipboard?.writeText(url).catch(() => undefined);
    setMsg("Link copied — share it on WhatsApp, Messages or Email.");
    setTimeout(() => setMsg(""), 3000);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const ta = (e.target as HTMLFormElement).querySelector("textarea");
    const body = ta?.value.trim();
    if (!body) return;
    const r = await fetch("/api/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: l.id, toUserId: l.sellerId, body }),
    });
    if (r.ok) {
      setSent(true);
      if (ta) ta.value = "";
    } else if (r.status === 401) {
      window.location.href = "/login";
    }
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          {/* gallery */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cur.url}
              alt={l.title}
              className="aspect-[4/3] w-full cursor-zoom-in object-cover"
              onClick={() => setLightbox(true)}
            />
          </div>
          <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
            {media.map((m, i) => (
              <button key={m.id} onClick={() => setIdx(i)} aria-label={`Photo ${i + 1}`} className={`h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 ${i === idx ? "border-motora-500" : "border-transparent"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.thumbUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>

          {/* specs */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-extrabold text-navy-950">Overview</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              {[["Year", l.year], ["Make", l.manufacturerName], ["Model", l.modelName], ["Variant", l.variantName ?? "—"], ["Condition", l.condition], ["Kilometres", l.kms != null ? `${l.kms.toLocaleString("en-IN")} km` : "—"], ["Fuel", l.fuel ?? "—"], ["Transmission", l.transmission ?? "—"], ["Engine", l.engineCc ? `${l.engineCc} cc` : "—"], ["Color", l.color ?? "—"], ["Location", `${l.city}, ${l.state}`], ["Listed", timeAgo(l.createdAt)]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{k}</dt>
                  <dd className="mt-0.5 font-bold text-navy-950">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {Object.keys(l.specs).length > 0 ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-extrabold text-navy-950">Specifications</h2>
              <dl className="mt-3 divide-y divide-slate-100 text-sm">
                {Object.entries(l.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="font-semibold text-navy-950">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-extrabold text-navy-950">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{l.description}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={share} className="flex h-11 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold">⤴ Share</button>
            <Link href={`/compare?ids=${l.id}`} className="flex h-11 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold">⇄ Compare</Link>
            <Link href={`/report?listing=${l.id}`} className="flex h-11 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-red-600">⚑ Report</Link>
          </div>
          {msg ? <p className="mt-2 text-sm font-semibold text-teal-700" role="status">{msg}</p> : null}
        </div>

        {/* sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-bold">{l.sellerType}</span>
              {l.verifiedSeller ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-bold text-emerald-700">✓ VERIFIED</span> : null}
              <span className="rounded-full bg-motora-50 px-2.5 py-1 font-bold text-motora-700">{pricePosition}</span>
            </div>
            <h1 className="mt-2 text-xl font-black leading-snug text-navy-950">{l.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{l.city}, {l.state} · {timeAgo(l.createdAt)} · 👁 {l.views} · ♥ {l.saves}</p>
            <p className="mt-3 text-3xl font-black text-navy-950">{inr(l.price)}</p>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
              <p className="font-bold">{l.sellerName}</p>
              <p className="text-slate-500">{l.sellerType === "DEALER" ? "Dealer" : "Private seller"}{l.verifiedSeller ? " · Verified" : ""}</p>
              {l.dealerId ? <Link href={`/dealer/${l.sellerType === "DEALER" ? "" : ""}`} className="hidden" aria-hidden="true" tabIndex={-1}>dealer</Link> : null}
            </div>
            <div className="mt-4 hidden gap-2 lg:grid">
              <button onClick={toggleFav} className={`h-12 rounded-xl font-extrabold ${fav ? "bg-coral-500 text-white" : "border-2 border-coral-500 text-coral-600"}`}>
                {fav ? "♥ Saved" : "♡ Save vehicle"}
              </button>
              <form onSubmit={sendMessage} className="grid gap-2">
                <textarea required minLength={2} maxLength={2000} placeholder="Hi, is this still available?" rows={3} className="rounded-xl border border-slate-300 p-3 text-[16px] lg:text-sm" />
                <button type="submit" className="h-12 rounded-xl bg-navy-950 font-extrabold text-white">Message seller</button>
              </form>
              {sent ? <p className="text-sm font-semibold text-emerald-700" role="status">Message sent! The seller will reply in Messages.</p> : null}
            </div>
            {/* mobile inline contact */}
            <div className="mt-4 grid gap-2 lg:hidden">
              <button onClick={toggleFav} className={`h-12 rounded-xl font-extrabold ${fav ? "bg-coral-500 text-white" : "border-2 border-coral-500 text-coral-600"}`}>
                {fav ? "♥ Saved" : "♡ Save"}
              </button>
              <form onSubmit={sendMessage} className="grid gap-2">
                <textarea required minLength={2} maxLength={2000} placeholder="Message the seller…" rows={2} className="rounded-xl border border-slate-300 p-3 text-[16px]" />
                <button type="submit" className="h-12 rounded-xl bg-navy-950 font-extrabold text-white">Message seller</button>
              </form>
              {sent ? <p className="text-sm font-semibold text-emerald-700" role="status">Message sent!</p> : null}
            </div>
          </div>
        </div>
      </div>

      {/* sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-14 z-40 grid grid-cols-3 gap-2 border-t border-slate-200 bg-white/95 p-2 backdrop-blur lg:hidden" style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <a href={`tel:${encodeURIComponent("+911800000000")}`} className="flex h-12 items-center justify-center rounded-xl bg-navy-950 text-sm font-extrabold text-white">CALL</a>
        <a href="#message" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex h-12 items-center justify-center rounded-xl bg-motora-500 text-sm font-extrabold text-white">MESSAGE</a>
        <a href={`https://wa.me/911800000000?text=${encodeURIComponent(`Hi, I'm interested in ${l.title} on Motora`)}`} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center rounded-xl bg-emerald-600 text-sm font-extrabold text-white">WHATSAPP</a>
      </div>

      {similar.length > 0 ? (
        <section className="mt-10 pb-16 lg:pb-0">
          <h2 className="text-xl font-black text-navy-950">Similar vehicles</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((s) => (
              <ListingCard key={s.id} l={s} />
            ))}
          </div>
        </section>
      ) : null}

      {lightbox ? (
        <div className="fixed inset-0 z-[60] bg-black/95 p-4" role="dialog" aria-modal="true" aria-label="Gallery" onClick={() => setLightbox(false)}>
          <button aria-label="Close gallery" className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl text-white">✕</button>
          <div className="flex h-full flex-col items-center justify-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cur.url} alt={l.title} className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain" />
            <div className="flex gap-2">
              <button aria-label="Previous photo" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl text-white" onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + media.length) % media.length); }}>‹</button>
              <button aria-label="Next photo" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl text-white" onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % media.length); }}>›</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
