import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { currentUser } from "@/lib/auth";
import { addSavedSearch, getSavedSearches } from "@/lib/store";

export async function GET() {
  const user = await currentUser();
  if (!user) return fail("Login required.", 401);
  return ok(getSavedSearches(user.id));
}

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return fail("Login required.", 401);
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.filters) return fail("name and filters required.", 400);
  const s = addSavedSearch({
    id: `ss-${Date.now()}`,
    userId: user.id,
    name: String(body.name).slice(0, 80),
    filters: body.filters,
    notify: ["INSTANT", "DAILY", "WEEKLY", "OFF"].includes(body.notify) ? body.notify : "DAILY",
    createdAt: new Date().toISOString(),
  });
  return ok(s, { status: 201 });
}
