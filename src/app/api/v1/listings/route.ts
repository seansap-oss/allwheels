import { NextRequest } from "next/server";
import { fail, ok, paginate, rateLimit } from "@/lib/api-utils";
import { listingCreateSchema, searchFilterSchema } from "@/lib/validation";
import { activeListings, addListing, searchListings } from "@/lib/store";
import { currentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const obj: Record<string, string> = {};
  sp.forEach((v, k) => {
    obj[k] = v;
  });
  const parsed = searchFilterSchema.safeParse(obj);
  if (!parsed.success) return fail("Invalid filters.", 400, parsed.error.flatten());
  const r = searchListings(parsed.data);
  return ok({ items: r.items, ...paginate(r.total, r.page, r.perPage) });
}

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "listing-create", 15, 60_000)) return fail("Too many attempts. Slow down.", 429);
  const user = await currentUser();
  if (!user) return fail("Login required.", 401);
  const body = await req.json().catch(() => null);
  const parsed = listingCreateSchema.safeParse(body);
  if (!parsed.success) return fail("Invalid listing.", 400, parsed.error.flatten());
  const d = parsed.data;
  const id = `l-${Date.now()}`;
  const listing = addListing({
    id,
    slug: slugify(`${d.year}-${d.manufacturerName}-${d.modelName}-${d.city}-${Date.now().toString().slice(-5)}`),
    title: `${d.year} ${d.manufacturerName} ${d.modelName}${d.variantName ? ` ${d.variantName}` : ""}`,
    categorySlug: d.categorySlug,
    subcategorySlug: null,
    manufacturerId: null,
    manufacturerName: d.manufacturerName,
    modelId: null,
    modelName: d.modelName,
    variantId: null,
    variantName: d.variantName || null,
    year: d.year,
    price: d.price,
    condition: d.condition,
    sellerType: user.roles.includes("DEALER_OWNER") ? "DEALER" : "PRIVATE",
    sellerId: user.id,
    sellerName: user.name,
    dealerId: null,
    city: d.city,
    state: d.state,
    locality: null,
    kms: d.kms ?? null,
    fuel: d.fuel ?? null,
    transmission: d.transmission ?? null,
    engineCc: d.engineCc ?? null,
    color: d.color ?? null,
    description: d.description,
    media: [],
    featured: false,
    verifiedSeller: user.idVerified,
    status: "PENDING",
    views: 0,
    saves: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specs: {},
  });
  void activeListings;
  return ok(listing, { status: 201 });
}
