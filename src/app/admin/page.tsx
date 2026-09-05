import Link from "next/link";
import { allListings, listUsers, seedDealers, getLeads, getReports } from "@/lib/store";

export default function AdminDashboard() {
  const listings = allListings();
  const cards: [string, string, string][] = [
    ["Users", String(listUsers().length), "/admin/users"],
    ["Dealers", String(seedDealers.length), "/admin/dealers"],
    ["Active listings", String(listings.filter((l) => l.status === "ACTIVE").length), "/admin/listings"],
    ["Pending review", String(listings.filter((l) => l.status === "PENDING").length), "/admin/listings"],
    ["Leads", String(getLeads().length), "/admin/dealers"],
    ["Reports", String(getReports().length), "/admin/reports"],
  ];
  return (
    <div>
      <h1 className="text-3xl font-black text-navy-950">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Urgent moderation works on mobile; bulk operations are desktop-optimized.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {cards.map(([k, v, href]) => (
          <Link key={k} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg">
            <p className="text-3xl font-black text-navy-950">{v}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{k}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-extrabold">Listings per category</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {["cars", "motorcycles", "scooters", "commercial", "bicycles"].map((c) => (
            <li key={c} className="flex justify-between border-b border-slate-100 py-1.5">
              <span className="capitalize">{c}</span>
              <strong>{listings.filter((l) => l.categorySlug === c).length}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
