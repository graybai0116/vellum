import Link from "next/link";
import { Mark } from "@/components/ui/Mark";

export const metadata = {
  title: "Terms of Service — VELLUM",
};

const SECTIONS = [
  {
    title: "1. The service",
    body: `Vellum is a web application that analyses images and generates structured prompt descriptions (palette, lighting, composition, mood). By creating an account you agree to these terms.`,
  },
  {
    title: "2. Your account",
    body: `You are responsible for maintaining the security of your account. You must be at least 13 years old to use Vellum. You may not use the service for any illegal purpose or in violation of any applicable law.`,
  },
  {
    title: "3. Plans and payment",
    body: `Free plan: 10 image analyses per month at no cost.\n\nPro plan: Unlimited analyses at $10 USD per month, billed monthly. Subscriptions renew automatically unless cancelled. You may cancel at any time from your account settings; access continues until the end of the billing period.\n\nAll payments are processed by Stripe. We do not store card information. Prices may change with 30 days' notice.`,
  },
  {
    title: "4. Refunds",
    body: `We offer a 7-day refund on Pro subscriptions if you are unsatisfied. Contact hello@vellum.art within 7 days of your first charge. After 7 days, charges are non-refundable. We reserve the right to refuse refunds if we detect abuse of this policy.`,
  },
  {
    title: "5. Your content",
    body: `You own the images you upload. By uploading an image, you grant Vellum a limited, non-exclusive licence to process and analyse the image in order to provide the service. We do not use your images to train AI models, and we do not claim ownership of your content.\n\nYou must have the right to upload any image you submit. Do not upload images that are illegal, infringe third-party rights, or depict minors in an inappropriate manner.`,
  },
  {
    title: "6. Acceptable use",
    body: `You may not:\n\n• Attempt to reverse-engineer, scrape, or abuse the service\n• Use automated means to exceed plan limits\n• Share account access with others to circumvent per-account limits\n• Upload content that is illegal, abusive, or violates third-party intellectual property rights`,
  },
  {
    title: "7. Availability",
    body: `We aim for high availability but do not guarantee uninterrupted access. We may suspend the service for maintenance or in response to emergencies. We are not liable for losses caused by downtime.`,
  },
  {
    title: "8. Limitation of liability",
    body: `To the fullest extent permitted by law, Vellum's liability for any claim arising from use of the service is limited to the amount you paid in the 12 months preceding the claim. We are not liable for indirect, consequential, or incidental damages.`,
  },
  {
    title: "9. Termination",
    body: `We may suspend or terminate your account if you violate these terms, with or without notice. You may close your account at any time. On termination, your data will be deleted within 30 days.`,
  },
  {
    title: "10. Changes to these terms",
    body: `We may update these terms. Material changes will be notified by email at least 14 days before taking effect. Continued use after the effective date constitutes acceptance.`,
  },
  {
    title: "11. Governing law",
    body: `These terms are governed by the laws of the jurisdiction in which Vellum is incorporated. Disputes shall be resolved in the courts of that jurisdiction.`,
  },
  {
    title: "12. Contact",
    body: `For questions about these terms: hello@vellum.art`,
  },
];

export default function TermsPage() {
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
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 510, letterSpacing: "-0.035em", color: "var(--ink)", lineHeight: 1.05, marginBottom: 16 }}>Terms of Service</h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--stone)", letterSpacing: "0.04em" }}>
            Last updated: May 2026
          </p>
          <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 16, color: "var(--walnut)", lineHeight: 1.6, marginTop: 20, maxWidth: 560 }}>
            Plain language summary: use Vellum fairly, pay what you owe, own your images. The details are below.
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
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms" style={{ color: "var(--ink)" }}>Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
