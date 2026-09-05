import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { SellWizard } from "@/components/sell-wizard";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Sell your vehicle" };

export default async function SellPage() {
  const user = await currentUser();
  return (
    <Container className="max-w-3xl py-8">
      <h1 className="text-3xl font-black tracking-tight text-navy-950">Sell your vehicle.</h1>
      <p className="mt-1 text-sm text-slate-600">
        {user ? `Selling as ${user.name}. ` : "You can start now — we'll ask you to log in before publishing. "}12 guided steps, catalogue-powered, mobile-first.
      </p>
      <div className="mt-6">
        <SellWizard />
      </div>
    </Container>
  );
}
