import { NextRequest } from "next/server";
import { fail, ok, paginate } from "@/lib/api-utils";
import { searchFilterSchema } from "@/lib/validation";
import { searchListings } from "@/lib/store";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const obj: Record<string, string> = {};
  sp.forEach((v, k) => {
    obj[k] = v;
  });
  const parsed = searchFilterSchema.safeParse(obj);
  if (!parsed.success) return fail("Invalid filters.", 400, parsed.error.flatten());
  const r = searchListings(parsed.data);
  return ok({ items: r.items, ...paginate(r.total, r.page, r.perPage) });
}
