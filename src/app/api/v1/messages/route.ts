import { NextRequest } from "next/server";
import { fail, ok, rateLimit } from "@/lib/api-utils";
import { messageSchema } from "@/lib/validation";
import { currentUser } from "@/lib/auth";
import { addMessage, ensureConversation, findUserById, getListingById } from "@/lib/store";

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "messages", 30, 60_000)) return fail("Slow down — anti-spam limit.", 429);
  const user = await currentUser();
  if (!user) return fail("Login required.", 401);
  const body = await req.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) return fail("Invalid message.", 400, parsed.error.flatten());
  if (parsed.data.toUserId === user.id) return fail("You cannot message yourself.", 400);
  if (!findUserById(parsed.data.toUserId)) return fail("Recipient not found.", 404);
  if (parsed.data.listingId && !getListingById(parsed.data.listingId)) return fail("Listing not found.", 404);

  const convo = ensureConversation({
    listingId: parsed.data.listingId ?? parsed.data.conversationId ?? null,
    a: user.id,
    b: parsed.data.toUserId,
  });
  const msg = addMessage({
    id: `msg-${Date.now()}`,
    conversationId: parsed.data.conversationId ?? convo.id,
    listingId: parsed.data.listingId ?? convo.listingId,
    fromUserId: user.id,
    toUserId: parsed.data.toUserId,
    body: parsed.data.body,
    createdAt: new Date().toISOString(),
    read: false,
  });
  return ok(msg, { status: 201 });
}
