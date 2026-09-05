import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

const LINKS: [string, string][] = [
  ["/admin", "Dashboard"],
  ["/admin/listings", "Listings"],
  ["/admin/catalog", "Catalog"],
  ["/admin/catalog/import", "Catalog import"],
  ["/admin/categories", "Categories"],
  ["/admin/users", "Users"],
  ["/admin/dealers", "Dealers"],
  ["/admin/packages", "Packages"],
  ["/admin/payments", "Payments"],
  ["/admin/cms", "CMS"],
  ["/admin/ads", "Advertising"],
  ["/admin/reports", "Reports"],
  ["/admin/settings", "Settings"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user || !user.roles.some((r) => ["ADMIN", "SUPER_ADMIN", "MODERATOR", "CATALOG_MANAGER", "SALES"].includes(r))) {
    redirect("/login?next=/admin");
  }
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Admin">
        <div className="rounded-2xl bg-navy-950 p-4 text-white">
          <p className="px-2 text-xs font-bold uppercase tracking-widest text-slate-400">Motora Admin</p>
          <nav className="no-scrollbar mt-2 flex gap-1 overflow-x-auto lg:flex-col">
            {LINKS.map(([href, label]) => (
              <Link key={href} href={href} className="shrink-0 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/10">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
