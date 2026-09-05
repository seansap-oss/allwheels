import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { addLead, pushNotification } from "@/lib/store";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  } else {
    const fd = await req.formData().catch(() => null);
    if (fd) fd.forEach((v, k) => { body[k] = String(v); });
  }
  if (!body.name || !body.phone) return fail("name and phone are required.", 400);
  addLead({ ...body, status: "NEW", source: "website" });
  pushNotification({
    id: `n-${Date.now()}`,
    userId: "u-dealer1",
    kind: "DEALER_LEAD",
    title: `New lead: ${String(body.name)}`,
    body: String(body.message ?? body.vehicle ?? "New enquiry"),
    link: "/dealer/dashboard",
    read: false,
    createdAt: new Date().toISOString(),
  });
  if (!(ct.includes("application/json"))) {
    return new Response(null, { status: 302, headers: { Location: "/dealer-enquiry?sent=1" } });
  }
  return ok({ received: true }, { status: 201 });
}
