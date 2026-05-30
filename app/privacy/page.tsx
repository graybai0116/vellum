import Link from "next/link";
import { Mark } from "@/components/ui/Mark";

export const metadata = {
  title: "Privacy Policy — VELLUM",
};

const SECTIONS = [
  {
    title: "1. What we collect",
    body: `When you create an account, we collect your email address and basic profile information through Clerk, our authentication provider. When you use Vellum, we store the images you upload, the analyses we generate, and your saved library. If you subscribe to Pro, Stripe processes your payment information — we never see or store your card details directly.`,
  },
  {
    title: "2. How we use it",
    body: `We use your data to provide the service: running image analyses, maintaining your library, and processing your subscription. We do not sell your data. We do not use your uploaded images to train AI models. Aggregated, anonymised usage statistics (e.g. how many analyses are run per day) may be used to improve the product.`,
  },
  {
    title: "3. Third-party services",
    body: `Vellum relies on the following third parties:\n\n• Clerk (clerk.com) — authentication and user identity\n• Stripe (stripe.com) — payment processing and subscription management\n• Supabase (supabase.com) — database and file storage\n• AI model providers — image analysis (your images are sent to an AI API for processing and are not retained by that provider beyond the request)\n\nEach provider has their own privacy policy governing their data handling.`,
  },
  {
    title: "4. Data retention",
    body: `Your account data and library are retained for as long as your account is active. If you delete your account, your data is deleted within 30 days. Uploaded images used for analysis are stored in association with your account and deleted when you delete the analysis or your account.`,
  },
  {
    title: "5. Your rights",
    body: `You may request a copy of your data, request correction, or request deletion at any time by emailing hello@vellum.art. If you are in the EU or UK, you have additional rights under GDPR including the right to restrict processing and the right to lodge a complaint with a supervisory authority. If you are in California, you have rights under CCPA including the right to know, delete, and opt out of sale (we do not sell data).`,
  },
  {
    title: "6. Cookies",
    body: `Vellum uses cookies strictly necessary for authentication (session tokens set by Clerk) and payment flow (set by Stripe). We do not use advertising or tracking cookies.`,
  },
  {
    title: "7. Children",
    body: `Vellum is not directed at children under 13. We do not knowingly collect data from children.`,
  },
  {
    title: "8. Changes to this policy",
    body: `We may update this policy. If we make material changes, we will notify you by email. Continued use of the service after changes constitutes acceptance.`,
  },
  {
    title: "9. Contact",
    body: `For privacy questions or data requests: hello@vellum.art`,
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--font-body)" }}>
      {/* Nav */}
      <nav style={{ padding: "20px 40px", borderBottom: "1px solid var(--rule-soft)", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "2px solid var(--terracotta)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Mark size={24} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 520, letterSpacing: "0.01em", color: "var(--ink)" }}>VELLUM</span>
        </Link>
        <Link href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.06em", textDecoration: "none" }}>← Back</Link>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 40px 100px" }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-mute)", marginBottom: 16 }}>Legal</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 510, letterSpacing: "-0.035em", color: "var(--ink)", lineHeight: 1.05, marginBottom: 16 }}>Privacy Policy</h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--stone)", letterSpacing: "0.04em" }}>
            Last updated: May 2026
          </p>
          <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 16, color: "var(--walnut)", lineHeight: 1.6, marginTop: 20, maxWidth: 560 }}>
            Vellum is a tool for creative people. We collect only what we need to run the service, and we do not sell or misuse your data.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {SECTIONS.map((s, i) => (
            <div key={s.title} style={{ paddingTop: i === 0 ? 0 : 36, marginTop: i === 0 ? 0 : 36, borderTop: i === 0 ? "none" : "1px solid var(--rule-soft)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 520, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 12 }}>{s.title}</h2>
              <p style={{ fontSize: 14, color: "var(--walnut)", lineHeight: 1.75, whiteSpace: "pre-line" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--rule-soft)", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.04em" }}>
        <div>© 2026 Vellum</div>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/privacy" style={{ color: "var(--ink)" }}>Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
