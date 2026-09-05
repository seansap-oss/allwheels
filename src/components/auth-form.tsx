"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      const r = await fetch(`/api/v1/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          password: fd.get("password"),
          phone: fd.get("phone"),
        }),
      });
      const j = await r.json();
      if (!j.success) {
        setErr(j.error ?? "Something went wrong.");
        return;
      }
      router.push("/profile");
      router.refresh();
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      {mode === "signup" ? (
        <label className="grid gap-1 text-sm font-semibold">
          Full name
          <input name="name" required minLength={2} maxLength={80} placeholder="Your name" autoComplete="name" className="h-12 rounded-xl border border-slate-300 px-3 text-[16px] font-normal sm:text-sm" />
        </label>
      ) : null}
      <label className="grid gap-1 text-sm font-semibold">
        Email
        <input name="email" type="email" required maxLength={120} placeholder="you@example.com" autoComplete="email" className="h-12 rounded-xl border border-slate-300 px-3 text-[16px] font-normal sm:text-sm" />
      </label>
      {mode === "signup" ? (
        <label className="grid gap-1 text-sm font-semibold">
          Phone (India, optional)
          <input name="phone" placeholder="+919800000000" autoComplete="tel" className="h-12 rounded-xl border border-slate-300 px-3 text-[16px] font-normal sm:text-sm" />
        </label>
      ) : null}
      <label className="grid gap-1 text-sm font-semibold">
        Password
        <input name="password" type="password" required minLength={8} placeholder={mode === "signup" ? "Min 8 characters" : "Your password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} className="h-12 rounded-xl border border-slate-300 px-3 text-[16px] font-normal sm:text-sm" />
      </label>
      {err ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{err}</p> : null}
      <button disabled={busy} className="h-12 rounded-xl bg-navy-950 font-extrabold text-white disabled:opacity-60">
        {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
      </button>
      <p className="text-center text-sm text-slate-600">
        {mode === "signup" ? (
          <>Already have an account? <Link href="/login" className="font-bold text-motora-600">Log in</Link></>
        ) : (
          <>New to Motora? <Link href="/signup" className="font-bold text-motora-600">Create account</Link> · <Link href="/forgot-password" className="font-bold text-motora-600">Forgot password?</Link></>
        )}
      </p>
      {mode === "login" ? (
        <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          Demo accounts — admin@motora.com / Admin@123 · seller@motora.com / Seller@123 · dealer@motora.com / Dealer@123
        </p>
      ) : null}
    </form>
  );
}
