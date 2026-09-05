import { ModerationClient } from "@/components/moderation-client";
import { allListings } from "@/lib/store";

export default function AdminListings() {
  return (
    <div>
      <h1 className="text-2xl font-black text-navy-950">Listings moderation</h1>
      <p className="mb-4 mt-1 text-sm text-slate-600">Approve · Reject · Request changes · Suspend — every action is audit-logged.</p>
      <ModerationClient initial={allListings()} />
    </div>
  );
}
