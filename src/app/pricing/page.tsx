import type { Metadata } from "next";
import { Container, SectionTitle } from "@/components/ui";
import { sellerPackages } from "@/lib/store";
import { inr } from "@/lib/utils";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <Container className="py-8">
      <SectionTitle kicker="Pricing" title="Simple, admin-configurable pricing" sub="Nothing is hard-coded — every price, threshold and duration is editable in Admin → Packages & Settings." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sellerPackages.filter((p) => p.active).map((p) => (
          <div key={p.id} className={`rounded-3xl border-2 p-6 ${p.featured ? "border-coral-500 bg-orange-50/50" : "border-slate-200 bg-white"}`}>
            <p className="font-extrabold text-navy-950">{p.name}</p>
            <p className="mt-1 text-3xl font-black">{p.price === 0 ? "FREE" : inr(p.price)}</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li>· {p.durationDays} days live</li>
              <li>· {p.maxPhotos} photos{p.videoAllowed ? " + video" : ""}</li>
              {p.featured ? <li>· Featured badge + search boost</li> : <li>· Motora messaging + stats</li>}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-3xl bg-navy-950 p-8 text-white">
        <h2 className="text-xl font-black">Dealer?</h2>
        <p className="mt-1 text-sm text-slate-300">Custom quotas, microsites, leads, bulk import and API access — quoted by our sales team.</p>
        <a href="/dealer-enquiry" className="mt-4 inline-flex h-12 items-center rounded-full bg-coral-500 px-6 text-sm font-extrabold">Contact Motora Sales</a>
      </div>
    </Container>
  );
}
