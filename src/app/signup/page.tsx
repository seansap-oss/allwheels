import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <Container className="max-w-md py-10">
      <h1 className="text-3xl font-black tracking-tight text-navy-950">Join Motora.</h1>
      <p className="mt-1 text-sm text-slate-600">Save vehicles, message sellers, sell your ride.</p>
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <AuthForm mode="signup" />
      </div>
    </Container>
  );
}
