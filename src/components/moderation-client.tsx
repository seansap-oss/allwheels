"use client";

import { useState } from "react";
import Link from "next/link";
import type { Listing } from "@/lib/types";

export function ModerationClient({ initial }: { initial: Listing[] }) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState("PENDING");

  async function act(id: string, action: string) {
    const r = await fetch(`/api/v1/admin/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const j = await r.json();
    if (j.success) setItems((prev) => prev.map((l) => (l.id === id ? j.data : l)));
  }

  const shown = items.filter((l) => (filter === "ALL" ? true : l.status === filter));
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {["PENDING", "ACTIVE", "SUSPENDED", "REJECTED", "SOLD", "ALL"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`h-10 rounded-full px-4 text-sm font-bold ${filter === s ? "bg-navy-950 text-white" : "border border-slate-300 bg-white"}`}>
            {s}
          </button>
        ))}
      </div>
      <ul className="mt-4 grid gap-3">
        {shown.map((l) => (
          <li key={l.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/vehicle/${l.slug}`} className="font-bold text-motora-700 hover:underline">{l.title}</Link>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold">{l.status}</span>
              <span className="text-xs text-slate-500">₹{l.price.toLocaleString("en-IN")} · {l.city}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => act(l.id, "approve")} className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white">Approve</button>
              <button onClick={() => act(l.id, "reject")} className="h-10 rounded-lg bg-red-600 px-4 text-sm font-bold text-white">Reject</button>
              <button onClick={() => act(l.id, "suspend")} className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-bold">Suspend</button>
              <button onClick={() => act(l.id, "activate")} className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-bold">Activate</button>
            </div>
          </li>
        ))}
        {shown.length === 0 ? <li className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">Nothing in this queue.</li> : null}
      </ul>
    </div>
  );
}
