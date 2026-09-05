import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container className="py-16 text-center">
      <p className="text-6xl font-black text-navy-950">404</p>
      <h1 className="mt-2 text-2xl font-black">This road leads nowhere.</h1>
      <p className="mt-1 text-sm text-slate-600">The page moved or the dealer subdomain doesn&apos;t exist.</p>
      <div className="mt-5 flex justify-center gap-2">
        <Link href="/" className="flex h-12 items-center rounded-full bg-navy-950 px-6 text-sm font-extrabold text-white">Home</Link>
        <Link href="/search" className="flex h-12 items-center rounded-full border border-slate-300 px-6 text-sm font-bold">Search vehicles</Link>
      </div>
    </Container>
  );
}
