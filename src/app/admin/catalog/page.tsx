import Link from "next/link";
import { categories, manufacturers, vehicleModels } from "@/lib/store";

export default function AdminCatalog() {
  return (
    <div>
      <h1 className="text-2xl font-black text-navy-950">Catalogue engine</h1>
      <p className="mb-4 mt-1 text-sm text-slate-600">Unlimited categories, brands, models and variants — no code changes needed.</p>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-extrabold">Manufacturers ({manufacturers.length})</h2>
          <ul className="mt-2 max-h-72 space-y-1 overflow-y-auto text-sm">
            {manufacturers.map((m) => (
              <li key={m.id} className="flex justify-between border-b border-slate-100 py-1"><span>{m.name}</span><span className="text-xs text-slate-400">{m.status}</span></li>
            ))}
          </ul>
          <Link href="/admin/catalog/import" className="mt-3 inline-block text-sm font-bold text-motora-600">Bulk import →</Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-extrabold">Models ({vehicleModels.length})</h2>
          <ul className="mt-2 max-h-72 space-y-1 overflow-y-auto text-sm">
            {vehicleModels.map((m) => (
              <li key={m.id} className="flex justify-between border-b border-slate-100 py-1"><span>{m.name}</span><span className="text-xs text-slate-400">{m.status}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-extrabold">Categories ({categories.length})</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {categories.map((c) => (
              <li key={c.id} className="border-b border-slate-100 py-1">{c.name} <span className="text-xs text-slate-400">· {c.subcategories.length} sub</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
