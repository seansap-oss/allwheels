import { NextRequest } from "next/server";
import { ok } from "@/lib/api-utils";
import { manufacturers } from "@/lib/store";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const status = req.nextUrl.searchParams.get("status");
  let list = [...manufacturers];
  if (category) list = list.filter((m) => m.categorySlugs.includes(category));
  if (status) list = list.filter((m) => m.status === status);
  return ok(list.sort((a, b) => a.name.localeCompare(b.name)));
}
