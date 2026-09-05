import { NextRequest } from "next/server";
import { ok } from "@/lib/api-utils";
import { resolveManufacturerId, vehicleModels } from "@/lib/store";

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
  if (category) list = list.filter((m) => m.categorySlug === category);
  if (status) list = list.filter((m) => m.status === status);
  else list = list.filter((m) => m.status !== "ARCHIVED");
  return ok(list.sort((a, b) => a.name.localeCompare(b.name)));
}
