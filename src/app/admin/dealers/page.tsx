import { getLeads, seedDealers } from "@/lib/store";

export default function AdminDealers() {
  return (
    <div>
      <h1 className="text-2xl font-black text-navy-950">Dealers</h1>
      <ul className="mt-4 grid gap-3">
        {seedDealers.map((d) => (
          <li key={d.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            <p className="font-bold">{d.businessName} <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px]">{d.status}</span></p>
            <p className="text-slate-500">{d.city}, {d.state} · {d.phone}</p>
          </li>
        ))}
      </ul>
      <h2 className="mt-6 text-lg font-black">Sales leads ({getLeads().length})</h2>
      <p className="text-sm text-slate-500">Dealer enquiries from /dealer-enquiry land here as CRM leads.</p>
    </div>
  );
}
