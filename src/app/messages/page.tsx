import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { MessagesClient } from "@/components/messages-client";
import { currentUser } from "@/lib/auth";
import { getConversations } from "@/lib/store";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/messages");
  const convos = getConversations(user.id);
  return (
    <Container className="py-8">
      <h1 className="text-3xl font-black text-navy-950">Messages</h1>
      <p className="mb-4 mt-1 text-sm text-slate-600">Buyer–seller chat stays inside Motora. Spam and phone-scraping are blocked by rate limits.</p>
      <MessagesClient me={user.id} initial={convos} />
    </Container>
  );
}
