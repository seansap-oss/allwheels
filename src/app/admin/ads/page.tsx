export default function AdminAds() {
  return (
    <div>
      <h1 className="text-2xl font-black text-navy-950">Advertising</h1>
      <p className="mt-1 text-sm text-slate-600">Placements: homepage banner · search top · search sidebar · listing detail · category page. Targeting by category/location with impressions, clicks, CTR.</p>
      <form action="/api/v1/admin/ads" method="post" className="mt-4 grid gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
        <input name="title" required placeholder="Campaign title" className="h-11 rounded-xl border border-slate-300 px-3" />
        <input name="url" placeholder="Destination URL" className="h-11 rounded-xl border border-slate-300 px-3" />
        <button className="h-11 rounded-xl bg-navy-950 font-bold text-white">Create placement</button>
      </form>
    </div>
  );
}
