import { redirect } from "next/navigation";

const MAP: Record<string, string> = {
  cars: "cars",
  motorcycles: "motorcycles",
  scooters: "scooters",
  electric: "electric",
  commercial: "commercial",
  bicycles: "bicycles",
};

export default async function CategoryShortcut({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/search?category=${MAP[slug] ?? slug}`);
}
