import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { pushNotification } from "@/lib/store";

/** Razorpay webhook receiver — verify signature with RAZORPAY_WEBHOOK_SECRET. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return fail("Bad payload.", 400);
  // TODO: verify HMAC signature header x-razorpay-signature in production.
  if (body.event === "payment.captured") {
    pushNotification({
      id: `n-${Date.now()}`,
      userId: String(body?.payload?.notes?.userId ?? "u-seller1"),
      kind: "PAYMENT_CONFIRMATION",
      title: "Payment confirmed",
      body: "Your Motora package payment was received.",
      link: "/profile",
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
  return ok({ received: true });
}
