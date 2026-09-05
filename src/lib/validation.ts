import { z } from "zod";

export const searchFilterSchema = z.object({
  q: z.string().max(120).optional(),
  category: z.string().max(40).optional(),
  make: z.string().max(60).optional(),
  model: z.string().max(80).optional(),
  city: z.string().max(60).optional(),
  state: z.string().max(60).optional(),
  minPrice: z.coerce.number().int().min(0).max(100000000).optional(),
  maxPrice: z.coerce.number().int().min(0).max(100000000).optional(),
  minYear: z.coerce.number().int().min(1980).max(2035).optional(),
  maxYear: z.coerce.number().int().min(1980).max(2035).optional(),
  condition: z.enum(["NEW", "USED"]).optional(),
  sellerType: z.enum(["PRIVATE", "DEALER"]).optional(),
  fuel: z
    .enum(["PETROL", "DIESEL", "CNG", "LPG", "ELECTRIC", "HYBRID", "OTHER"])
    .optional(),
  transmission: z.enum(["MANUAL", "AUTOMATIC", "CVT", "OTHER"]).optional(),
  bodyType: z.string().max(40).optional(),
  color: z.string().max(30).optional(),
  maxKms: z.coerce.number().int().min(0).max(2000000).optional(),
  verifiedOnly: z.coerce.boolean().optional(),
  photosOnly: z.coerce.boolean().optional(),
  sort: z
    .enum([
      "recommended",
      "newest",
      "oldest",
      "price_asc",
      "price_desc",
      "kms_asc",
      "year_desc",
    ])
    .optional(),
  page: z.coerce.number().int().min(1).max(500).default(1),
  perPage: z.coerce.number().int().min(1).max(48).default(24),
});

export const listingCreateSchema = z.object({
  categorySlug: z.string().min(2).max(40),
  manufacturerName: z.string().min(1).max(80),
  modelName: z.string().min(1).max(80),
  variantName: z.string().max(80).optional().default(""),
  year: z.number().int().min(1980).max(2035),
  price: z.number().int().min(0).max(100000000),
  condition: z.enum(["NEW", "USED"]),
  city: z.string().min(1).max(60),
  state: z.string().min(1).max(60),
  kms: z.number().int().min(0).max(2000000).nullable().optional(),
  fuel: z
    .enum(["PETROL", "DIESEL", "CNG", "LPG", "ELECTRIC", "HYBRID", "OTHER"])
    .nullable()
    .optional(),
  transmission: z
    .enum(["MANUAL", "AUTOMATIC", "CVT", "OTHER"])
    .nullable()
    .optional(),
  engineCc: z.number().int().min(0).max(10000).nullable().optional(),
  color: z.string().max(30).nullable().optional(),
  description: z.string().min(10).max(5000),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  password: z.string().min(8).max(100),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(1).max(100),
});

export const messageSchema = z.object({
  conversationId: z.string().min(1).max(60).optional(),
  listingId: z.string().min(1).max(60).nullable().optional(),
  toUserId: z.string().min(1).max(60),
  body: z.string().min(1).max(2000),
});

export const catalogImportRowSchema = z.object({
  category: z.string().min(1),
  subcategory: z.string().optional().default(""),
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  variant: z.string().optional().default(""),
  model_year: z.coerce.number().int().min(1980).max(2035).optional(),
  body_type: z.string().optional().default(""),
  engine_cc: z.coerce.number().optional(),
  fuel_type: z.string().optional().default(""),
  transmission: z.string().optional().default(""),
  price_ex_showroom: z.coerce.number().optional(),
  status: z
    .enum(["ACTIVE", "DISCONTINUED", "UPCOMING", "ARCHIVED"])
    .optional()
    .default("ACTIVE"),
});

export type SearchFilterInput = z.infer<typeof searchFilterSchema>;
