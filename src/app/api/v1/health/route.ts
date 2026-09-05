import { ok } from "@/lib/api-utils";
import { isDbConfigured } from "@/lib/db";
import { listingCounts } from "@/lib/store";

export async function GET() {
  return ok({ status: "ok", version: "v1", db: isDbConfigured() ? "postgres" : "seed", ...listingCounts(), time: new Date().toISOString() });
}
