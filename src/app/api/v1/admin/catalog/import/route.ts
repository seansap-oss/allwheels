import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-utils";
import { currentUser } from "@/lib/auth";
import { catalogImportRowSchema } from "@/lib/validation";

function splitCsv(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((c) => c.trim()));
}

/** Catalogue import preview/validate. POST { csv, dryRun } */
export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user || !user.roles.some((r) => ["ADMIN", "SUPER_ADMIN", "CATALOG_MANAGER"].includes(r))) {
    return fail("Catalog manager required.", 403);
  }
  const body = await req.json().catch(() => null);
  const csv = String(body?.csv ?? "");
  if (!csv.trim()) return fail("csv payload required.", 400);
  const rows = splitCsv(csv);
  const header = rows[0].map((h) => h.toLowerCase());
  const errors: string[] = [];
  let valid = 0;
  for (let i = 1; i < rows.length; i++) {
    const obj: Record<string, string> = {};
    header.forEach((h, j) => {
      obj[h] = rows[i][j] ?? "";
    });
    const parsed = catalogImportRowSchema.safeParse(obj);
    if (!parsed.success) {
      errors.push(`Row ${i + 1}: ${parsed.error.issues.map((x) => x.message).join("; ")}`);
    } else {
      valid += 1;
    }
  }
  return ok({ valid, invalid: errors.length, errors: errors.slice(0, 20), dryRun: body?.dryRun !== false });
}
