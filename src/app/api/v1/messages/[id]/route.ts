import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { currentUser } from "@/lib/auth";
import { getConversation, getMessages, markConversationRead } from "@/lib/store";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return fail("Login required.", 401);
  const { id } = await ctx.params;
  const c = getConversation(id);
  if (!c || !c.participantIds.includes(user.id)) return fail("Not found.", 404);
  markConversationRead(id, user.id);
  return ok(getMessages(id));
}
