import { ok } from "@/lib/api-utils";
import { categories, manufacturers, vehicleModels } from "@/lib/store";

export async function GET() {
  return ok({ categories, manufacturers, models: vehicleModels });
}
