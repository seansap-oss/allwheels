import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { ListingCard } from "@/components/listing-card";
import { currentUser } from "@/lib/auth";
import { dealerListings, getLeads, seedDealers } from "@/lib/store";

export const metadata: Metadata = { title: "Dealer dashboard" };

export default async function DealerDashboard() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/dealer/dashboard");
  const isDealer = user.roles.some((r) => ["DEALER_OWNER", "DEALER_STAFF", "ADMIN", "SUPER_ADMIN"].includes(r));
  if (!isDealer) redirect("/dealer-enquiry");

  const dealer = seedDealers[0];
  const inv = dealerListings(dealer.id);
  const views = inv.reduce((a, l) => a + l.views, 0);
  const saves = inv.reduce((a, l) => a + l.saves, 0);

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-black text-navy-950">Dealer dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">{dealer.businessName} · fully usable on phones and tablets.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ["Inventory", String(inv.length)],
          ["Views", views.toLocaleString("en-IN")],
          ["Saves", String(saves)],
          ["Leads", String(getLeads().length)],
          ["Rating", `★ ${dealer.rating}`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-xl font-black text-navy-950">{v}</p>
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{k}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/sell" className="flex h-12 items-center rounded-full bg-coral-500 px-6 text-sm font-extrabold text-white">+ Add vehicle</Link>
        <Link href="/messages" className="flex h-12 items-center rounded-full border border-slate-300 bg-white px-6 text-sm font-bold">Messages</Link>
        <Link href={`/dealer/${dealer.slug}`} className="flex h-12 items-center rounded-full border border-slate-300 bg-white px-6 text-sm font-bold">View microsite</Link>
      </div>

      <h2 className="mt-8 text-xl font-black">Inventory</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {inv.map((l) => (
          <ListingCard key={l.id} l={l} />
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-extrabold">Leads (mini CRM)</h3>
          <p className="mt-1 text-sm text-slate-500">NEW → CONTACTED → QUALIFIED → TEST DRIVE → NEGOTIATING → WON / LOST</p>
          <form action="/api/v1/leads" method="post" className="mt-3 grid gap-2">
            <input type="hidden" name="dealerId" value={dealer.id} />
            <input name="name" required placeholder="Customer name" className="h-11 rounded-xl border border-slate-300 px-3 text-sm" />
            <input name="phone" required placeholder="Customer phone" className="h-11 rounded-xl border border-slate-300 px-3 text-sm" />
            <button className="h-11 rounded-xl bg-navy-950 text-sm font-extrabold text-white">Add test lead</button>
          </form>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-extrabold">Bulk import</h3>
          <p className="mt-1 text-sm text-slate-500">Upload CSV/XLSX with Stock ID, Make, Model, Variant, Year, Price, Odometer… (Dealer API ready).</p>
          <form action="/api/v1/dealers/import" method="post" className="mt-3 grid gap-2">
            <input type="file" accept=".csv,.xlsx,.json" name="file" className="text-sm" />
            <button className="h-11 rounded-xl border border-slate-300 text-sm font-bold">Upload inventory file</button>
          </form>
        </div>
      </div>
    </Container>
  );
}
