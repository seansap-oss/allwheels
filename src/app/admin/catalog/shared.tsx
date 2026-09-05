import { manufacturers, vehicleModels } from "@/lib/store";

function Wrap({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-black text-navy-950">{title}</h1>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm">{children}</div>
    </div>
  );
}

export function ManufacturersPage() {
  return (
    <Wrap title="Manufacturers">
      <form action="/api/v1/admin/catalog" method="post" className="flex flex-wrap gap-2">
        <input name="name" required placeholder="New manufacturer name" className="h-11 flex-1 rounded-xl border border-slate-300 px-3" />
        <button className="h-11 rounded-xl bg-navy-950 px-5 font-bold text-white">Add</button>
      </form>
      <ul className="mt-4 divide-y divide-slate-100">
        {manufacturers.map((m) => (
          <li key={m.id} className="py-2">{m.name} <span className="text-xs text-slate-400">· {m.categorySlugs.join(", ")} · {m.country}</span></li>
        ))}
      </ul>
    </Wrap>
  );
}

export function ModelsPage() {
  return (
    <Wrap title="Models & variants">
      <ul className="divide-y divide-slate-100">
        {vehicleModels.map((m) => (
          <li key={m.id} className="py-2">{m.name} <span className="text-xs text-slate-400">· {m.categorySlug} · {m.status}</span></li>
        ))}
      </ul>
    </Wrap>
  );
}

export function CategoriesPage() {
  return (
    <Wrap title="Categories">
      <p className="text-slate-600">Hierarchical taxonomy with unlimited admin-created subcategories. Dynamic specification definitions per category (e.g. Engine CC for motorcycles, Wheel size for bicycles) are stored as attribute definitions.</p>
    </Wrap>
  );
}
