import { ImportClient } from "@/components/import-client";

export default function CatalogImportPage() {
  return (
    <div>
      <h1 className="text-2xl font-black text-navy-950">Catalogue import</h1>
      <div className="mt-3"><ImportClient /></div>
    </div>
  );
}
