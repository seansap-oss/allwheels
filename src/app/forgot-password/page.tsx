import type { Metadata } from "next";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPage() {
  return (
    <Container className="max-w-md py-10">
      <h1 className="text-3xl font-black text-navy-950">Reset password.</h1>
      <p className="mt-1 text-sm text-slate-600">Enter your account email and we&apos;ll send a reset link (email provider configured via EMAIL_PROVIDER_KEY).</p>
      <form action="/api/v1/auth/forgot" method="post" className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-white p-6">
        <label className="grid gap-1 text-sm font-semibold">
          Email
          <input name="email" type="email" required className="h-12 rounded-xl border border-slate-300 px-3 text-[16px] sm:text-sm" />
        </label>
        <button className="h-12 rounded-xl bg-navy-950 font-extrabold text-white">Send reset link</button>
      </form>
    </Container>
  );
}
