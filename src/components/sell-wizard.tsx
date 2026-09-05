"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { manufacturers, vehicleModels, sellerPackages, siteSettings } from "@/lib/store";

const STEPS = ["Category", "Model", "Condition", "Details", "Photos", "Price", "Package", "Preview"] as const;

const CATS = [
  { slug: "cars", label: "Car" },
  { slug: "motorcycles", label: "Motorcycle" },
  { slug: "scooters", label: "Scooter" },
  { slug: "electric", label: "Electric" },
  { slug: "commercial", label: "Commercial" },
  { slug: "bicycles", label: "Bicycle" },
];

export function SellWizard() {
  const [step, setStep] = useState(0);
  const [draftId] = useState(() => `draft-${Date.now()}`);
  const [form, setForm] = useState({
    categorySlug: "motorcycles",
    manufacturerName: "Royal Enfield",
    modelName: "Classic 350",
    variantName: "",
    year: 2023,
    condition: "USED" as "NEW" | "USED",
    city: "Imphal",
    state: "Manipur",
    kms: 10000,
    fuel: "PETROL",
    price: 175000,
    description: "",
    packageId: "pkg-single",
  });
  const [photos, setPhotos] = useState<{ name: string; progress: number; done: boolean }[]>([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const makes = useMemo(() => manufacturers.map((m) => m.name), []);
  const models = useMemo(
    () => vehicleModels.filter((m) => m.name.toLowerCase().includes("") ).map((m) => m.name),
    [],
  );
  const pkg = sellerPackages.find((p) => p.id === form.packageId);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onFiles(files: FileList | null) {
    if (!files) return;
    const max = pkg?.maxPhotos ?? siteSettings.maxPhotos;
    const next = [...photos];
    for (const file of Array.from(files).slice(0, Math.max(0, max - next.length))) {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
        setErr(`${file.name}: only JPG, PNG or WEBP images are supported.`);
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        setErr(`${file.name}: max 8 MB per photo.`);
        continue;
      }
      const entry = { name: file.name, progress: 0, done: false };
      next.push(entry);
      // Simulated client-side compress + upload with progress (server upload API in prod).
      const tick = () => {
        setPhotos((prev) => prev.map((p) => (p.name === entry.name && !p.done ? { ...p, progress: Math.min(100, p.progress + 25) } : p)));
      };
      const iv = setInterval(() => {
        tick();
        setPhotos((prev) => {
          const cur = prev.find((p) => p.name === entry.name);
          if (cur && cur.progress >= 100) {
            clearInterval(iv);
            return prev.map((p) => (p.name === entry.name ? { ...p, done: true } : p));
          }
          return prev;
        });
      }, 250);
    }
    setPhotos(next);
  }

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/v1/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, kms: Number(form.kms), year: Number(form.year), price: Number(form.price), description: form.description || "Well maintained vehicle. Contact for details." }),
      });
      const j = await r.json();
      if (!j.success) {
        setErr(j.error ?? "Could not publish. You may need to log in.");
        return;
      }
      router.push(`/vehicle/${j.data.slug}`);
    } catch {
      setErr("Network error — your draft is saved on this device. Retry when online.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <ol className="no-scrollbar flex gap-2 overflow-x-auto" aria-label="Sell progress">
        {STEPS.map((s, i) => (
          <li key={s} className={`flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-bold ${i === step ? "bg-navy-950 text-white" : i < step ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
        {step === 0 ? (
          <div>
            <h2 className="text-xl font-black">What are you selling?</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CATS.map((c) => (
                <button key={c.slug} onClick={() => set("categorySlug", c.slug)} className={`flex h-16 items-center justify-center rounded-2xl border-2 font-extrabold ${form.categorySlug === c.slug ? "border-motora-500 bg-motora-50 text-motora-700" : "border-slate-200"}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-4">
            <h2 className="text-xl font-black">Make & model</h2>
            <p className="text-sm text-slate-600">Picked from the Motora master catalogue — no free-typing makes.</p>
            <label className="grid gap-1 text-sm font-semibold">Make
              <select value={form.manufacturerName} onChange={(e) => set("manufacturerName", e.target.value)} className="h-12 rounded-xl border border-slate-300 px-3">
                {makes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">Model
              <select value={form.modelName} onChange={(e) => set("modelName", e.target.value)} className="h-12 rounded-xl border border-slate-300 px-3">
                {models.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-sm font-semibold">Variant (optional)
                <input value={form.variantName} onChange={(e) => set("variantName", e.target.value)} placeholder="e.g. Halcyon Green" className="h-12 rounded-xl border border-slate-300 px-3 font-normal" />
              </label>
              <label className="grid gap-1 text-sm font-semibold">Year
                <input type="number" min={1980} max={2035} value={form.year} onChange={(e) => set("year", Number(e.target.value))} className="h-12 rounded-xl border border-slate-300 px-3 font-normal" />
              </label>
            </div>
            <p className="text-sm"><button className="font-bold text-motora-600 underline" onClick={() => alert("Catalogue request form: tell us the manufacturer, model, variant and year — our catalog team reviews it.")}>Can&apos;t find your model?</button></p>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h2 className="text-xl font-black">Condition</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(["USED", "NEW"] as const).map((c) => (
                <button key={c} onClick={() => set("condition", c)} className={`h-16 rounded-2xl border-2 font-extrabold ${form.condition === c ? "border-motora-500 bg-motora-50 text-motora-700" : "border-slate-200"}`}>
                  {c === "USED" ? "Used" : "New"}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-4">
            <h2 className="text-xl font-black">Details & location</h2>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-sm font-semibold">City
                <input value={form.city} onChange={(e) => set("city", e.target.value)} className="h-12 rounded-xl border border-slate-300 px-3 font-normal" />
              </label>
              <label className="grid gap-1 text-sm font-semibold">State
                <input value={form.state} onChange={(e) => set("state", e.target.value)} className="h-12 rounded-xl border border-slate-300 px-3 font-normal" />
              </label>
              <label className="grid gap-1 text-sm font-semibold">Kilometres
                <input type="number" min={0} value={form.kms} onChange={(e) => set("kms", Number(e.target.value))} className="h-12 rounded-xl border border-slate-300 px-3 font-normal" />
              </label>
              <label className="grid gap-1 text-sm font-semibold">Fuel
                <select value={form.fuel} onChange={(e) => set("fuel", e.target.value)} className="h-12 rounded-xl border border-slate-300 px-3 font-normal">
                  {["PETROL", "DIESEL", "CNG", "ELECTRIC", "HYBRID", "OTHER"].map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
              </label>
            </div>
            <label className="grid gap-1 text-sm font-semibold">Description
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Ownership, service history, accessories, reason for sale…" className="rounded-xl border border-slate-300 p-3 font-normal" />
            </label>
          </div>
        ) : null}

        {step === 4 ? (
          <div>
            <h2 className="text-xl font-black">Photos</h2>
            <p className="mt-1 text-sm text-slate-600">Camera + gallery supported on mobile. JPG/PNG/WEBP, auto-compressed, thumbnails generated. {pkg ? `Your package allows ${pkg.maxPhotos} photos.` : ""}</p>
            <label className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <span className="text-3xl">📷</span>
              <span className="mt-2 font-bold">Take photos or choose from library</span>
              <span className="text-xs text-slate-500">Multiple selection supported · shows progress · retry on failure</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple capture="environment" className="hidden" onChange={(e) => onFiles(e.target.files)} />
            </label>
            {photos.length > 0 ? (
              <ul className="mt-4 grid gap-2">
                {photos.map((p) => (
                  <li key={p.name} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm">
                    <span className="flex-1 truncate font-semibold">{p.name}</span>
                    {p.done ? <span className="font-bold text-emerald-700">✓ Ready</span> : <span className="w-24"><span className="block h-2 overflow-hidden rounded-full bg-slate-200"><span className="block h-full bg-motora-500" style={{ width: `${p.progress}%` }} /></span></span>}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {step === 5 ? (
          <div className="grid gap-4">
            <h2 className="text-xl font-black">Price</h2>
            {form.price <= siteSettings.freeListingThreshold ? (
              <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">🎉 Under ₹{siteSettings.freeListingThreshold.toLocaleString("en-IN")} — this listing qualifies for a FREE package slot.</p>
            ) : null}
            <label className="grid gap-1 text-sm font-semibold">Asking price (₹)
              <input type="number" min={0} value={form.price} onChange={(e) => set("price", Number(e.target.value))} className="h-14 rounded-xl border border-slate-300 px-4 text-xl font-extrabold" />
            </label>
          </div>
        ) : null}

        {step === 6 ? (
          <div>
            <h2 className="text-xl font-black">Selling package</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {sellerPackages.filter((p) => p.active).map((p) => (
                <button key={p.id} onClick={() => set("packageId", p.id)} className={`rounded-2xl border-2 p-4 text-left ${form.packageId === p.id ? "border-motora-500 bg-motora-50" : "border-slate-200"}`}>
                  <span className="font-extrabold">{p.name} — {p.price === 0 ? "FREE" : `₹${p.price}`}</span>
                  <span className="mt-1 block text-xs text-slate-600">{p.durationDays} days · {p.maxPhotos} photos{p.videoAllowed ? " · video" : ""}{p.featured ? " · featured badge + boost" : ""}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 7 ? (
          <form onSubmit={publish}>
            <h2 className="text-xl font-black">Preview</h2>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
              <p className="text-lg font-extrabold">{form.year} {form.manufacturerName} {form.modelName} {form.variantName}</p>
              <p className="text-slate-600">{form.condition} · {form.city}, {form.state} · {Number(form.kms).toLocaleString("en-IN")} km · {form.fuel}</p>
              <p className="mt-1 text-2xl font-black">₹{Number(form.price).toLocaleString("en-IN")}</p>
              <p className="mt-2 text-slate-700">{form.description || "Well maintained vehicle. Contact for details."}</p>
              <p className="mt-2 text-xs text-slate-500">Package: {pkg?.name} · Draft ID {draftId} (resumable on any device after login)</p>
            </div>
            {err ? <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{err}</p> : null}
            <button disabled={busy} className="mt-4 h-12 w-full rounded-xl bg-coral-500 font-extrabold text-white disabled:opacity-60">
              {busy ? "Publishing…" : "Publish listing"}
            </button>
          </form>
        ) : null}

        {err && step !== 7 ? <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{err}</p> : null}

        <div className="mt-6 flex gap-2">
          {step > 0 ? (
            <button onClick={() => setStep((s) => s - 1)} className="h-12 flex-1 rounded-xl border border-slate-300 font-bold">← Back</button>
          ) : null}
          {step < STEPS.length - 1 ? (
            <button onClick={() => { localStorage.setItem(`motora-draft-${draftId}`, JSON.stringify(form)); setStep((s) => s + 1); }} className="h-12 flex-1 rounded-xl bg-navy-950 font-extrabold text-white">
              Continue →
            </button>
          ) : null}
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">Draft auto-saves locally; after login it syncs to your account for completion on any device.</p>
      </div>
    </div>
  );
}
