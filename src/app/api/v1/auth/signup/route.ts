import { NextRequest } from "next/server";
import { fail, ok, rateLimit } from "@/lib/api-utils";
import { registerSchema } from "@/lib/validation";
import { registerUser, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "signup", 10, 60_000)) return fail("Too many attempts. Try again later.", 429);
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return fail("Invalid input.", 400, parsed.error.flatten());
  try {
    const { user, token } = await registerUser({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      phone: parsed.data.phone || undefined,
    });
    await setSessionCookie(token);
    return ok({ id: user.id, name: user.name, email: user.email, roles: user.roles }, { status: 201 });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Registration failed.", 400);
  }
}
