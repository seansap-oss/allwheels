import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionTitle } from "@/components/ui";
import { seedDealers } from "@/lib/store";

export const metadata: Metadata = { title: "Dealers" };

export default function DealersPage() {
  return (
    <Container className="py-8">
      <SectionTitle kicker="Network" title="Motora dealers" sub="Verified dealers with microsites, live inventory and lead management." action={<Link href="/dealer-enquiry" className="flex h-11 items-center rounded-full bg-coral-500 px-5 text-sm font-extrabold text-white">Become a dealer</Link>} />
      <div className="grid gap-4 md:grid-cols-2">
        {seedDealers.map((d) => (
          <Link key={d.id} href={`/dealer/${d.slug}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-motora-500 to-teal-glow-500 text-2xl font-black text-white">{d.businessName[0]}</span>
              <div>
                <p className="font-extrabold text-navy-950">{d.businessName} {d.verified ? <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">✓ VERIFIED</span> : null}</p>
                <p className="text-sm text-slate-500">{d.city}, {d.state} · ★ {d.rating} ({d.reviewCount} reviews)</p>
              </div>
            </div>
            <p className="clamp-2 mt-3 text-sm text-slate-600">{d.description}</p>
            <p className="mt-2 text-sm font-bold text-motora-600">View microsite →</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
