import type { Metadata } from "next";
import { Container } from "@/components/ui";

function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Container className="max-w-3xl py-10">
      <h1 className="text-3xl font-black text-navy-950">{title}</h1>
      <div className="prose-sm mt-4 grid gap-3 text-sm leading-relaxed text-slate-700">{children}</div>
    </Container>
  );
}

export function AboutPage() {
  return (
    <Page title="About Motora">
      <p>Motora is India&apos;s multi-category vehicle marketplace — cars, motorcycles, scooters, EVs, commercial vehicles and bicycles in one platform: vehicle database + search engine + classifieds + seller, dealer, payments, messaging, CMS and admin systems.</p>
      <p>One backend, one database, one account — web, PWA, Android and iOS.</p>
    </Page>
  );
}

export function ContactPage() {
  return (
    <Page title="Contact us">
      <p>Email: support@motora.com · Phone: +91 1800 000 000 · WhatsApp: +91 98000 00000</p>
      <p>Motora Technologies Pvt. Ltd., Bengaluru, Karnataka, India.</p>
    </Page>
  );
}

export function TermsPage() {
  return (
    <Page title="Terms of use">
      <p>Listings must be accurate and lawful. Prohibited: fraud, misrepresentation, spam, scraping contact data. Motora moderates listings and may suspend accounts that violate policy.</p>
      <p>Price guidance is estimated from comparable listings and is not a certified valuation.</p>
    </Page>
  );
}

export function PrivacyPage() {
  return (
    <Page title="Privacy policy">
      <p>We store only what the marketplace needs: account, listings, messages, payments metadata. Card data is handled by PCI-compliant gateways (Razorpay) — never by Motora servers.</p>
      <p>ID verification images are processed and never retained longer than necessary.</p>
    </Page>
  );
}

export function SafetyPage() {
  return (
    <Page title="Safety center">
      <p>Meet in public, verify RC and insurance, never pay in advance, keep chat inside Motora, and report anything suspicious. Look for Verified Seller and Verified Dealer badges.</p>
    </Page>
  );
}
