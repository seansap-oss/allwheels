export default function AdminCms() {
  return (
    <div>
      <h1 className="text-2xl font-black text-navy-950">CMS</h1>
      <p className="mt-1 text-sm text-slate-600">Hero heading, subheading, background, CTAs, homepage sections (featured, popular, EV, bicycles, dealers, guides, banners) — create, edit, reorder, hide, delete. Footer columns editable.</p>
      <div className="mt-4 grid gap-2 text-sm">
        {["Hero Search", "Browse by Category", "Popular Cars", "Popular Motorcycles", "Electric Mobility", "Latest Listings", "Featured Dealers", "Popular Brands", "Sell Your Vehicle", "Research & Guides", "Download App", "Footer"].map((s) => (
          <div key={s} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"><span className="font-bold">{s}</span><span className="text-xs text-emerald-700">● Visible</span></div>
        ))}
      </div>
    </div>
  );
}
