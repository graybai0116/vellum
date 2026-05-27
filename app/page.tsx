"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Mark } from "@/components/ui/Mark";
import { EtherealShadow } from "@/components/ui/etheral-shadow";
import { ArrowRightIcon, CaretDownIcon } from "@phosphor-icons/react";

const SAMPLE_PALETTE = [
  { hex: "#2D4357" }, { hex: "#4A8D85" }, { hex: "#C0B8AC" },
  { hex: "#EBE5DA" }, { hex: "#6DBFB5" },
];

const DEMO_FACETS = [
  { lbl: "Mood", v: "Calm · Restrained · Lived-in" },
  { lbl: "Lighting", v: "Soft natural, camera-left, late afternoon" },
  { lbl: "Composition", v: "Centered, negative space right, eye-level" },
  { lbl: "Texture", v: "Mid-format film grain, soft falloff" },
];

export default function LandingPage() {
  const [pastHero, setPastHero] = useState(false);
  const [mouseNearTop, setMouseNearTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => setMouseNearTop(e.clientY < 72);
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const navVisible = !pastHero || mouseNearTop;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", position: "relative" }}>
      <EtherealShadow
        color="rgba(197, 105, 74, 0.92)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.1 }}
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      />

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "22px 40px",
        background: "rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(4px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
        transform: navVisible ? "translateY(0)" : "translateY(-100%)",
        opacity: navVisible ? 1 : 0,
        pointerEvents: navVisible ? "auto" : "none",
        transition: "transform 380ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 260ms ease",
      }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <Mark size={28} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 520, fontVariationSettings: '"opsz" 84', letterSpacing: "0.005em", color: "var(--ink)", lineHeight: 1 }}>VELLUM</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--fg-3)" }}>
          <Link href="/workspace?screen=library" style={{ transition: "color 160ms var(--ease-out)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}>Library</Link>
          <a href="#manifesto" style={{ transition: "color 160ms var(--ease-out)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}>Manifesto</a>
          <Link href="/workspace" style={{ padding: "8px 16px", borderRadius: 4, background: "var(--ink)", color: "var(--chalk)", display: "inline-flex", alignItems: "center", gap: 6, transition: "background 160ms var(--ease-out)", textDecoration: "none" }}>
            Open workspace <ArrowRightIcon weight="thin" size={16} />
          </Link>
        </div>
      </nav>

      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between", textAlign: "center",
        padding: "120px 32px 48px", position: "relative", zIndex: 1,
      }}>
        <div style={{ position: "absolute", top: 100, left: 40, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--terracotta)" }} />
          <span>v 0.4 — beta</span>
        </div>
        <div style={{ position: "absolute", top: 100, right: 40, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.04em" }}>
          <span>2,847 analyses today</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-mute)", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 36, animation: "blurUp 0.9s cubic-bezier(0.22,1,0.36,1) both" }}>
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
            <span style={{ display: "block", animation: "blurUp 1s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}>Visual language,</span>
            <span style={{ display: "block", animation: "blurUp 1s cubic-bezier(0.22,1,0.36,1) 0.35s both" }}>
              <em style={{ fontStyle: "italic", fontFamily: "var(--font-accent)", fontWeight: 450, color: "var(--walnut)" }}>extracted</em>
              <span style={{ color: "var(--terracotta)" }}>.</span>
            </span>
          </h1>

          <p style={{ maxWidth: 580, fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: "clamp(18px, 1.5vw, 22px)", lineHeight: 1.45, color: "var(--walnut)", margin: "36px 0 44px", fontWeight: 400, textAlign: "center", animation: "blurUp 1s cubic-bezier(0.22,1,0.36,1) 0.55s both" }}>
            Drop a photograph, a still, a painting. Vellum returns a precise prompt — palette, lighting, mood, composition — ready for any image model.
          </p>

          <div style={{ display: "flex", gap: 14, alignItems: "center", animation: "blurUp 1s cubic-bezier(0.22,1,0.36,1) 0.7s both" }}>
            <Link href="/workspace" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--ink)", color: "var(--chalk)", padding: "18px 28px", borderRadius: 4, fontSize: 14, fontWeight: 500, letterSpacing: "-0.005em", textDecoration: "none", transition: "all 220ms var(--ease-out)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--walnut)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--ink)"; }}
            >
              Open workspace <ArrowRightIcon weight="thin" size={18} />
            </Link>
          </div>
        </div>

        {/* Scroll indicator — pinned to bottom via space-between, never overlaps CTA */}
        <div
          onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
          style={{
            animation: "scrollBounce 2.4s ease-in-out infinite",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            cursor: "pointer",
          }}
        >
          <div style={{
            background: "var(--chalk)",
            border: "1px solid var(--rule-strong)",
            borderRadius: "50%", width: 44, height: 44,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--bark)",
            boxShadow: "var(--shadow-1)",
          }}>
            <CaretDownIcon weight="thin" size={18} />
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--stone)",
          }}>
            Learn more about Vellum
          </div>
        </div>
      </section>

      <section id="demo" style={{ maxWidth: 1200, margin: "0 auto", padding: "90px 40px 48px", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-mute)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexShrink: 0 }}>
            <span style={{ flex: "0 0 60px", height: 1, background: "var(--rule)" }} />
            One image, one read
            <span style={{ flex: "0 0 60px", height: 1, background: "var(--rule)" }} />
          </div>

          <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1.05fr 28px 1fr", gap: 24 }}>
            <div style={{ background: "var(--linen)", borderRadius: 4, overflow: "hidden", position: "relative", boxShadow: "var(--shadow-1)" }}>
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
        </div>

        {/* Scroll indicator to comparison section */}
        <div
          onClick={() => document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" })}
          style={{ animation: "scrollBounce 2.4s ease-in-out infinite", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <div style={{ background: "var(--chalk)", border: "1px solid var(--rule-strong)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bark)", boxShadow: "var(--shadow-1)" }}>
            <CaretDownIcon weight="thin" size={18} />
          </div>
        </div>
      </section>

      {/* Before / After — fits exactly one viewport */}
      <section id="compare" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", padding: "60px 40px 48px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-mute)", textAlign: "center", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexShrink: 0 }}>
            <span style={{ flex: "0 0 60px", height: 1, background: "var(--rule)" }} />
            One read. One result.
            <span style={{ flex: "0 0 60px", height: 1, background: "var(--rule)" }} />
          </div>

          <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 28px 1.1fr", gap: 24 }}>

            {/* Left — chalk card: story + source image fills remaining height */}
            <div style={{ background: "var(--chalk)", border: "1px solid var(--rule-soft)", borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 20, minHeight: 0 }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--terracotta)" }}>Proof of concept</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 520, letterSpacing: "-0.02em", fontVariationSettings: '"opsz" 84', color: "var(--ink)", lineHeight: 1.1, marginTop: 8 }}>
                  Drop an image.<br />
                  <em style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontWeight: 450, color: "var(--walnut)" }}>Get the prompt that made it.</em>
                </h3>
              </div>

              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.7, color: "var(--walnut)", flexShrink: 0 }}>
                We ran this Chinese ink painting through Vellum. It extracted palette, lighting, composition, and mood — then pasted the result straight into ChatGPT. No manual prompt writing. No guesswork.
              </div>

              <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-mute)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, flexShrink: 0 }}>01 · Source image</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/compare-original.jpg" alt="Original painting" style={{ flex: 1, minHeight: 0, width: "100%", objectFit: "contain", display: "block", background: "var(--bg-sunken)", borderRadius: 4 }} />
                <a
                  href="https://www.creativefabrica.com/product/art-visual-design-artistic-design/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-faint)", letterSpacing: "0.06em", textDecoration: "underline", textDecorationColor: "var(--rule)", textUnderlineOffset: 3, flexShrink: 0 }}
                >
                  © Creative Fabrica — Art Visual Design
                </a>
              </div>
            </div>

            {/* Center arrow */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--stone)", fontFamily: "var(--font-mono)", fontSize: 22 }}>→</div>

            {/* Right — generated image fills full height */}
            <div style={{ background: "var(--linen)", borderRadius: 4, overflow: "hidden", position: "relative", boxShadow: "var(--shadow-1)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/compare-generated.png" alt="Generated with Vellum prompt" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px", background: "color-mix(in oklch, var(--paper) 85%, transparent)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--terracotta)", letterSpacing: "0.14em", textTransform: "uppercase" }}>02</span>
                <span style={{ width: 1, height: 10, background: "var(--rule-strong)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-mute)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Generated · ChatGPT × Vellum prompt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="manifesto" style={{ borderTop: "1px solid var(--rule-soft)", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.04em", position: "relative", zIndex: 1 }}>
        <div>VELLUM · Visual language, extracted</div>
        <div style={{ display: "flex", gap: 22 }}>
          <Link href="/workspace" style={{ transition: "color 160ms" }}>Workspace</Link>
          <Link href="/workspace?screen=library" style={{ transition: "color 160ms" }}>Library</Link>
          <a href="mailto:hello@vellum.art" style={{ transition: "color 160ms" }}>hello@vellum.art</a>
        </div>
        <div>© 2026 — v 0.4</div>
      </footer>
    </div>
  );
}
