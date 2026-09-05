import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function connectionString(): string | null {
  const url =
    process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? null;
  return url && url.length > 8 ? url : null;
}

export function isDbConfigured(): boolean {
  return connectionString() !== null;
}

// Lazy singleton: importing this module never connects.
let cached: ReturnType<typeof drizzlePg> | null = null;

export function getDb() {
  const url = connectionString();
  if (!url) return null;
  if (!cached) {
    const client = postgres(url, { max: 5, prepare: false });
    cached = drizzlePg(client, { schema });
  }
  return cached;
}

export type Db = NonNullable<ReturnType<typeof getDb>>;
