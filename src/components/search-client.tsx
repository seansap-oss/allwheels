"use client";

import { useState } from "react";
import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { EmptyState } from "@/components/ui";
import { cxRecord } from "@/lib/utils";
import type { Listing } from "@/lib/types";

export interface InitialSearch {
  items: Listing[];
  total: number;
  page: number;
  totalPages: number;
  filters: Record<string, string>;
}

const SORTS: [string, string][] = [
  ["recommended", "Recommended"],
  ["newest", "Newest"],
  ["price_asc", "Price: low to high"],
  ["price_desc", "Price: high to low"],
  ["kms_asc", "Kilometres: low to high"],
  ["year_desc", "Year: newest"],
];

export function SearchClient({ initial }: { initial: InitialSearch }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const f = initial.filters;
  const activeCount = ["q", "make", "model", "city", "minPrice", "maxPrice", "condition", "sellerType", "fuel", "verifiedOnly"].filter(
    (k) => f[k],
  ).length;

  const filterForm = (
    <form action="/search" method="get" className="flex flex-col gap-4">
      <input type="hidden" name="category" value={f.category ?? ""} />
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Keyword
        <input name="q" defaultValue={f.q ?? ""} placeholder="e.g. Classic 350" className="h-12 rounded-xl border border-slate-300 px-3 text-[16px] font-normal sm:text-sm" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Min price
          <input name="minPrice" inputMode="numeric" defaultValue={f.minPrice ?? ""} placeholder="₹" className="h-12 rounded-xl border border-slate-300 px-3 font-normal" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Max price
          <input name="maxPrice" inputMode="numeric" defaultValue={f.maxPrice ?? ""} placeholder="₹" className="h-12 rounded-xl border border-slate-300 px-3 font-normal" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Condition
          <select name="condition" defaultValue={f.condition ?? ""} className="h-12 rounded-xl border border-slate-300 px-2 font-normal">
            <option value="">Any</option>
            <option value="USED">Used</option>
            <option value="NEW">New</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Seller
          <select name="sellerType" defaultValue={f.sellerType ?? ""} className="h-12 rounded-xl border border-slate-300 px-2 font-normal">
            <option value="">Any</option>
            <option value="PRIVATE">Private</option>
            <option value="DEALER">Dealer</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Fuel
          <select name="fuel" defaultValue={f.fuel ?? ""} className="h-12 rounded-xl border border-slate-300 px-2 font-normal">
            <option value="">Any</option>
            {["PETROL", "DIESEL", "CNG", "ELECTRIC", "HYBRID"].map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          City
          <input name="city" defaultValue={f.city ?? ""} placeholder="City" className="h-12 rounded-xl border border-slate-300 px-3 font-normal" />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="verifiedOnly" value="true" defaultChecked={!!f.verifiedOnly} className="h-5 w-5" /> Verified sellers only
      </label>
      <div className="sticky bottom-0 flex gap-2 bg-white py-3">
        <Link href="/search" className="flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-300 font-bold">
          Clear all
        </Link>
        <button type="submit" className="h-12 flex-1 rounded-xl bg-navy-950 font-extrabold text-white">
          Apply{activeCount ? ` (${activeCount})` : ""}
        </button>
      </div>
    </form>
  );

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
      {/* desktop filters */}
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-extrabold text-navy-950">Filters{activeCount ? ` (${activeCount})` : ""}</h2>
          <div className="mt-4">{filterForm}</div>
        </div>
      </aside>

      <div>
        {/* mobile filter/sort bar */}
        <div className="sticky top-16 z-30 -mx-4 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur md:mx-0 lg:static lg:border-0 lg:bg-transparent lg:p-0">
          <div className="flex gap-2">
            <button onClick={() => setSheetOpen(true)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-navy-950 text-sm font-extrabold text-white lg:hidden">
              ⚙ Filters{activeCount ? ` (${activeCount})` : ""}
            </button>
            <form action="/search" method="get" className="flex flex-1 gap-2 lg:justify-end">
              {Object.entries(f).map(([k, v]) =>
                k !== "sort" && v ? <input key={k} type="hidden" name={k} value={v} /> : null,
              )}
              <select name="sort" defaultValue={f.sort ?? "recommended"} onChange={(e) => e.target.form?.requestSubmit()} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold lg:w-56" aria-label="Sort results">
                {SORTS.map(([v, label]) => (
                  <option key={v} value={v}>{label}</option>
                ))}
              </select>
            </form>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-600" role="status">
          {initial.total.toLocaleString("en-IN")} vehicle{initial.total === 1 ? "" : "s"} found
          {f.q ? <> for “<strong>{f.q}</strong>”</> : null}
        </p>

        {initial.items.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No vehicles match your search"
              body="Try clearing filters, expanding the price range, or searching a nearby city. Related models are shown on each vehicle page."
              action={
                <>
                  <Link href="/search" className="flex h-11 items-center rounded-xl bg-navy-950 px-5 text-sm font-bold text-white">Clear filters</Link>
                  <Link href="/research" className="flex h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-bold">Browse research</Link>
                </>
              }
            />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {initial.items.map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
          </div>
        )}

        {initial.totalPages > 1 ? (
          <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
            {Array.from({ length: initial.totalPages }, (_, i) => i + 1).slice(0, 10).map((p) => (
              <Link
                key={p}
                href={`/search${cxRecord({ ...f, page: p })}`}
                aria-current={p === initial.page ? "page" : undefined}
                className={`flex h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-bold ${p === initial.page ? "bg-navy-950 text-white" : "border border-slate-300 bg-white"}`}
              >
                {p}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>

      {/* mobile full-screen filter sheet */}
      {sheetOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 top-10 overflow-y-auto rounded-t-3xl bg-white p-5" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-300" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Filters{activeCount ? ` (${activeCount})` : ""}</h2>
              <button aria-label="Close filters" onClick={() => setSheetOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">✕</button>
            </div>
            {filterForm}
          </div>
        </div>
      ) : null}
    </div>
  );
}
