"use client";
import Link from "next/link";
import { Mark } from "@/components/ui/Mark";
import { EtherealShadow } from "@/components/ui/etheral-shadow";
import { ArrowRight } from "@phosphor-icons/react";

const SAMPLE_PALETTE = [
  { hex: "#1F1611" }, { hex: "#5A4634" }, { hex: "#A38A6E" },
  { hex: "#D8C4A4" }, { hex: "#C5694A" },
];

const DEMO_FACETS = [
  { lbl: "Mood", v: "Calm · Restrained · Lived-in" },
  { lbl: "Lighting", v: "Soft natural, camera-left, late afternoon" },
  { lbl: "Composition", v: "Centered, negative space right, eye-level" },
  { lbl: "Texture", v: "Mid-format film grain, soft falloff" },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", position: "relative" }}>
      <EtherealShadow
        color="rgba(197, 105, 74, 0.92)"
        animation={{ scale: 100, speed: 95 }}
        noise={{ opacity: 1, scale: 1.1 }}
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      />

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "22px 40px",
        backdropFilter: "blur(20px) saturate(1.4)",
      }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <Mark size={28} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 520, fontVariationSettings: '"opsz" 84', letterSpacing: "0.005em", color: "var(--ink)", lineHeight: 1 }}>VELLUM</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--fg-3)" }}>
          <Link href="/workspace" style={{ transition: "color 160ms var(--ease-out)" }}>Library</Link>
          <a href="#manifesto" style={{ transition: "color 160ms var(--ease-out)" }}>Manifesto</a>
          <Link href="/workspace" style={{ padding: "8px 16px", borderRadius: 4, background: "var(--ink)", color: "var(--chalk)", display: "inline-flex", alignItems: "center", gap: 6, transition: "background 160ms var(--ease-out)", textDecoration: "none" }}>
            Open workspace <ArrowRight weight="thin" size={16} />
          </Link>
        </div>
      </nav>

      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "140px 32px 80px", position: "relative", zIndex: 1,
      }}>
        <div style={{ position: "absolute", top: 100, left: 40, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--terracotta)" }} />
          <span>v 0.4 — beta</span>
        </div>
        <div style={{ position: "absolute", top: 100, right: 40, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.04em" }}>
          <span>2,847 analyses today</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-mute)", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
            <span style={{ width: 24, height: 1, background: "var(--rule-strong)" }} />
            A reading instrument for images
            <span style={{ width: 24, height: 1, background: "var(--rule-strong)" }} />
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(64px, 11vw, 184px)",
            lineHeight: 0.92, letterSpacing: "-0.045em",
            fontWeight: 480, fontVariationSettings: '"opsz" 144, "SOFT" 50',
            color: "var(--ink)", maxWidth: 1400, textAlign: "center",
          }}>
            Visual language,<br />
            <em style={{ fontStyle: "italic", fontFamily: "var(--font-accent)", fontWeight: 450, color: "var(--walnut)" }}>extracted</em>
            <span style={{ color: "var(--terracotta)" }}>.</span>
          </h1>

          <p style={{ maxWidth: 580, fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: "clamp(18px, 1.5vw, 22px)", lineHeight: 1.45, color: "var(--walnut)", margin: "36px 0 44px", fontWeight: 400, textAlign: "center" }}>
            Drop a photograph, a still, a painting. Vellum returns a precise prompt — palette, lighting, mood, composition — ready for any image model.
          </p>

          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Link href="/workspace" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--ink)", color: "var(--chalk)", padding: "18px 28px", borderRadius: 4, fontSize: 14, fontWeight: 500, letterSpacing: "-0.005em", textDecoration: "none", transition: "all 220ms var(--ease-out)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--walnut)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--ink)"; }}
            >
              Open workspace <ArrowRight weight="thin" size={18} />
            </Link>
            <a href="#demo" style={{ fontSize: 14, color: "var(--fg-3)", borderBottom: "1px solid var(--rule)", paddingBottom: 2, textDecoration: "none", transition: "all 160ms var(--ease-out)" }}>
              See an example
            </a>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 28, left: 40, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.04em" }}>
          MIDJOURNEY · STABLE DIFFUSION · FLUX · IDEOGRAM
        </div>
        <div style={{ position: "absolute", bottom: 28, right: 40, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.04em" }}>
          SCROLL ↓
        </div>
      </section>

      <section id="demo" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 120px", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-mute)", textAlign: "center", marginBottom: 36, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <span style={{ flex: "0 0 60px", height: 1, background: "var(--rule)" }} />
          One image, one read
          <span style={{ flex: "0 0 60px", height: 1, background: "var(--rule)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 28px 1fr", gap: 24, alignItems: "stretch" }}>
          <div style={{ aspectRatio: "4 / 5", background: "var(--linen)", borderRadius: 4, overflow: "hidden", position: "relative", boxShadow: "var(--shadow-1)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1100&q=80&auto=format&fit=crop" alt="Editorial interior" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, display: "flex" }}>
              {SAMPLE_PALETTE.map((c, i) => <span key={i} style={{ flex: 1, background: c.hex }} />)}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--stone)", fontFamily: "var(--font-mono)", fontSize: 22 }}>→</div>

          <div style={{ background: "var(--chalk)", border: "1px solid var(--rule-soft)", borderRadius: 8, padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--terracotta)" }}>Analysis · 312 chars</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 520, letterSpacing: "-0.02em", fontVariationSettings: '"opsz" 84', color: "var(--ink)", lineHeight: 1.05, marginTop: 6 }}>Editorial interior.</h3>
            </div>

            <div style={{ display: "flex", gap: 4 }}>
              {SAMPLE_PALETTE.map((c, i) => <span key={i} style={{ flex: 1, height: 28, borderRadius: 3, background: c.hex }} />)}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
              {DEMO_FACETS.map((f) => (
                <div key={f.lbl}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-mute)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{f.lbl}</div>
                  <div style={{ fontSize: 13, color: "var(--walnut)", lineHeight: 1.45 }}>{f.v}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--bg-sunken)", padding: "14px 16px", borderRadius: 4, fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.6, color: "var(--walnut)" }}>
              A muted interior tableau bathed in{" "}
              <span style={{ color: "#b08230" }}>soft late-afternoon light</span> from camera-left.{" "}
              <span style={{ color: "var(--terracotta)" }}>Walnut wood</span> and warm{" "}
              <span style={{ color: "var(--terracotta)" }}>cream</span> walls anchor the composition; a single{" "}
              <span style={{ color: "var(--terracotta)" }}>terracotta</span> object draws the eye. The camera is held a quiet half-step back,{" "}
              <span style={{ color: "var(--sage)" }}>mid-format on 35mm-equivalent</span> film, eye-level.
            </div>
          </div>
        </div>
      </section>

      <footer id="manifesto" style={{ borderTop: "1px solid var(--rule-soft)", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.04em", position: "relative", zIndex: 1 }}>
        <div>VELLUM · Visual language, extracted</div>
        <div style={{ display: "flex", gap: 22 }}>
          <Link href="/workspace" style={{ transition: "color 160ms" }}>Workspace</Link>
          <Link href="/workspace" style={{ transition: "color 160ms" }}>Library</Link>
          <a href="mailto:hello@vellum.art" style={{ transition: "color 160ms" }}>hello@vellum.art</a>
        </div>
        <div>© 2026 — v 0.4</div>
      </footer>
    </div>
  );
}
