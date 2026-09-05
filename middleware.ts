import { NextRequest, NextResponse } from "next/server";

/**
 * Dealer wildcard subdomain: abc.motora.com -> motora.com/dealer/abc
 * (Production: wildcard DNS *.motora.com + Vercel wildcard domain.)
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "motora.com").replace(/^https?:\/\//, "");
  const root = base.split(":")[0];
  if (host.endsWith(`.${root}`)) {
    const sub = host.slice(0, host.length - root.length - 1);
    if (sub && sub !== "www" && !sub.includes(":")) {
      const url = req.nextUrl.clone();
      url.pathname = `/dealer/${sub}${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icons|images|manifest.webmanifest|sw.js|offline.html|favicon.ico).*)"],
};
