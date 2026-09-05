import type { Metadata } from "next";
import { SafetyPage } from "../static-pages";

export const metadata: Metadata = { title: "Safety center" };

export default function Page() {
  return <SafetyPage />;
}
