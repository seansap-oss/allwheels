import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { SearchClient } from "@/components/search-client";
import { searchListings } from "@/lib/store";
import { searchFilterSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Search vehicles" };

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function SearchPage({ searchParams }: Props) {
  const raw = await searchParams;
  const parsed = searchFilterSchema.safeParse({
    q: first(raw.q),
    category: first(raw.category),
    make: first(raw.make),
    model: first(raw.model),
    city: first(raw.city),
    state: first(raw.state),
    minPrice: first(raw.minPrice),
    maxPrice: first(raw.maxPrice),
    minYear: first(raw.minYear),
    maxYear: first(raw.maxYear),
    condition: first(raw.condition),
    sellerType: first(raw.sellerType),
    fuel: first(raw.fuel),
    transmission: first(raw.transmission),
    bodyType: first(raw.bodyType),
    maxKms: first(raw.maxKms),
    verifiedOnly: first(raw.verifiedOnly) === "true" ? true : undefined,
    sort: first(raw.sort),
    page: first(raw.page),
    perPage: first(raw.perPage),
  });
  const filters = parsed.success ? parsed.data : { page: 1, perPage: 24 };
  const result = searchListings(filters);

  const flat: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    const f = first(v);
    if (f) flat[k] = f;
  }

  return (
    <Container className="py-6">
      <h1 className="text-2xl font-black tracking-tight text-navy-950 sm:text-3xl">
        {filters.category ? `${filters.category[0].toUpperCase()}${filters.category.slice(1)} for sale` : "Search vehicles"}
      </h1>
      <div className="mt-4">
        <SearchClient
          initial={{ items: result.items, total: result.total, page: result.page, totalPages: result.totalPages, filters: flat }}
        />
      </div>
    </Container>
  );
}
