import { NextRequest } from "next/server";
import { ok } from "@/lib/api-utils";
import { manufacturers, resolveManufacturerId, vehicleModels } from "@/lib/store";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const manufacturer = sp.get("manufacturer") ?? sp.get("manufacturer_id");
  const category = sp.get("category");
  const status = sp.get("status");
  let list = [...vehicleModels];
  if (manufacturer) {
    const id = resolveManufacturerId(manufacturer) ?? manufacturer;
    list = list.filter((m) => m.manufacturerId === id);
  }
  if (category) {
    if (category === "electric") {
      const evMfrs = new Set(
        manufacturers.filter((m) => m.categorySlugs.includes("electric")).map((m) => m.id),
      );
      list = list.filter(
        (m) =>
          evMfrs.has(m.manufacturerId) ||
          m.bodyTypes.some((b) => b.includes("electric")),
      );
    } else {
      list = list.filter((m) => m.categorySlug === category);
    }
  }
  if (status) list = list.filter((m) => m.status === status);
  else list = list.filter((m) => m.status !== "ARCHIVED");
  return ok(list.sort((a, b) => a.name.localeCompare(b.name)));
}
