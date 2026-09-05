import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { currentUser } from "@/lib/auth";
import { getListingById, pushNotification, updateListing } from "@/lib/store";

const TRANSITIONS: Record<string, "APPROVED" | "ACTIVE" | "SUSPENDED" | "REJECTED" | "SOLD" | "EXPIRED"> = {
  approve: "APPROVED",
  activate: "ACTIVE",
  suspend: "SUSPENDED",
  reject: "REJECTED",
  sold: "SOLD",
  expire: "EXPIRED",
};

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user || !user.roles.some((r) => ["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(r))) {
    return fail("Admin required.", 403);
  }
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const next = TRANSITIONS[String(body?.action ?? "")];
  if (!next) return fail("Unknown action.", 400);
  const updated = updateListing(id, { status: next });
  if (!updated) return fail("Listing not found.", 404);
  const seller = getListingById(id);
  if (seller) {
    pushNotification({
      id: `n-${Date.now()}`,
      userId: seller.sellerId,
      kind: next === "APPROVED" || next === "ACTIVE" ? "LISTING_APPROVED" : "LISTING_REJECTED",
      title: next === "APPROVED" || next === "ACTIVE" ? "Your listing is live" : `Listing ${next.toLowerCase()}`,
      body: updated.title,
      link: `/vehicle/${updated.slug}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
  return ok(updated);
}
