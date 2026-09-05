import { ok } from "@/lib/api-utils";
import { catalogStats, categories, manufacturers, vehicleModels, vehicleVariants } from "@/lib/store";

export async function GET() {
  return ok({ categories, manufacturers, models: vehicleModels, variants: vehicleVariants, stats: catalogStats() });
}
