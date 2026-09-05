import { ok } from "@/lib/api-utils";
import { categories } from "@/lib/store";

export async function GET() {
  return ok(categories);
}
