/**
 * Payment provider abstraction. Web/PWA uses Razorpay today; native
 * store billing (Google Play / App Store) plugs in here later without
 * touching UI components.
 */
export interface CreateOrderInput {
  userId: string;
  amount: number; // INR paise? No — rupees (integer) for clarity; convert at gateway edge.
  purpose: string;
}

export interface GatewayOrder {
  provider: "RAZORPAY";
  orderId: string;
  amountPaise: number;
  currency: "INR";
  keyId: string | null; // null when keys not configured (dev mode)
}

const created: { id: string; userId: string; amount: number; purpose: string; status: string; createdAt: string }[] = [];

export async function createPaymentOrder(input: CreateOrderInput): Promise<GatewayOrder> {
  const keyId = process.env.RAZORPAY_KEY_ID ?? null;
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? null;
  const orderId = `order_${Date.now()}`;
  created.unshift({ id: orderId, ...input, status: "CREATED", createdAt: new Date().toISOString() });

  if (keyId && keySecret) {
    // Lazy import so razorpay is optional at runtime.
    const Razorpay = (await import("razorpay")).default;
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({
      amount: Math.round(input.amount * 100),
      currency: "INR",
      receipt: orderId,
      notes: { purpose: input.purpose, userId: input.userId },
    });
    return { provider: "RAZORPAY", orderId: String(order.id), amountPaise: Math.round(input.amount * 100), currency: "INR", keyId };
  }
  // Dev mode: return a synthetic order; checkout page explains test mode.
  return { provider: "RAZORPAY", orderId, amountPaise: Math.round(input.amount * 100), currency: "INR", keyId };
}

export function listCreatedOrders() {
  return [...created];
}
