import { NextRequest } from "next/server";
import { ok } from "@/lib/api-utils";
import { autocomplete } from "@/lib/store";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  return ok(autocomplete(q));
}
