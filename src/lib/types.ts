/**
 * Shared Motora platform types.
 * These are the canonical cross-client contracts for Web, PWA,
 * and future Android / iOS apps. Keep them platform-independent:
 * no DOM, no React, no Next.js imports here.
 */

export type Role =
  | "USER"
  | "SELLER"
  | "DEALER_OWNER"
  | "DEALER_STAFF"
  | "MODERATOR"
  | "CATALOG_MANAGER"
  | "SALES"
  | "ADMIN"
  | "SUPER_ADMIN";

export type ListingStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "SUSPENDED"
  | "REJECTED"
  | "SOLD"
  | "EXPIRED"
  | "DELETED";

export type SellerType = "PRIVATE" | "DEALER";
export type Condition = "NEW" | "USED";
export type FuelType =
  | "PETROL"
  | "DIESEL"
  | "CNG"
  | "LPG"
  | "ELECTRIC"
  | "HYBRID"
  | "OTHER";
export type Transmission = "MANUAL" | "AUTOMATIC" | "CVT" | "OTHER";

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  avatarUrl: string | null;
  roles: Role[];
  phoneVerified: boolean;
  emailVerified: boolean;
  idVerified: boolean;
  city: string | null;
  state: string | null;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  sort: number;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
}

export interface Manufacturer {
  id: string;
  slug: string;
  name: string;
  categorySlugs: string[];
  country: string;
  logoUrl: string | null;
  status: "ACTIVE" | "ARCHIVED";
}

export interface VehicleModel {
  id: string;
  slug: string;
  manufacturerId: string;
  name: string;
  categorySlug: string;
  bodyTypes: string[];
  status: "ACTIVE" | "DISCONTINUED" | "UPCOMING" | "ARCHIVED";
}

export interface VehicleVariant {
  id: string;
  slug: string;
  modelId: string;
  name: string;
  year: number;
  fuel: FuelType | null;
  transmission: Transmission | null;
  engineCc: number | null;
  powerPs: number | null;
  priceExShowroom: number | null;
}

export interface ListingMedia {
  id: string;
  url: string;
  thumbUrl: string;
  kind: "IMAGE" | "VIDEO";
  sort: number;
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  subcategorySlug: string | null;
  manufacturerId: string | null;
  manufacturerName: string;
  modelId: string | null;
  modelName: string;
  variantId: string | null;
  variantName: string | null;
  year: number;
  price: number;
  condition: Condition;
  sellerType: SellerType;
  sellerId: string;
  sellerName: string;
  dealerId: string | null;
  city: string;
  state: string;
  locality: string | null;
  kms: number | null;
  fuel: FuelType | null;
  transmission: Transmission | null;
  engineCc: number | null;
  color: string | null;
  description: string;
  media: ListingMedia[];
  featured: boolean;
  verifiedSeller: boolean;
  status: ListingStatus;
  views: number;
  saves: number;
  createdAt: string;
  updatedAt: string;
  specs: Record<string, string | number | boolean | null>;
}

export interface Dealer {
  id: string;
  slug: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  address: string;
  lat: number | null;
  lng: number | null;
  logoUrl: string | null;
  coverUrl: string | null;
  description: string;
  website: string | null;
  whatsapp: string | null;
  verified: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  rating: number;
  reviewCount: number;
  openingHours: string;
}

export interface Message {
  id: string;
  conversationId: string;
  listingId: string | null;
  fromUserId: string;
  toUserId: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  listingId: string | null;
  listingTitle: string | null;
  participantIds: string[];
  lastMessage: string;
  updatedAt: string;
  unreadFor: string[];
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: "INR";
  purpose: string;
  status: "CREATED" | "PAID" | "FAILED" | "REFUNDED";
  provider: "RAZORPAY";
  providerOrderId: string | null;
  createdAt: string;
}

export type NotificationKind =
  | "NEW_MESSAGE"
  | "SELLER_REPLY"
  | "LISTING_APPROVED"
  | "LISTING_REJECTED"
  | "LISTING_EXPIRING"
  | "PRICE_CHANGE"
  | "SAVED_SEARCH_RESULT"
  | "DEALER_LEAD"
  | "PAYMENT_CONFIRMATION"
  | "VEHICLE_SOLD";

export interface Notification {
  id: string;
  userId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export interface DeviceSubscription {
  id: string;
  userId: string;
  platform: "WEB" | "ANDROID" | "IOS";
  pushProvider: "FCM" | "APNS" | "WEBPUSH";
  token: string;
  createdAt: string;
}

export interface SearchFilters {
  q?: string;
  category?: string;
  make?: string;
  model?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  condition?: Condition;
  sellerType?: SellerType;
  fuel?: FuelType;
  transmission?: Transmission;
  bodyType?: string;
  color?: string;
  maxKms?: number;
  verifiedOnly?: boolean;
  photosOnly?: boolean;
  sort?:
    | "recommended"
    | "newest"
    | "oldest"
    | "price_asc"
    | "price_desc"
    | "kms_asc"
    | "year_desc";
  page?: number;
  perPage?: number;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: SearchFilters;
  notify: "INSTANT" | "DAILY" | "WEEKLY" | "OFF";
  createdAt: string;
}

export interface SellerPackage {
  id: string;
  slug: string;
  name: string;
  price: number;
  durationDays: number;
  maxPhotos: number;
  videoAllowed: boolean;
  featured: boolean;
  searchBoost: boolean;
  active: boolean;
}

export interface SiteSettings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  whatsapp: string;
  address: string;
  currency: "INR";
  freeListingThreshold: number;
  freeListingsPerUser: number;
  listingDurationDays: number;
  maxPhotos: number;
  maxVideoSeconds: number;
}
