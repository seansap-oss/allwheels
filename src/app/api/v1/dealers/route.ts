import { ok } from "@/lib/api-utils";
import { seedDealers } from "@/lib/store";

export async function GET() {
  return ok(seedDealers);
}
