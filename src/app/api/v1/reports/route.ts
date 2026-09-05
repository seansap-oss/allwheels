import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { addReport } from "@/lib/store";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  } else {
    const fd = await req.formData().catch(() => null);
    if (fd) fd.forEach((v, k) => { body[k] = String(v); });
  }
  addReport({ ...body, status: "OPEN" });
  if (!ct.includes("application/json")) {
    return new Response(null, { status: 302, headers: { Location: "/search?reported=1" } });
  }
  return ok({ received: true }, { status: 201 });
}
