/**
 * Motora service layer — the single source of business logic for
 * Web, PWA and future native clients (all go through /api/v1 + these
 * services, never raw DB queries from components).
 *
 * Runs on seed data + in-memory runtime collections when Postgres is
 * not configured, and is designed so each function can be backed by
 * Drizzle/Postgres without changing callers.
 */
import categoriesJson from "../../data/catalog/categories.json";
import manufacturersJson from "../../data/catalog/manufacturers.json";
import modelsJson from "../../data/catalog/models.json";
import listingsJson from "../../data/catalog/listings.json";
import dealersJson from "../../data/catalog/dealers.json";
import packagesJson from "../../data/catalog/packages.json";
import type {
  Category,
  Conversation,
  Dealer,
  Listing,
  Manufacturer,
  Message,
  Notification,
  SavedSearch,
  SearchFilters,
  SellerPackage,
  SiteSettings,
  User,
  VehicleModel,
} from "./types";
import { slugify } from "./utils";

export const categories: Category[] = categoriesJson as Category[];
export const manufacturers: Manufacturer[] =
  manufacturersJson as Manufacturer[];
export const vehicleModels: VehicleModel[] = modelsJson as VehicleModel[];
export const seedListings: Listing[] = listingsJson as unknown as Listing[];
export const seedDealers: Dealer[] = dealersJson as Dealer[];
export const sellerPackages: SellerPackage[] = (
  packagesJson as { packages: SellerPackage[] }
).packages;
export const siteSettings: SiteSettings = (
  packagesJson as { settings: SiteSettings }
).settings;

// ---- runtime (in-memory) collections; replaced by Postgres rows in prod ----
const listingsRuntime: Listing[] = [...seedListings];
const usersRuntime: User[] = [
  {
    id: "u-admin",
    email: "admin@motora.com",
    phone: "+911800000000",
    name: "Motora Admin",
    avatarUrl: null,
    roles: ["SUPER_ADMIN", "ADMIN"],
    phoneVerified: true,
    emailVerified: true,
    idVerified: true,
    city: "Bengaluru",
    state: "Karnataka",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "u-seller1",
    email: "seller@motora.com",
    phone: "+919862000010",
    name: "Thangjam R.",
    avatarUrl: null,
    roles: ["USER", "SELLER"],
    phoneVerified: true,
    emailVerified: true,
    idVerified: false,
    city: "Imphal",
    state: "Manipur",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "u-dealer1",
    email: "dealer@motora.com",
    phone: "+919862000001",
    name: "Rajesh Singh",
    avatarUrl: null,
    roles: ["USER", "DEALER_OWNER"],
    phoneVerified: true,
    emailVerified: true,
    idVerified: true,
    city: "Imphal",
    state: "Manipur",
    createdAt: "2026-05-01T00:00:00Z",
  },
];
const passwordHashes = new Map<string, string>(); // userId -> bcrypt hash
const favoritesRuntime: { userId: string; listingId: string }[] = [
  { userId: "u-seller1", listingId: "l2" },
];
const conversationsRuntime: Conversation[] = [
  {
    id: "c1",
    listingId: "l1",
    listingTitle: "2023 Royal Enfield Classic 350 Halcyon Green",
    participantIds: ["u-seller1", "u-dealer1"],
    lastMessage: "Is this still available?",
    updatedAt: "2026-08-30T09:00:00Z",
    unreadFor: ["u-seller1"],
  },
];
const messagesRuntime: Message[] = [
  {
    id: "msg1",
    conversationId: "c1",
    listingId: "l1",
    fromUserId: "u-dealer1",
    toUserId: "u-seller1",
    body: "Hello, is this still available? Can I see it this weekend?",
    createdAt: "2026-08-30T09:00:00Z",
    read: false,
  },
];
const notificationsRuntime: Notification[] = [
  {
    id: "n1",
    userId: "u-seller1",
    kind: "NEW_MESSAGE",
    title: "New message from Rajesh Singh",
    body: "Hello, is this still available?",
    link: "/messages",
    read: false,
    createdAt: "2026-08-30T09:00:00Z",
  },
];
const savedSearchesRuntime: SavedSearch[] = [];
const leadsRuntime: Record<string, unknown>[] = [];
const reportsRuntime: Record<string, unknown>[] = [];
const articlesRuntime = [
  {
    id: "a1",
    slug: "royal-enfield-classic-350-buying-guide",
    title: "Royal Enfield Classic 350 buying guide: what to check",
    category: "Buying guides",
    excerpt:
      "Service history, ownership chain and rust spots — the five checks that matter before you pay.",
    image: "/images/seed/bike-1.svg",
    date: "2026-08-10",
  },
  {
    id: "a2",
    slug: "ev-scooter-range-explained",
    title: "EV scooter range numbers, explained for Indian cities",
    category: "EV news",
    excerpt:
      "IDC vs true range, and how traffic, pillion load and mode selection change the number.",
    image: "/images/seed/scooter-1.svg",
    date: "2026-08-15",
  },
  {
    id: "a3",
    slug: "used-suv-checklist",
    title: "Used SUV checklist: Scorpio N, Creta and Nexon",
    category: "Ownership guides",
    excerpt:
      "Accident traces, 4WD health and insurance transfer — a 15-minute inspection routine.",
    image: "/images/seed/car-1.svg",
    date: "2026-08-20",
  },
];

export function getPasswordHash(userId: string): string | undefined {
  return passwordHashes.get(userId);
}
export function setPasswordHash(userId: string, hash: string) {
  passwordHashes.set(userId, hash);
}

// ---- users ----
export function findUserByEmail(email: string): User | undefined {
  return usersRuntime.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
}
export function findUserById(id: string): User | undefined {
  return usersRuntime.find((u) => u.id === id);
}
export function addUser(u: User) {
  usersRuntime.push(u);
  return u;
}
export function listUsers(): User[] {
  return [...usersRuntime];
}

// ---- listings ----
export function activeListings(): Listing[] {
  return listingsRuntime.filter(
    (l) => l.status === "ACTIVE" || l.status === "APPROVED",
  );
}
export function allListings(): Listing[] {
  return [...listingsRuntime];
}
export function getListingBySlug(slug: string): Listing | undefined {
  return listingsRuntime.find((l) => l.slug === slug);
}
export function getListingById(id: string): Listing | undefined {
  return listingsRuntime.find((l) => l.id === id);
}
export function addListing(l: Listing) {
  listingsRuntime.unshift(l);
  return l;
}
export function updateListing(id: string, patch: Partial<Listing>) {
  const i = listingsRuntime.findIndex((l) => l.id === id);
  if (i < 0) return undefined;
  listingsRuntime[i] = {
    ...listingsRuntime[i],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return listingsRuntime[i];
}
export function listingCounts() {
  const active = activeListings().length;
  return { total: activeListings().length, active, pending: listingsRuntime.filter((l) => l.status === "PENDING").length };
}

export interface SearchResult {
  items: Listing[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export function searchListings(f: SearchFilters): SearchResult {
  const page = Math.max(1, f.page ?? 1);
  const perPage = Math.min(48, Math.max(1, f.perPage ?? 24));
  let pool = activeListings();

  if (f.category) {
    const c = f.category.toLowerCase();
    pool =
      c === "electric"
        ? pool.filter((l) => l.fuel === "ELECTRIC")
        : pool.filter((l) => l.categorySlug === c);
  }
  if (f.q) {
    const q = f.q.toLowerCase();
    pool = pool.filter((l) =>
      `${l.title} ${l.manufacturerName} ${l.modelName} ${l.variantName ?? ""} ${l.city}`.toLowerCase().includes(q),
    );
  }
  if (f.make) {
    const m = f.make.toLowerCase().replace(/-/g, " ");
    pool = pool.filter(
      (l) =>
        l.manufacturerName.toLowerCase().includes(m) ||
        slugify(l.manufacturerName) === f.make!.toLowerCase(),
    );
  }
  if (f.model) {
    const m = f.model.toLowerCase().replace(/-/g, " ");
    pool = pool.filter(
      (l) =>
        l.modelName.toLowerCase().includes(m) ||
        slugify(l.modelName) === f.model!.toLowerCase(),
    );
  }
  if (f.city)
    pool = pool.filter((l) => l.city.toLowerCase() === f.city!.toLowerCase());
  if (f.state)
    pool = pool.filter(
      (l) => l.state.toLowerCase() === f.state!.toLowerCase(),
    );
  if (f.minPrice !== undefined) pool = pool.filter((l) => l.price >= f.minPrice!);
  if (f.maxPrice !== undefined) pool = pool.filter((l) => l.price <= f.maxPrice!);
  if (f.minYear !== undefined) pool = pool.filter((l) => l.year >= f.minYear!);
  if (f.maxYear !== undefined) pool = pool.filter((l) => l.year <= f.maxYear!);
  if (f.condition) pool = pool.filter((l) => l.condition === f.condition);
  if (f.sellerType) pool = pool.filter((l) => l.sellerType === f.sellerType);
  if (f.fuel) pool = pool.filter((l) => l.fuel === f.fuel);
  if (f.transmission)
    pool = pool.filter((l) => l.transmission === f.transmission);
  if (f.bodyType)
    pool = pool.filter(
      (l) => (l.subcategorySlug ?? "").toLowerCase() === f.bodyType!.toLowerCase(),
    );
  if (f.maxKms !== undefined)
    pool = pool.filter((l) => (l.kms ?? 0) <= f.maxKms!);
  if (f.verifiedOnly) pool = pool.filter((l) => l.verifiedSeller);
  if (f.photosOnly) pool = pool.filter((l) => l.media.length > 0);

  const sort = f.sort ?? "recommended";
  const sorted = [...pool].sort((a, b) => {
    switch (sort) {
      case "newest":
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      case "oldest":
        return +new Date(a.createdAt) - +new Date(b.createdAt);
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "kms_asc":
        return (a.kms ?? 0) - (b.kms ?? 0);
      case "year_desc":
        return b.year - a.year;
      default:
        return (
          Number(b.featured) - Number(a.featured) ||
          b.saves - a.saves ||
          +new Date(b.createdAt) - +new Date(a.createdAt)
        );
    }
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const items = sorted.slice((page - 1) * perPage, page * perPage);
  return { items, total, page, perPage, totalPages };
}

export function similarListings(l: Listing, n = 4): Listing[] {
  return activeListings()
    .filter((x) => x.id !== l.id)
    .map((x) => ({
      x,
      score:
        (x.categorySlug === l.categorySlug ? 3 : 0) +
        (x.manufacturerId === l.manufacturerId ? 2 : 0) +
        (x.modelId === l.modelId ? 2 : 0) +
        (x.city === l.city ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((r) => r.x);
}

// ---- favorites / saved searches ----
export function getFavorites(userId: string): Listing[] {
  const ids = new Set(
    favoritesRuntime.filter((f) => f.userId === userId).map((f) => f.listingId),
  );
  return listingsRuntime.filter((l) => ids.has(l.id));
}
export function isFavorite(userId: string, listingId: string): boolean {
  return favoritesRuntime.some(
    (f) => f.userId === userId && f.listingId === listingId,
  );
}
export function toggleFavorite(userId: string, listingId: string): boolean {
  const i = favoritesRuntime.findIndex(
    (f) => f.userId === userId && f.listingId === listingId,
  );
  if (i >= 0) {
    favoritesRuntime.splice(i, 1);
    return false;
  }
  favoritesRuntime.push({ userId, listingId });
  return true;
}

export function getSavedSearches(userId: string): SavedSearch[] {
  return savedSearchesRuntime.filter((s) => s.userId === userId);
}
export function addSavedSearch(s: SavedSearch) {
  savedSearchesRuntime.unshift(s);
  return s;
}

// ---- messaging ----
export function getConversations(userId: string): Conversation[] {
  return conversationsRuntime
    .filter((c) => c.participantIds.includes(userId))
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}
export function getConversation(id: string): Conversation | undefined {
  return conversationsRuntime.find((c) => c.id === id);
}
export function getMessages(conversationId: string): Message[] {
  return messagesRuntime
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
}
export function addMessage(m: Message): Message {
  messagesRuntime.push(m);
  const c = getConversation(m.conversationId);
  if (c) {
    c.lastMessage = m.body;
    c.updatedAt = m.createdAt;
    if (!c.unreadFor.includes(m.toUserId)) c.unreadFor.push(m.toUserId);
  }
  const to = findUserById(m.toUserId);
  const from = findUserById(m.fromUserId);
  if (to) {
    notificationsRuntime.unshift({
      id: `n-${Date.now()}`,
      userId: to.id,
      kind: "NEW_MESSAGE",
      title: `New message from ${from?.name ?? "a buyer"}`,
      body: m.body.slice(0, 120),
      link: "/messages",
      read: false,
      createdAt: m.createdAt,
    });
  }
  return m;
}
export function ensureConversation(opts: {
  listingId: string | null;
  a: string;
  b: string;
}): Conversation {
  const existing = conversationsRuntime.find(
    (c) =>
      c.listingId === opts.listingId &&
      c.participantIds.includes(opts.a) &&
      c.participantIds.includes(opts.b),
  );
  if (existing) return existing;
  const listing = opts.listingId ? getListingById(opts.listingId) : undefined;
  const c: Conversation = {
    id: `c-${Date.now()}`,
    listingId: opts.listingId,
    listingTitle: listing?.title ?? null,
    participantIds: [opts.a, opts.b],
    lastMessage: "",
    updatedAt: new Date().toISOString(),
    unreadFor: [],
  };
  conversationsRuntime.unshift(c);
  return c;
}
export function markConversationRead(conversationId: string, userId: string) {
  const c = getConversation(conversationId);
  if (c) c.unreadFor = c.unreadFor.filter((u) => u !== userId);
  for (const m of messagesRuntime) {
    if (m.conversationId === conversationId && m.toUserId === userId)
      m.read = true;
  }
}

// ---- notifications ----
export function getNotifications(userId: string): Notification[] {
  return notificationsRuntime
    .filter((n) => n.userId === userId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}
export function pushNotification(n: Notification) {
  notificationsRuntime.unshift(n);
  return n;
}

// ---- dealers / leads / misc ----
export function getDealerBySlug(slug: string): Dealer | undefined {
  return seedDealers.find((d) => d.slug === slug);
}
export function dealerListings(dealerId: string): Listing[] {
  return listingsRuntime.filter((l) => l.dealerId === dealerId);
}
export function addLead(lead: Record<string, unknown>) {
  leadsRuntime.unshift({ ...lead, createdAt: new Date().toISOString() });
  return lead;
}
export function getLeads(): Record<string, unknown>[] {
  return [...leadsRuntime];
}
export function addReport(report: Record<string, unknown>) {
  reportsRuntime.unshift({ ...report, createdAt: new Date().toISOString() });
  return report;
}
export function getReports(): Record<string, unknown>[] {
  return [...reportsRuntime];
}
export function getArticles() {
  return [...articlesRuntime];
}
export function autocomplete(q: string) {
  const query = q.trim().toLowerCase();
  if (query.length < 2) return { makes: [], models: [], listings: [], dealers: [] };
  return {
    makes: manufacturers
      .filter((m) => m.name.toLowerCase().includes(query))
      .slice(0, 5),
    models: vehicleModels
      .filter((m) => m.name.toLowerCase().includes(query))
      .slice(0, 6),
    listings: activeListings()
      .filter((l) => l.title.toLowerCase().includes(query))
      .slice(0, 5),
    dealers: seedDealers
      .filter((d) => d.businessName.toLowerCase().includes(query))
      .slice(0, 3),
  };
}
