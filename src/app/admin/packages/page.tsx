import { sellerPackages, siteSettings } from "@/lib/store";

export default function AdminPackages() {
  return (
    <div>
      <h1 className="text-2xl font-black text-navy-950">Packages & pricing</h1>
      <p className="mt-1 text-sm text-slate-600">All pricing is database-driven. Free threshold: ₹{siteSettings.freeListingThreshold.toLocaleString("en-IN")} · {siteSettings.freeListingsPerUser} free per user · {siteSettings.listingDurationDays} days.</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {sellerPackages.map((p) => (
          <li key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            <p className="font-bold">{p.name} — {p.price === 0 ? "FREE" : `₹${p.price}`}</p>
            <p className="text-slate-500">{p.durationDays}d · {p.maxPhotos} photos{p.videoAllowed ? " · video" : ""}{p.featured ? " · featured" : ""}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
