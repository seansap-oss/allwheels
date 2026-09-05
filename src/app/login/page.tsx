import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Container className="max-w-md py-10">
      <h1 className="text-3xl font-black tracking-tight text-navy-950">Welcome back.</h1>
      <p className="mt-1 text-sm text-slate-600">One Motora account works on web, PWA, Android and iOS.</p>
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <AuthForm mode="login" />
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">
        Phone + OTP and Google / Apple sign-in plug into the same account system — coming with native apps.
      </p>
    </Container>
  );
}
