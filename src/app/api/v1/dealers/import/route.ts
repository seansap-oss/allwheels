import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { currentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user || !user.roles.some((r) => ["DEALER_OWNER", "DEALER_STAFF", "ADMIN", "SUPER_ADMIN"].includes(r))) {
    return fail("Dealer required.", 403);
  }
  const body = await req.json().catch(() => null);
  return ok({ received: true, rows: Array.isArray(body?.rows) ? body.rows.length : 0 });
}
