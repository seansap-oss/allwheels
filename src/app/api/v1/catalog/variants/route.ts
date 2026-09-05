import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { getVariantsByModel, resolveModelId } from "@/lib/store";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const model = sp.get("model") ?? sp.get("model_id");
  if (!model) return fail("model or model_id query param required.", 400);
  const id = resolveModelId(model) ?? model;
  return ok(getVariantsByModel(id));
}
