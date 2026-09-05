"use client";

import { useState } from "react";

export function ImportClient() {
  const [text, setText] = useState("category,manufacturer,model,variant,model_year,price_ex_showroom,status\nmotorcycles,Royal Enfield,Hunter 350,Dapper Grey,2026,149900,ACTIVE");
  const [result, setResult] = useState<{ valid: number; invalid: number; errors: string[] } | null>(null);

  async function preview() {
    const r = await fetch("/api/v1/admin/catalog/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv: text, dryRun: true }),
    });
    const j = await r.json();
    if (j.success) setResult(j.data);
  }

  return (
    <div>
      <p className="text-sm text-slate-600">Upload CSV / XLSX / JSON at <code>/admin/catalog/import</code>. Preview shows new / existing / changed / duplicates / invalid rows before IMPORT — never overwrites blindly.</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="mt-3 w-full rounded-2xl border border-slate-300 p-3 font-mono text-xs" />
      <div className="mt-3 flex gap-2">
        <button onClick={preview} className="h-11 rounded-xl bg-navy-950 px-5 text-sm font-extrabold text-white">Preview import</button>
      </div>
      {result ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm" role="status">
          <p><strong>{result.valid}</strong> valid · <strong>{result.invalid}</strong> invalid</p>
          {result.errors.map((e, i) => (
            <p key={i} className="text-red-600">{e}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
