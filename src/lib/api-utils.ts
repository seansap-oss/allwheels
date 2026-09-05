import { NextRequest, NextResponse } from "next/server";

// ---- tiny in-memory rate limiter (per-instance; use Redis/Upstash in prod) ----
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(req: NextRequest, key: string, limit = 60, windowMs = 60_000): boolean {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const k = `${key}:${ip}`;
  const now = Date.now();
  const cur = hits.get(k);
  if (!cur || now > cur.reset) {
    hits.set(k, { count: 1, reset: now + windowMs });
    return true;
  }
  cur.count += 1;
  return cur.count <= limit;
}

export function ok<T>(data: T, init?: { status?: number; headers?: Record<string, string> }) {
  return NextResponse.json({ success: true, data }, { status: init?.status ?? 200, headers: init?.headers });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

export function paginate(total: number, page: number, perPage: number) {
  return { total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
}
