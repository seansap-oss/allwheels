import type { Metadata } from "next";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Dealer enquiry" };

export default function DealerEnquiryPage() {
  return (
    <Container className="max-w-2xl py-10">
      <h1 className="text-3xl font-black text-navy-950">Talk to Motora Sales.</h1>
      <p className="mt-1 text-sm text-slate-600">Dealer packages are custom-quoted: listing quota, team accounts, microsite, featured inventory, analytics, leads, bulk import, API, homepage promotion.</p>
      <form action="/api/v1/leads" method="post" className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-white p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-semibold">Dealership name<input name="dealership" required className="h-12 rounded-xl border border-slate-300 px-3 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold">Contact person<input name="name" required className="h-12 rounded-xl border border-slate-300 px-3 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold">Phone<input name="phone" required placeholder="+91…" className="h-12 rounded-xl border border-slate-300 px-3 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold">Email<input name="email" type="email" required className="h-12 rounded-xl border border-slate-300 px-3 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold">Location<input name="location" className="h-12 rounded-xl border border-slate-300 px-3 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold">Stock count<input name="stock" inputMode="numeric" className="h-12 rounded-xl border border-slate-300 px-3 font-normal" /></label>
        </div>
        <label className="grid gap-1 text-sm font-semibold">Message<textarea name="message" rows={3} className="rounded-xl border border-slate-300 p-3 font-normal" /></label>
        <button className="h-12 rounded-xl bg-coral-500 font-extrabold text-white">Talk to Motora Sales</button>
      </form>
    </Container>
  );
}
