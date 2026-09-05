/**
 * Seed script (plain node, zero new deps).
 * Usage:  $env:DATABASE_URL="postgresql://..."; node scripts/seed.mjs
 * Inserts catalogue JSON (categories/manufacturers/models/listings/dealers)
 * into Postgres. Safe to re-run (upserts by id/slug).
 */
import postgres from "postgres";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "catalog");
const load = (n) => JSON.parse(readFileSync(join(dir, n), "utf8"));
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Nothing was seeded.");
  process.exit(1);
}
const sql = postgres(url, { prepare: false });

const manufacturers = load("manufacturers.json");
const models = load("models.json");
const variants = load("variants.json");
const listings = load("listings.json");
const dealers = load("dealers.json");

for (const m of manufacturers) {
  await sql`insert into manufacturers (id, slug, name, category_slugs, country, status)
    values (${m.id}, ${m.slug}, ${m.name}, ${sql.json(m.categorySlugs)}, ${m.country}, ${m.status})
    on conflict (id) do update set name = excluded.name, status = excluded.status`;
}
for (const m of models) {
  await sql`insert into vehicle_models (id, slug, manufacturer_id, name, category_slug, body_types, status)
    values (${m.id}, ${m.slug}, ${m.manufacturerId}, ${m.name}, ${m.categorySlug}, ${sql.json(m.bodyTypes)}, ${m.status})
    on conflict (id) do update set name = excluded.name, status = excluded.status`;
}
for (const d of dealers) {
  await sql`insert into dealers (id, slug, business_name, contact_person, phone, email, city, state, address, description, website, whatsapp, verified, status, rating, review_count, opening_hours)
    values (${d.id}, ${d.slug}, ${d.businessName}, ${d.contactPerson}, ${d.phone}, ${d.email}, ${d.city}, ${d.state}, ${d.address}, ${d.description}, ${d.website}, ${d.whatsapp}, ${d.verified}, ${d.status}, ${d.rating}, ${d.reviewCount}, ${d.openingHours})
    on conflict (id) do update set business_name = excluded.business_name, status = excluded.status`;
}
for (const l of listings) {
  await sql`insert into listings (id, slug, title, category_slug, subcategory_slug, manufacturer_id, manufacturer_name, model_id, model_name, variant_id, variant_name, year, price, condition, seller_type, seller_id, seller_name, dealer_id, city, state, locality, kms, fuel, transmission, engine_cc, color, description, media, specs, featured, verified_seller, status, views, saves)
    values (${l.id}, ${l.slug}, ${l.title}, ${l.categorySlug}, ${l.subcategorySlug}, ${l.manufacturerId}, ${l.manufacturerName}, ${l.modelId}, ${l.modelName}, ${l.variantId}, ${l.variantName}, ${l.year}, ${l.price}, ${l.condition}, ${l.sellerType}, ${l.sellerId}, ${l.sellerName}, ${l.dealerId}, ${l.city}, ${l.state}, ${l.locality}, ${l.kms}, ${l.fuel}, ${l.transmission}, ${l.engineCc}, ${l.color}, ${l.description}, ${sql.json(l.media)}, ${sql.json(l.specs)}, ${l.featured}, ${l.verifiedSeller}, ${l.status}, ${l.views}, ${l.saves})
    on conflict (id) do update set price = excluded.price, status = excluded.status`;
}
for (const v of variants) {
  await sql`insert into vehicle_variants (id, slug, model_id, name, year, fuel, transmission, engine_cc, power_ps, price_ex_showroom)
    values (${v.id}, ${v.slug}, ${v.modelId}, ${v.name}, ${v.year}, ${v.fuel}, ${v.transmission}, ${v.engineCc}, ${v.powerPs}, ${v.priceExShowroom})
    on conflict (id) do update set name = excluded.name, price_ex_showroom = excluded.price_ex_showroom`;
}
console.log(`Seeded ${manufacturers.length} manufacturers, ${models.length} models, ${variants.length} variants, ${dealers.length} dealers, ${listings.length} listings.`);
await sql.end();
