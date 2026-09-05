import { siteSettings } from "@/lib/store";

export default function AdminSettings() {
  return (
    <div>
      <h1 className="text-2xl font-black text-navy-950">System settings</h1>
      <p className="mt-1 text-sm text-slate-600">Company, logo, contact, SEO defaults, currency, thresholds, upload limits, gateway keys — no code edits.</p>
      <dl className="mt-4 grid gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
        {Object.entries(siteSettings).map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-slate-100 py-1.5"><dt className="text-slate-500">{k}</dt><dd className="font-bold">{String(v)}</dd></div>
        ))}
      </dl>
    </div>
  );
}
