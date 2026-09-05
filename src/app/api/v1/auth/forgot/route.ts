import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  if (!email.includes("@")) return fail("Enter a valid email.", 400);
  // Production: send reset link via configured email provider.
  return ok({ sent: true, message: "If this email exists, a reset link was sent." });
}
