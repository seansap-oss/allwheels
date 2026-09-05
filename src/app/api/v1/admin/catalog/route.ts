import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { currentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user || !user.roles.some((r) => ["ADMIN", "SUPER_ADMIN", "CATALOG_MANAGER"].includes(r))) {
    return fail("Catalog manager required.", 403);
  }
  const body = await req.json().catch(() => null);
  if (!body?.name) return fail("name required.", 400);
  return ok({ received: true, name: body.name }, { status: 201 });
}
