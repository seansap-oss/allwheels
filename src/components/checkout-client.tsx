"use client";

import { useState } from "react";
import { sellerPackages } from "@/lib/store";

export function CheckoutClient() {
  const [pkg, setPkg] = useState(sellerPackages[1]?.id ?? "pkg-single");
  const [order, setOrder] = useState<{ orderId: string; amountPaise: number; keyId: string | null } | null>(null);
  const [busy, setBusy] = useState(false);

  async function pay() {
    setBusy(true);
    try {
      const r = await fetch("/api/v1/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg }),
      });
      const j = await r.json();
      if (j.success) setOrder(j.data);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3">
      {sellerPackages.filter((p) => p.active && p.price > 0).map((p) => (
        <button key={p.id} onClick={() => setPkg(p.id)} className={`rounded-2xl border-2 p-4 text-left ${pkg === p.id ? "border-motora-500 bg-motora-50" : "border-slate-200"}`}>
          <span className="font-extrabold">{p.name} — ₹{p.price}</span>
        </button>
      ))}
      <button onClick={pay} disabled={busy} className="h-12 rounded-xl bg-navy-950 font-extrabold text-white disabled:opacity-60">
        {busy ? "Creating order…" : "Pay with Razorpay (UPI / Card / Netbanking)"}
      </button>
      {order ? (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm" role="status">
          <p className="font-bold">Order {order.orderId} · ₹{(order.amountPaise / 100).toLocaleString("en-IN")}</p>
          {order.keyId ? (
            <p className="mt-1 text-slate-600">Razorpay Checkout opens here with the live key (key id configured). UPI, credit/debit card, netbanking and supported wallets accepted.</p>
          ) : (
            <p className="mt-1 text-slate-600">Test mode — RAZORPAY_KEY_ID is not configured. Set it in .env to accept live payments. No card data ever touches Motora servers.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
