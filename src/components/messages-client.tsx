"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Conversation, Message } from "@/lib/types";

export function MessagesClient({ me, initial }: { me: string; initial: Conversation[] }) {
  const [convos, setConvos] = useState(initial);
  const [activeId, setActiveId] = useState(initial[0]?.id ?? null);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!activeId) return;
    fetch(`/api/v1/messages/${activeId}`).then(async (r) => {
      const j = await r.json();
      if (j.success) setMsgs(j.data);
    });
  }, [activeId]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const c = convos.find((x) => x.id === activeId);
    if (!c || !text.trim()) return;
    const other = c.participantIds.find((p) => p !== me) ?? "";
    const r = await fetch("/api/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: c.id, listingId: c.listingId, toUserId: other, body: text.trim() }),
    });
    const j = await r.json();
    if (j.success) {
      setMsgs((m) => [...m, j.data]);
      setText("");
    }
  }

  const active = convos.find((c) => c.id === activeId);

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white">
        {convos.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">No conversations yet. Message a seller from any vehicle page.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {convos.map((c) => (
              <li key={c.id}>
                <button onClick={() => setActiveId(c.id)} className={`flex w-full items-center gap-3 p-4 text-left ${c.id === activeId ? "bg-motora-50" : ""}`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-950 font-black text-white">💬</span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{c.listingTitle ?? "General enquiry"}</span>
                    <span className="block truncate text-xs text-slate-500">{c.lastMessage}</span>
                  </span>
                  {c.unreadFor.includes(me) ? <span className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-coral-500" /> : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex min-h-[50vh] flex-col rounded-2xl border border-slate-200 bg-white">
        {!active ? (
          <p className="p-6 text-sm text-slate-600">Select a conversation.</p>
        ) : (
          <>
            <div className="border-b border-slate-100 p-4">
              <p className="font-extrabold">{active.listingTitle ?? "Conversation"}</p>
              <Link href="/safety" className="text-xs font-semibold text-motora-600">Stay safe: keep chat inside Motora · report abuse</Link>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {msgs.map((m) => (
                <div key={m.id} className={`max-w-[80%] rounded-2xl p-3 text-sm ${m.fromUserId === me ? "ml-auto bg-navy-950 text-white" : "bg-slate-100"}`}>
                  {m.body}
                </div>
              ))}
            </div>
            <form onSubmit={send} className="flex gap-2 border-t border-slate-100 p-3">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" maxLength={2000} className="h-12 flex-1 rounded-xl border border-slate-300 px-3 text-[16px] sm:text-sm" />
              <button className="h-12 rounded-xl bg-navy-950 px-5 font-extrabold text-white">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
