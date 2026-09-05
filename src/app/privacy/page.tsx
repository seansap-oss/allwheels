import type { Metadata } from "next";
import { PrivacyPage } from "../static-pages";

export const metadata: Metadata = { title: "Privacy" };

export default function Page() {
  return <PrivacyPage />;
}
