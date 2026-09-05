import type { Metadata } from "next";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Report listing" };

export default async function ReportPage({ searchParams }: { searchParams: Promise<{ listing?: string }> }) {
  const { listing } = await searchParams;
  return (
    <Container className="max-w-xl py-10">
      <h1 className="text-3xl font-black text-navy-950">Report listing</h1>
      <p className="mt-1 text-sm text-slate-600">Creates a moderation ticket for our team. Never misuse reports.</p>
      <form action="/api/v1/reports" method="post" className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-white p-6">
        <input type="hidden" name="listingId" value={listing ?? ""} />
        <label className="grid gap-1 text-sm font-semibold">Reason
          <select name="reason" className="h-12 rounded-xl border border-slate-300 px-3 font-normal">
            <option>Fake listing</option>
            <option>Fraud</option>
            <option>Wrong information</option>
            <option>Already sold</option>
            <option>Offensive content</option>
            <option>Dealer misrepresentation</option>
            <option>Other</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">Details<textarea name="details" rows={3} className="rounded-xl border border-slate-300 p-3 font-normal" /></label>
        <button className="h-12 rounded-xl bg-red-600 font-extrabold text-white">Submit report</button>
      </form>
    </Container>
  );
}
