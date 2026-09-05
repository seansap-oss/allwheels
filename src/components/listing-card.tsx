"use client";

import Link from "next/link";
import { inr } from "@/lib/utils";
import type { Listing } from "@/lib/types";
import { Badge } from "./ui";

export function priceBadge(l: Listing) {
  if (l.featured) return <Badge tone="coral">Featured</Badge>;
  return null;
}

export function ListingCard({ l }: { l: Listing }) {
  const img = l.media[0]?.thumbUrl ?? "/images/seed/bike-1.svg";
  return (
    <Link
      href={`/vehicle/${l.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={l.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {l.sellerType === "DEALER" ? <Badge tone="blue">Dealer</Badge> : <Badge>Private</Badge>}
          {l.verifiedSeller ? <Badge tone="green">Verified</Badge> : null}
          {l.featured ? <Badge tone="coral">Featured</Badge> : null}
          {l.condition === "NEW" ? <Badge tone="teal">New</Badge> : null}
        </div>
        <button
          aria-label="Save vehicle"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow hover:bg-white"
          onClick={(e) => {
            e.preventDefault();
            fetch(`/api/v1/favorites/${l.id}`, { method: "POST" }).then(() => window.dispatchEvent(new CustomEvent("motora:saved")));
          }}
        >
          ♥
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {l.year} · {l.city}
        </p>
        <h3 className="clamp-2 text-[15px] font-bold leading-snug text-navy-950">{l.title}</h3>
        <p className="text-xs text-slate-500">
          {[l.kms != null ? `${l.kms.toLocaleString("en-IN")} km` : null, l.fuel, l.transmission].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-1 text-xl font-extrabold text-navy-950">{inr(l.price)}</p>
        <span className="mt-2 inline-flex w-fit items-center rounded-lg bg-motora-50 px-3 py-2 text-sm font-bold text-motora-700 group-hover:bg-motora-500 group-hover:text-white">
          View Details →
        </span>
      </div>
    </Link>
  );
}
