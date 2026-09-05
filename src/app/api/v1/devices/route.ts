import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { currentUser } from "@/lib/auth";

const subs: unknown[] = [];

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return fail("Login required.", 401);
  const body = await req.json().catch(() => null);
  // Supports WebPush subscription objects + future FCM/APNS device tokens.
  if (!body?.token && !body?.endpoint) return fail("token or endpoint required.", 400);
  const sub = {
    id: `dev-${Date.now()}`,
    userId: user.id,
    platform: body.platform ?? "WEB",
    pushProvider: body.pushProvider ?? (body.platform === "IOS" ? "APNS" : body.platform === "ANDROID" ? "FCM" : "WEBPUSH"),
    token: String(body.token ?? body.endpoint),
    createdAt: new Date().toISOString(),
  };
  subs.push(sub);
  return ok(sub, { status: 201 });
}

export async function GET() {
  const user = await currentUser();
  if (!user) return fail("Login required.", 401);
  return ok(subs.filter((s) => (s as { userId: string }).userId === user.id));
}
