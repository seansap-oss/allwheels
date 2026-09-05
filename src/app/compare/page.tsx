import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { getListingById } from "@/lib/store";
import { inr } from "@/lib/utils";

export const metadata: Metadata = { title: "Compare vehicles" };

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids } = await searchParams;
  const list = (ids ?? "").split(",").map((s) => s.trim()).filter(Boolean).map((id) => getListingById(id)).filter((x) => x != null).slice(0, 4);
  const rows: [string, (l: NonNullable<ReturnType<typeof getListingById>>) => string][] = [
    ["Price", (l) => inr(l.price)],
    ["Year", (l) => String(l.year)],
    ["Kilometres", (l) => (l.kms != null ? `${l.kms.toLocaleString("en-IN")} km` : "—")],
    ["Fuel", (l) => l.fuel ?? "—"],
    ["Transmission", (l) => l.transmission ?? "—"],
    ["Engine", (l) => (l.engineCc ? `${l.engineCc} cc` : "—")],
    ["Seller", (l) => `${l.sellerName} (${l.sellerType})`],
    ["Location", (l) => `${l.city}, ${l.state}`],
  ];
  return (
    <Container className="py-8">
      <h1 className="text-3xl font-black text-navy-950">Compare vehicles</h1>
      <p className="mt-1 text-sm text-slate-600">Add 2–4 vehicles. Differences highlighted. Try: <Link className="font-bold text-motora-600" href="/compare?ids=l1,l5">Classic 350 vs 200 Duke</Link></p>
      {list.length < 2 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
          Open any vehicle and press “Compare”, or <Link href="/search" className="font-bold text-motora-600">browse the marketplace →</Link>
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr>
                <th className="p-4 text-left text-xs uppercase text-slate-500">Spec</th>
                {list.map((l) => (
                  <th key={l.id} className="p-4 text-left"><Link href={`/vehicle/${l.slug}`} className="font-bold text-motora-700 hover:underline">{l.title}</Link></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([k, fn]) => {
                const vals = list.map((l) => fn(l));
                const diff = new Set(vals).size > 1;
                return (
                  <tr key={k} className={`border-t border-slate-100 ${diff ? "bg-amber-50/60" : ""}`}>
                    <td className="p-4 font-bold text-slate-500">{k}</td>
                    {vals.map((v, i) => (
                      <td key={list[i].id} className="p-4 font-semibold">{v}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
