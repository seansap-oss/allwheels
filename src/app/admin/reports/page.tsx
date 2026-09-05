import { getReports } from "@/lib/store";

export default function AdminReports() {
  const reports = getReports();
  return (
    <div>
      <h1 className="text-2xl font-black text-navy-950">Reports & moderation tickets</h1>
      {reports.length === 0 ? <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">No reports. Buyer reports (fake, fraud, wrong info, sold, offensive) create tickets here.</p> : (
        <ul className="mt-4 grid gap-2 text-sm">
          {reports.map((r, i) => (
            <li key={i} className="rounded-xl border border-slate-200 bg-white p-3">{JSON.stringify(r)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
