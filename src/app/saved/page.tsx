import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, SectionTitle } from "@/components/ui";
import { ListingCard } from "@/components/listing-card";
import { currentUser } from "@/lib/auth";
import { getFavorites } from "@/lib/store";

export const metadata: Metadata = { title: "Saved vehicles" };

export default async function SavedPage() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/saved");
  const favs = getFavorites(user.id);
  return (
    <Container className="py-8">
      <SectionTitle title="Saved vehicles" sub="Synced to your account — visible on web, PWA, Android and iOS." />
      {favs.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
          Nothing saved yet. Tap ♥ on any listing. <Link href="/search" className="font-bold text-motora-600">Browse vehicles →</Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {favs.map((l) => (
            <ListingCard key={l.id} l={l} />
          ))}
        </div>
      )}
    </Container>
  );
}
