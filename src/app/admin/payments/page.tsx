import { listCreatedOrders } from "@/lib/payments";

export default function AdminPayments() {
  const orders = listCreatedOrders();
  return (
    <div>
      <h1 className="text-2xl font-black text-navy-950">Payments</h1>
      <p className="mt-1 text-sm text-slate-600">Razorpay abstraction · invoices · receipts · refunds · coupons · GST fields. Webhooks at /api/v1/payments/webhook.</p>
      {orders.length === 0 ? <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">No orders yet this session.</p> : (
        <ul className="mt-4 grid gap-2 text-sm">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border border-slate-200 bg-white p-3">{o.id} · ₹{o.amount} · {o.purpose}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
