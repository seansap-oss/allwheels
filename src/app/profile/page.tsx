import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, SectionTitle } from "@/components/ui";
import { ListingCard } from "@/components/listing-card";
import { currentUser } from "@/lib/auth";
import { allListings, getConversations, getFavorites, getNotifications, getSavedSearches } from "@/lib/store";

export const metadata: Metadata = { title: "My profile" };

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/profile");

  const myAds = allListings().filter((l) => l.sellerId === user.id);
  const favs = getFavorites(user.id);
  const convos = getConversations(user.id);
  const notifs = getNotifications(user.id);
  const searches = getSavedSearches(user.id);
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-black tracking-tight text-navy-950">Hello, {user.name.split(" ")[0]} 👋</h1>
      <p className="mt-1 text-sm text-slate-600">{user.email} · {user.roles.join(" · ")}{unread ? ` · ${unread} unread notifications` : ""}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Active Ads", String(myAds.filter((l) => l.status === "ACTIVE").length)],
          ["Total Views", String(myAds.reduce((a, l) => a + l.views, 0))],
          ["Messages", String(convos.length)],
          ["Saved", String(favs.length)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-2xl font-black text-navy-950">{v}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{k}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/sell" className="flex h-12 items-center rounded-full bg-coral-500 px-6 text-sm font-extrabold text-white">+ Sell a Vehicle</Link>
        <Link href="/messages" className="flex h-12 items-center rounded-full border border-slate-300 bg-white px-6 text-sm font-bold">Messages</Link>
        <Link href="/saved" className="flex h-12 items-center rounded-full border border-slate-300 bg-white px-6 text-sm font-bold">Saved vehicles</Link>
        <Link href="/compare" className="flex h-12 items-center rounded-full border border-slate-300 bg-white px-6 text-sm font-bold">Compare</Link>
        {user.roles.some((r) => ["ADMIN", "SUPER_ADMIN"].includes(r)) ? (
          <Link href="/admin" className="flex h-12 items-center rounded-full bg-navy-950 px-6 text-sm font-extrabold text-white">Admin panel</Link>
        ) : null}
        {user.roles.some((r) => ["DEALER_OWNER", "DEALER_STAFF"].includes(r)) ? (
          <Link href="/dealer/dashboard" className="flex h-12 items-center rounded-full bg-navy-950 px-6 text-sm font-extrabold text-white">Dealer dashboard</Link>
        ) : null}
      </div>

      <section className="mt-10">
        <SectionTitle title="My Ads" sub="Draft · Pending · Active · Sold · Expired · Rejected" />
        {myAds.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">No ads yet. <Link href="/sell" className="font-bold text-motora-600">Create your first listing →</Link></p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {myAds.map((l) => (
              <div key={l.id}>
                <ListingCard l={l} />
                <p className="mt-1 text-xs font-bold text-slate-500">Status: {l.status}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-extrabold">Notifications</h2>
          {notifs.length === 0 ? <p className="mt-2 text-sm text-slate-500">All caught up.</p> : (
            <ul className="mt-2 space-y-2 text-sm">
              {notifs.slice(0, 6).map((n) => (
                <li key={n.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="font-bold">{n.title}</p>
                  <p className="text-slate-600">{n.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-extrabold">Saved searches</h2>
          {searches.length === 0 ? <p className="mt-2 text-sm text-slate-500">Save any search to get instant / daily / weekly alerts.</p> : (
            <ul className="mt-2 space-y-2 text-sm">
              {searches.map((s) => (
                <li key={s.id} className="rounded-xl bg-slate-50 p-3"><span className="font-bold">{s.name}</span> · {s.notify}</li>
              ))}
            </ul>
          )}
          <form action="/api/v1/auth/logout" method="post" className="mt-4">
            <button className="h-11 rounded-xl border border-slate-300 px-5 text-sm font-bold">Log out all devices</button>
          </form>
        </div>
      </section>
    </Container>
  );
}
