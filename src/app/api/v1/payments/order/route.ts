import { NextRequest } from "next/server";
import { fail, ok, rateLimit } from "@/lib/api-utils";
import { currentUser } from "@/lib/auth";
import { sellerPackages } from "@/lib/store";
import { createPaymentOrder } from "@/lib/payments";

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "pay", 20, 60_000)) return fail("Too many attempts.", 429);
  const user = await currentUser();
  if (!user) return fail("Login required.", 401);
  const body = await req.json().catch(() => null);
  const pkg = sellerPackages.find((p) => p.id === body?.packageId);
  if (!pkg) return fail("Unknown package.", 400);
  const order = await createPaymentOrder({ userId: user.id, amount: pkg.price, purpose: `seller-package:${pkg.slug}` });
  return ok(order, { status: 201 });
}
