import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { CheckoutClient } from "@/components/checkout-client";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <Container className="max-w-xl py-10">
      <h1 className="text-3xl font-black text-navy-950">Checkout.</h1>
      <p className="mt-1 text-sm text-slate-600">Ad payments, premium upgrades, renewals and dealer subscriptions via the payment abstraction.</p>
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
        <CheckoutClient />
      </div>
    </Container>
  );
}
