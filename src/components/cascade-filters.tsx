"use client";

import { useEffect, useMemo, useState } from "react";
import { prettyBody } from "./hero-search";

interface MakeOpt { slug: string; name: string }
interface ModelOpt { slug: string; name: string; bodyTypes: string[] }

/**
 * Cascading Make -> Model -> Body Type selects for filter forms.
 * Renders named <select> elements so plain GET forms keep working.
 */
export function CascadeFilters({
  category,
  defaultMake = "",
  defaultModel = "",
  defaultBodyType = "",
}: {
  category: string;
  defaultMake?: string;
  defaultModel?: string;
  defaultBodyType?: string;
}) {
  const [makes, setMakes] = useState<MakeOpt[]>([]);
  const [models, setModels] = useState<ModelOpt[]>([]);
  const [make, setMake] = useState(defaultMake);
  const [model, setModel] = useState(defaultModel);
  const [bodyType, setBodyType] = useState(defaultBodyType);

  useEffect(() => {
    fetch(`/api/v1/catalog/manufacturers?category=${category || "cars"}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setMakes(j.data);
      })
      .catch(() => undefined);
  }, [category]);

  useEffect(() => {
    if (!make) {
      setModels([]);
      setModel("");
      return;
    }
    fetch(`/api/v1/catalog/models?manufacturer=${make}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setModels(j.data);
          // Keep the URL-provided model only if it belongs to this make.
          setModel((cur) => ((j.data as ModelOpt[]).some((m) => m.slug === cur) ? cur : ""));
        }
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [make]);

  const bodyTypes = useMemo(() => {
    const set = new Set<string>();
    for (const m of models) for (const b of m.bodyTypes ?? []) set.add(b);
    return [...set].sort();
  }, [models]);

  const cls = "h-12 rounded-xl border border-slate-300 px-2 font-normal bg-white";

  return (
    <>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Make
        <select name="make" value={make} onChange={(e) => { setMake(e.target.value); setBodyType(""); }} className={cls}>
          <option value="">All makes</option>
          {makes.map((m) => (
            <option key={m.slug} value={m.slug}>{m.name}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Model
        <select name="model" value={model} onChange={(e) => setModel(e.target.value)} disabled={!make} className={cls}>
          <option value="">{make ? "All models" : "Select make first"}</option>
          {models.map((m) => (
            <option key={m.slug} value={m.slug}>{m.name}</option>
          ))}
        </select>
      </label>
      {bodyTypes.length > 0 ? (
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Body type
          <select name="bodyType" value={bodyType} onChange={(e) => setBodyType(e.target.value)} className={cls}>
            <option value="">All body types</option>
            {bodyTypes.map((b) => (
              <option key={b} value={b}>{prettyBody(b)}</option>
            ))}
          </select>
        </label>
      ) : null}
    </>
  );
}
