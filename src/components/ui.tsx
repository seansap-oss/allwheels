import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function SectionTitle({ kicker, title, sub, action }: { kicker?: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-coral-600">{kicker}</p>
        ) : null}
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">{title}</h2>
        {sub ? <p className="mt-1 max-w-2xl text-sm text-slate-600">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "blue" | "green" | "amber" | "red" | "teal" | "coral" }) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-motora-100 text-motora-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-700",
    teal: "bg-teal-100 text-teal-800",
    coral: "bg-orange-100 text-coral-600",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide", tones[tone])}>
      {children}
    </span>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-motora-50 text-2xl">🔍</div>
      <h3 className="mt-4 text-lg font-bold text-navy-950">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-600">{body}</p>
      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-6 w-1/3 rounded" />
      </div>
    </div>
  );
}
