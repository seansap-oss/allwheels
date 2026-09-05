"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TABS = [
  { id: "cars", label: "Cars" },
  { id: "motorcycles", label: "Motorcycles" },
  { id: "scooters", label: "Scooters" },
  { id: "electric", label: "Electric" },
  { id: "commercial", label: "Commercial" },
  { id: "bicycles", label: "Bicycles" },
] as const;

const MAKES: Record<string, string[]> = {
  cars: ["Mahindra", "Maruti Suzuki", "Hyundai", "Tata", "Toyota", "Kia"],
  motorcycles: ["Royal Enfield", "Hero", "Bajaj", "TVS", "Yamaha", "KTM"],
  scooters: ["Honda Motorcycle", "TVS", "Ola Electric", "Ather", "Yamaha"],
  electric: ["Ola Electric", "Ather", "Tata", "Mahindra"],
  commercial: ["Ashok Leyland", "Tata", "Mahindra"],
  bicycles: ["Hero Cycles", "Firefox", "Rockrider"],
};

const CITIES = ["Imphal", "New Delhi", "Bengaluru", "Mumbai", "Chennai", "Pune", "Jaipur"];

export function HeroSearch({ total }: { total: number }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("cars");
  const [make, setMake] = useState("");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    sp.set("category", tab);
    if (make) sp.set("make", make);
    if (city) sp.set("city", city);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    router.push(`/search?${sp.toString()}`);
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white/95 shadow-2xl backdrop-blur">
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-slate-200 p-2" role="tablist" aria-label="Search categories">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => {
              setTab(t.id);
              setMake("");
            }}
            className={`h-11 shrink-0 rounded-xl px-4 text-sm font-bold ${tab === t.id ? "bg-navy-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <label className="flex flex-col gap-1 text-left">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Make</span>
          <select value={make} onChange={(e) => setMake(e.target.value)} className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-[16px] sm:text-sm">
            <option value="">All makes</option>
            {MAKES[tab].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-left">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Location</span>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-[16px] sm:text-sm">
            <option value="">All India</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-left">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Max price</span>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-[16px] sm:text-sm">
            <option value="">No limit</option>
            <option value="100000">Up to ₹1 Lakh</option>
            <option value="300000">Up to ₹3 Lakh</option>
            <option value="1000000">Up to ₹10 Lakh</option>
            <option value="2500000">Up to ₹25 Lakh</option>
          </select>
        </label>
        <label className="hidden flex-col gap-1 text-left lg:flex">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Condition</span>
          <select name="condition" className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-sm">
            <option value="">New + Used</option>
            <option value="USED">Used</option>
            <option value="NEW">New</option>
          </select>
        </label>
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <button type="submit" className="h-12 w-full rounded-xl bg-coral-500 px-6 text-sm font-extrabold text-white hover:bg-coral-600 lg:w-auto">
            SHOW {total.toLocaleString("en-IN")} VEHICLES
          </button>
        </div>
      </form>
    </div>
  );
}
