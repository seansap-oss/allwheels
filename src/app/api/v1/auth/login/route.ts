import { NextRequest } from "next/server";
import { fail, ok, rateLimit } from "@/lib/api-utils";
import { loginSchema } from "@/lib/validation";
import { authenticateUser, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "login", 20, 60_000)) return fail("Too many attempts. Try again later.", 429);
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return fail("Invalid input.", 400, parsed.error.flatten());
  try {
    const { user, token } = await authenticateUser(parsed.data.email, parsed.data.password);
    await setSessionCookie(token);
    return ok({ id: user.id, name: user.name, email: user.email, roles: user.roles });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Login failed.", 401);
  }
}
