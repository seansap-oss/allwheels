"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const TABS = [
  { id: "cars", label: "Cars" },
  { id: "motorcycles", label: "Motorcycles" },
  { id: "scooters", label: "Scooters" },
  { id: "electric", label: "Electric" },
  { id: "commercial", label: "Commercial" },
  { id: "bicycles", label: "Bicycles" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const CITIES = ["Imphal", "New Delhi", "Bengaluru", "Mumbai", "Chennai", "Pune", "Jaipur", "Kochi", "Guwahati"];

interface MakeOpt { slug: string; name: string }
interface ModelOpt { slug: string; name: string; bodyTypes: string[] }

export function prettyBody(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

/** carsales-style Quick Search: Make -> Model -> Body Type cascade with live count. */
export function HeroSearch({ total }: { total: number }) {
  const [tab, setTab] = useState<TabId>("cars");
  const [makes, setMakes] = useState<MakeOpt[]>([]);
  const [models, setModels] = useState<ModelOpt[]>([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const router = useRouter();

  // All makes for the active tab — the Make box always lists every name.
  useEffect(() => {
    setMake("");
    setModel("");
    setBodyType("");
    setModels([]);
    fetch(`/api/v1/catalog/manufacturers?category=${tab}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setMakes(j.data.map((m: MakeOpt) => ({ slug: m.slug, name: m.name })));
      })
      .catch(() => undefined);
  }, [tab]);

  // Selecting a Make brings up all its Models.
  useEffect(() => {
    setModel("");
    setBodyType("");
    if (!make) {
      setModels([]);
      return;
    }
    fetch(`/api/v1/catalog/models?manufacturer=${make}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setModels(j.data);
      })
      .catch(() => undefined);
  }, [make]);

  // Body types follow the selected Make (or all models in the tab).
  const bodyTypes = useMemo(() => {
    const set = new Set<string>();
    for (const m of models) for (const b of m.bodyTypes ?? []) set.add(b);
    return [...set].sort();
  }, [models]);

  const [tabBodyTypes, setTabBodyTypes] = useState<string[]>([]);
  useEffect(() => {
    if (make) {
      setTabBodyTypes([]);
      return;
    }
    fetch(`/api/v1/catalog/models?category=${tab}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          const set = new Set<string>();
          for (const m of j.data as ModelOpt[]) for (const b of m.bodyTypes ?? []) set.add(b);
          setTabBodyTypes([...set].sort());
        }
      })
      .catch(() => undefined);
  }, [tab, make]);

  const visibleBodyTypes = make ? bodyTypes : tabBodyTypes;

  // Live "Show N vehicles" count, debounced.
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const sp = new URLSearchParams({ category: tab, perPage: "1" });
        if (make) sp.set("make", make);
        if (model) sp.set("model", model);
        if (bodyType) sp.set("bodyType", bodyType);
        if (city) sp.set("city", city);
        if (condition) sp.set("condition", condition);
        if (minPrice) sp.set("minPrice", minPrice);
        if (maxPrice) sp.set("maxPrice", maxPrice);
        const r = await fetch(`/api/v1/search?${sp.toString()}`);
        const j = await r.json();
        if (j.success) setCount(j.data.total);
      } catch {
        /* offline — keep static total */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [tab, make, model, bodyType, city, condition, minPrice, maxPrice]);

  function clearAll() {
    setMake("");
    setModel("");
    setBodyType("");
    setCity("");
    setCondition("");
    setMinPrice("");
    setMaxPrice("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    sp.set("category", tab);
    if (make) sp.set("make", make);
    if (model) sp.set("model", model);
    if (bodyType) sp.set("bodyType", bodyType);
    if (city) sp.set("city", city);
    if (condition) sp.set("condition", condition);
    if (minPrice) sp.set("minPrice", minPrice);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    router.push(`/search?${sp.toString()}`);
  }

  const shown = count ?? total;
  const selectCls =
    "h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-[16px] text-navy-950 sm:text-sm disabled:bg-slate-100 disabled:text-slate-400";

  return (
    <div className="overflow-hidden rounded-2xl bg-white text-navy-950 shadow-2xl">
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 p-2" role="tablist" aria-label="Search categories">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`h-11 shrink-0 rounded-xl px-4 text-sm font-bold ${tab === t.id ? "bg-navy-950 text-white" : "text-slate-600 hover:bg-slate-200"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="p-4 sm:p-5">
        <p className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Quick search</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Make</span>
            <select value={make} onChange={(e) => setMake(e.target.value)} className={selectCls}>
              <option value="">All makes ({makes.length})</option>
              {makes.map((m) => (
                <option key={m.slug} value={m.slug}>{m.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Model</span>
            <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make} className={selectCls}>
              <option value="">{make ? `All ${models.length} models` : "Select a make first"}</option>
              {models.map((m) => (
                <option key={m.slug} value={m.slug}>{m.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Body type</span>
            <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} className={selectCls}>
              <option value="">All body types</option>
              {visibleBodyTypes.map((b) => (
                <option key={b} value={b}>{prettyBody(b)}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Location</span>
            <select value={city} onChange={(e) => setCity(e.target.value)} className={selectCls}>
              <option value="">All India</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_auto]">
          <div className="flex overflow-hidden rounded-xl border border-slate-300" role="group" aria-label="Condition">
            {[
              ["", "New + Used"],
              ["USED", "Used"],
              ["NEW", "New"],
            ].map(([v, label]) => (
              <button
                key={label}
                type="button"
                aria-pressed={condition === v}
                onClick={() => setCondition(v)}
                className={`h-12 flex-1 px-4 text-sm font-bold lg:flex-none ${condition === v ? "bg-navy-950 text-white" : "bg-white text-slate-600"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2">
            <span className="sr-only">Price min</span>
            <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} inputMode="numeric" placeholder="Price min ₹" className="h-12 w-full rounded-xl border border-slate-300 px-3 text-[16px] sm:text-sm" />
          </label>
          <label className="flex items-center gap-2">
            <span className="sr-only">Price max</span>
            <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} inputMode="numeric" placeholder="Price max ₹" className="h-12 w-full rounded-xl border border-slate-300 px-3 text-[16px] sm:text-sm" />
          </label>
          <button type="button" onClick={clearAll} className="h-12 rounded-xl px-4 text-sm font-bold text-slate-500 hover:text-navy-950">
            Clear all
          </button>
        </div>
        <button type="submit" className="mt-4 h-14 w-full rounded-xl bg-coral-500 text-base font-black uppercase tracking-wide text-white hover:bg-coral-600">
          Show {shown.toLocaleString("en-IN")} {tab === "cars" ? "cars" : "vehicles"}
        </button>
      </form>
    </div>
  );
}
