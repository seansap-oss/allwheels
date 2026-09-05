import type { Metadata } from "next";
import { ContactPage } from "../static-pages";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return <ContactPage />;
}
