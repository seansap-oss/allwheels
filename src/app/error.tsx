"use client";

import Link from "next/link";
import { Container } from "@/components/ui";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="py-16 text-center">
      <p className="text-6xl font-black text-navy-950">500</p>
      <h1 className="mt-2 text-2xl font-black">Something stalled.</h1>
      <p className="mt-1 text-sm text-slate-600">Try again — your drafts and saved vehicles are safe.</p>
      <div className="mt-5 flex justify-center gap-2">
        <button onClick={reset} className="h-12 rounded-full bg-navy-950 px-6 text-sm font-extrabold text-white">Try again</button>
        <Link href="/" className="flex h-12 items-center rounded-full border border-slate-300 px-6 text-sm font-bold">Home</Link>
      </div>
    </Container>
  );
}
