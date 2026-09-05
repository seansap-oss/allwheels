import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { currentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user || !user.roles.some((r) => ["ADMIN", "SUPER_ADMIN", "SALES"].includes(r))) {
    return fail("Admin required.", 403);
  }
  const body = await req.json().catch(() => null);
  if (!body?.title) return fail("title required.", 400);
  return ok({ received: true }, { status: 201 });
}
