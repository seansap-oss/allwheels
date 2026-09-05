import type { Metadata } from "next";
import { TermsPage } from "../static-pages";

export const metadata: Metadata = { title: "Terms" };

export default function Page() {
  return <TermsPage />;
}
