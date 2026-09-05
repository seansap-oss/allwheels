import { fail, ok } from "@/lib/api-utils";
import { currentUser } from "@/lib/auth";
import { getNotifications } from "@/lib/store";

export async function GET() {
  const user = await currentUser();
  if (!user) return fail("Login required.", 401);
  return ok(getNotifications(user.id));
}
