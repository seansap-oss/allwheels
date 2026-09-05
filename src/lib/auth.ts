import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role, User } from "./types";
import { addUser, findUserByEmail, findUserById, getPasswordHash, setPasswordHash } from "./store";

const COOKIE = "motora_session";
const ADMIN_EMAILS = (process.env.MOTORA_ADMIN_EMAILS ?? "admin@motora.com")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

function secret(): Uint8Array {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "motora-dev-secret-change-in-production-32chars",
  );
}

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}
export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

export async function createSessionToken(user: User): Promise<string> {
  return new SignJWT({ sub: user.id, email: user.email, roles: user.roles })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function readSessionToken(
  token: string,
): Promise<{ sub: string; roles: Role[] } | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.sub !== "string") return null;
    return { sub: payload.sub, roles: (payload.roles as Role[]) ?? ["USER"] };
  } catch {
    return null;
  }
}

export async function currentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const sess = await readSessionToken(token);
  if (!sess) return null;
  return findUserById(sess.sub) ?? null;
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function registerUser(opts: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<{ user: User; token: string }> {
  if (findUserByEmail(opts.email)) throw new Error("An account with this email already exists.");
  const roles: Role[] = isAdminEmail(opts.email)
    ? ["USER", "SELLER", "ADMIN", "SUPER_ADMIN"]
    : ["USER", "SELLER"];
  const user: User = {
    id: `u-${Date.now()}`,
    email: opts.email,
    phone: opts.phone || null,
    name: opts.name,
    avatarUrl: null,
    roles,
    phoneVerified: false,
    emailVerified: false,
    idVerified: false,
    city: null,
    state: null,
    createdAt: new Date().toISOString(),
  };
  addUser(user);
  setPasswordHash(user.id, await hashPassword(opts.password));
  const token = await createSessionToken(user);
  return { user, token };
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<{ user: User; token: string }> {
  const user = findUserByEmail(email);
  if (!user) throw new Error("Invalid email or password.");
  const hash = getPasswordHash(user.id);
  if (!hash) {
    // Seed demo accounts: first login sets the password if it matches policy,
    // otherwise fall back to well-known demo passwords.
    const demo =
      (user.id === "u-admin" && password === "Admin@123") ||
      (user.id === "u-seller1" && password === "Seller@123") ||
      (user.id === "u-dealer1" && password === "Dealer@123");
    if (!demo) throw new Error("Invalid email or password.");
    setPasswordHash(user.id, await hashPassword(password));
  } else if (!(await verifyPassword(password, hash))) {
    throw new Error("Invalid email or password.");
  }
  const token = await createSessionToken(user);
  return { user, token };
}

export function requireRoles(user: User | null, roles: Role[]): boolean {
  if (!user) return false;
  return roles.some((r) => user.roles.includes(r));
}

export const SESSION_COOKIE = COOKIE;
