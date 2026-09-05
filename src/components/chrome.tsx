"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/search?category=cars", label: "Cars" },
  { href: "/search?category=motorcycles", label: "Motorcycles" },
  { href: "/search?category=scooters", label: "Scooters" },
  { href: "/search?category=electric", label: "Electric" },
  { href: "/search?category=commercial", label: "Commercial" },
  { href: "/search?category=bicycles", label: "Bicycles" },
  { href: "/dealers", label: "Dealers" },
  { href: "/research", label: "Research" },
];

export function Header({ userName }: { userName: string | null }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [autoc, setAutoc] = useState<{ makes: { name: string; slug: string }[]; models: { name: string; slug: string }[] } | null>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (q.trim().length < 2) {
      setAutoc(null);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/v1/autocomplete?q=${encodeURIComponent(q)}`);
        const j = await r.json();
        if (j.success) setAutoc(j.data);
      } catch {
        /* offline — ignore */
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/95 text-white backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <button
          className="flex h-11 w-11 items-center justify-center rounded-lg text-2xl lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
        <Link href="/" className="flex items-center gap-2" aria-label="Motora home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-motora-500 via-teal-glow-500 to-coral-500 text-xl font-black">M</span>
          <span className="text-xl font-black tracking-tight">MOTORA</span>
        </Link>
        <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Primary">
          <Link href="/search?category=cars" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">Buy</Link>
          {NAV.slice(0, 7).map((n) => (
            <Link key={n.label} href={n.href} className="rounded-lg px-2 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="relative ml-auto hidden min-w-0 flex-1 max-w-xs md:block">
          <form action="/search" method="get" role="search">
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search make, model, city…"
              className="h-10 w-full rounded-full border border-white/15 bg-white/10 px-4 text-sm placeholder:text-slate-400 focus:border-teal-glow-400 focus:outline-none"
              autoComplete="off"
            />
          </form>
          {autoc ? (
            <div className="absolute inset-x-0 top-11 overflow-hidden rounded-xl bg-white text-navy-950 shadow-xl">
              {autoc.makes.map((m) => (
                <Link key={m.slug} href={`/search?make=${m.slug}`} className="block px-4 py-2 text-sm hover:bg-slate-100">
                  {m.name}
                </Link>
              ))}
              {autoc.models.map((m) => (
                <Link key={m.slug} href={`/search?model=${m.slug}`} className="block px-4 py-2 text-sm hover:bg-slate-100">
                  {m.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
          <Link href="/saved" className="flex h-11 min-w-11 items-center justify-center rounded-lg px-2 text-xl hover:bg-white/10" aria-label="Saved vehicles">♥</Link>
          <Link href="/messages" className="hidden h-11 min-w-11 items-center justify-center rounded-lg px-2 text-xl hover:bg-white/10 sm:flex" aria-label="Messages">✉</Link>
          {userName ? (
            <Link href="/profile" className="hidden h-10 items-center rounded-full bg-white/10 px-4 text-sm font-bold hover:bg-white/20 sm:flex">
              {userName.split(" ")[0]}
            </Link>
          ) : (
            <Link href="/login" className="hidden h-10 items-center rounded-full bg-white/10 px-4 text-sm font-bold hover:bg-white/20 sm:flex">
              Login
            </Link>
          )}
          <Link href="/sell" className="flex h-10 items-center rounded-full bg-coral-500 px-4 text-sm font-extrabold text-white hover:bg-coral-600">
            Sell Vehicle
          </Link>
        </div>
      </div>
      {/* mobile search row */}
      <div className="px-4 pb-2 md:hidden">
        <form action="/search" method="get" role="search">
          <input
            name="q"
            placeholder="Search cars, bikes, EVs, bicycles…"
            className="h-11 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-[16px] placeholder:text-slate-400 focus:border-teal-glow-400 focus:outline-none"
          />
        </form>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-[86vw] max-w-sm flex-col bg-navy-950 p-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-black">MOTORA</span>
              <button aria-label="Close menu" className="flex h-11 w-11 items-center justify-center rounded-lg text-2xl hover:bg-white/10" onClick={() => setOpen(false)}>✕</button>
            </div>
            <nav className="mt-4 flex flex-col gap-1 overflow-y-auto" aria-label="Mobile">
              {[{ href: "/", label: "Home" }, { href: "/sell", label: "Sell Vehicle" }, ...NAV, { href: "/pricing", label: "Pricing" }, { href: "/news", label: "News & Reviews" }, { href: "/contact", label: "Contact" }].map((n) => (
                <Link key={n.href + n.label} href={n.href} className="rounded-xl px-3 py-3 text-base font-semibold hover:bg-white/10">
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex gap-2 pt-4">
              {userName ? (
                <Link href="/profile" className="flex h-12 flex-1 items-center justify-center rounded-xl bg-white/10 font-bold">My Account</Link>
              ) : (
                <Link href="/login" className="flex h-12 flex-1 items-center justify-center rounded-xl bg-white/10 font-bold">Login / Signup</Link>
              )}
              <Link href="/sell" className="flex h-12 flex-1 items-center justify-center rounded-xl bg-coral-500 font-extrabold">Sell</Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const items = [
    { href: "/", label: "Home", icon: "⌂" },
    { href: "/search", label: "Search", icon: "⚲" },
    { href: "/sell", label: "Sell", icon: "＋" },
    { href: "/saved", label: "Saved", icon: "♥" },
    { href: "/profile", label: "Account", icon: "◉" },
  ];
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Mobile bottom navigation"
    >
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href + it.label}
              href={it.href}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-bold ${active ? "text-motora-600" : "text-slate-500"}`}
            >
              <span className="text-xl leading-none">{it.icon}</span>
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-navy-950 pb-24 text-slate-300 md:pb-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div>
          <p className="text-lg font-black text-white">MOTORA</p>
          <p className="mt-2 text-sm text-slate-400">Cars, motorcycles, scooters, EVs, commercial vehicles and bicycles — all in one place.</p>
        </div>
        <nav aria-label="Buy">
          <p className="text-sm font-bold uppercase tracking-wider text-white">Buy</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[["Cars", "/search?category=cars"], ["Motorcycles", "/search?category=motorcycles"], ["Scooters", "/search?category=scooters"], ["Electric", "/search?category=electric"], ["Commercial", "/search?category=commercial"], ["Bicycles", "/search?category=bicycles"]].map(([label, href]) => (
              <li key={href + label}><Link href={href} className="hover:text-white">{label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Sell">
          <p className="text-sm font-bold uppercase tracking-wider text-white">Sell</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/sell" className="hover:text-white">Sell vehicle</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="/dealer-enquiry" className="hover:text-white">Dealer program</Link></li>
          </ul>
        </nav>
        <nav aria-label="Research">
          <p className="text-sm font-bold uppercase tracking-wider text-white">Research</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/research" className="hover:text-white">Research</Link></li>
            <li><Link href="/news" className="hover:text-white">News</Link></li>
            <li><Link href="/reviews" className="hover:text-white">Reviews</Link></li>
          </ul>
        </nav>
        <nav aria-label="Support">
          <p className="text-sm font-bold uppercase tracking-wider text-white">Support</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/safety" className="hover:text-white">Safety</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-slate-400 sm:px-6 lg:px-8">
          <span>© 2026 Motora Technologies Pvt. Ltd. · Made in India</span>
          <span>One backend · One account · Web · PWA · Android · iOS</span>
        </div>
      </div>
    </footer>
  );
}
