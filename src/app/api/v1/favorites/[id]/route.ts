import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { currentUser } from "@/lib/auth";
import { getListingById, isFavorite, toggleFavorite } from "@/lib/store";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return fail("Login required.", 401);
  const { id } = await ctx.params;
  if (!getListingById(id)) return fail("Listing not found.", 404);
  const saved = toggleFavorite(user.id, id);
  return ok({ saved, favorite: isFavorite(user.id, id) });
}
