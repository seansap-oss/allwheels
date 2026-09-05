/**
 * Drizzle ORM schema — canonical Motora relational model.
 * Used with Postgres (Supabase) in production. In development without
 * DATABASE_URL, the service layer (`store.ts`) serves seed data so the
 * site still runs end-to-end.
 */
import {
  pgTable,
  text,
  integer,
  boolean,
  real,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  phone: text("phone"),
  passwordHash: text("password_hash"),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  roles: jsonb("roles").$type<string[]>().notNull().default([]),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  emailVerified: boolean("email_verified").notNull().default(false),
  idVerified: boolean("id_verified").notNull().default(false),
  city: text("city"),
  state: text("state"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default(""),
  sort: integer("sort").notNull().default(0),
});

export const manufacturers = pgTable("manufacturers", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  categorySlugs: jsonb("category_slugs").$type<string[]>().notNull().default([]),
  country: text("country").notNull().default(""),
  status: text("status").notNull().default("ACTIVE"),
});

export const vehicleModels = pgTable("vehicle_models", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  manufacturerId: text("manufacturer_id").notNull(),
  name: text("name").notNull(),
  categorySlug: text("category_slug").notNull(),
  bodyTypes: jsonb("body_types").$type<string[]>().notNull().default([]),
  status: text("status").notNull().default("ACTIVE"),
});

export const vehicleVariants = pgTable("vehicle_variants", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  modelId: text("model_id").notNull(),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  fuel: text("fuel"),
  transmission: text("transmission"),
  engineCc: integer("engine_cc"),
  powerPs: integer("power_ps"),
  priceExShowroom: integer("price_ex_showroom"),
});

export const listings = pgTable("listings", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  categorySlug: text("category_slug").notNull(),
  subcategorySlug: text("subcategory_slug"),
  manufacturerId: text("manufacturer_id"),
  manufacturerName: text("manufacturer_name").notNull(),
  modelId: text("model_id"),
  modelName: text("model_name").notNull(),
  variantId: text("variant_id"),
  variantName: text("variant_name"),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  condition: text("condition").notNull(),
  sellerType: text("seller_type").notNull(),
  sellerId: text("seller_id").notNull(),
  sellerName: text("seller_name").notNull(),
  dealerId: text("dealer_id"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  locality: text("locality"),
  kms: integer("kms"),
  fuel: text("fuel"),
  transmission: text("transmission"),
  engineCc: integer("engine_cc"),
  color: text("color"),
  description: text("description").notNull().default(""),
  media: jsonb("media").$type<unknown[]>().notNull().default([]),
  specs: jsonb("specs").$type<Record<string, unknown>>().notNull().default({}),
  featured: boolean("featured").notNull().default(false),
  verifiedSeller: boolean("verified_seller").notNull().default(false),
  status: text("status").notNull().default("DRAFT"),
  views: integer("views").notNull().default(0),
  saves: integer("saves").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const dealers = pgTable("dealers", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  businessName: text("business_name").notNull(),
  contactPerson: text("contact_person").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  city: text("city").notNull().default(""),
  state: text("state").notNull().default(""),
  address: text("address").notNull().default(""),
  lat: real("lat"),
  lng: real("lng"),
  description: text("description").notNull().default(""),
  website: text("website"),
  whatsapp: text("whatsapp"),
  verified: boolean("verified").notNull().default(false),
  status: text("status").notNull().default("PENDING"),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  openingHours: text("opening_hours").notNull().default(""),
});

export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  listingId: text("listing_id"),
  participantIds: jsonb("participant_ids").$type<string[]>().notNull().default([]),
  lastMessage: text("last_message").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  listingId: text("listing_id"),
  fromUserId: text("from_user_id").notNull(),
  toUserId: text("to_user_id").notNull(),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("INR"),
  purpose: text("purpose").notNull(),
  status: text("status").notNull().default("CREATED"),
  provider: text("provider").notNull().default("RAZORPAY"),
  providerOrderId: text("provider_order_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  link: text("link"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const deviceSubscriptions = pgTable("device_subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  platform: text("platform").notNull(),
  pushProvider: text("push_provider").notNull(),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const savedSearches = pgTable("saved_searches", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  filters: jsonb("filters").$type<Record<string, unknown>>().notNull().default({}),
  notify: text("notify").notNull().default("DAILY"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const favorites = pgTable("favorites", {
  userId: text("user_id").notNull(),
  listingId: text("listing_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  actorId: text("actor_id"),
  action: text("action").notNull(),
  entity: text("entity").notNull().default(""),
  entityId: text("entity_id").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
