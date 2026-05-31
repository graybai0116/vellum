"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Mark } from "@/components/ui/Mark";
import { EtherealShadow } from "@/components/ui/etheral-shadow";
import { ArrowRightIcon, CaretDownIcon } from "@phosphor-icons/react";
import { SignUpButton, useUser } from "@clerk/nextjs";

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

const FREE_FEATURES = ["10 analyses per month", "Palette extraction", "Prompt generation", "Save to library"];
const PRO_FEATURES  = ["Unlimited analyses", "Everything in Free", "Priority processing", "Export prompt formats"];

const PRINCIPLES = [
  { n: "01", title: "Read",    desc: "Drop any photograph, still, or painting." },
  { n: "02", title: "Extract", desc: "Palette, lighting, composition, mood — as structured language." },
  { n: "03", title: "Create",  desc: "A precise prompt, ready for any image model." },
];

function ScrollDown({ to }: { to: string }) {
  return (
    <div
      onClick={() => document.getElementById(to)?.scrollIntoView({ behavior: "smooth" })}
      style={{ animation: "scrollBounce 2.4s ease-in-out infinite", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}
    >
      <div style={{ background: "var(--chalk)", border: "1px solid var(--rule-strong)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bark)", boxShadow: "var(--shadow-1)" }}>
        <CaretDownIcon weight="thin" size={18} />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const [pastHero, setPastHero] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [mouseNearTop, setMouseNearTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.7);
      setAtTop(window.scrollY < 10);
    };
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

      {/* ─── NAV ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px",
        background: atTop ? "transparent" : "color-mix(in oklch, var(--paper) 80%, transparent)",
        backdropFilter: atTop ? "none" : "blur(14px)",
        borderBottom: atTop ? "1px solid transparent" : "1px solid rgba(185,172,151,0.25)",
        borderTop: "2px solid var(--terracotta)",
        transform: navVisible ? "translateY(0)" : "translateY(-100%)",
        opacity: navVisible ? 1 : 0,
        pointerEvents: navVisible ? "auto" : "none",
        transition: "transform 380ms cubic-bezier(0.22,0.61,0.36,1), opacity 260ms ease, background 320ms ease, border-color 320ms ease",
      }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Mark size={26} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 520, fontVariationSettings: '"opsz" 84', letterSpacing: "0.01em", color: "var(--ink)", lineHeight: 1 }}>VELLUM</span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--fg-3)" }}>
          {(["Example", "Manifesto", "Pricing"] as const).map((label) => (
            <a key={label} href={label === "Example" ? "#demo" : `#${label.toLowerCase()}`} style={{ padding: "6px 12px", borderRadius: 4, transition: "color 160ms var(--ease-out), background 160ms var(--ease-out)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.background = "rgba(60,40,22,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = ""; e.currentTarget.style.background = ""; }}>
              {label}
            </a>
          ))}

          <div style={{ width: 1, height: 16, background: "var(--rule-strong)", margin: "0 6px", opacity: 0.5 }} />

          <Link href="/sign-in" style={{ padding: "6px 12px", borderRadius: 4, transition: "color 160ms var(--ease-out), background 160ms var(--ease-out)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.background = "rgba(60,40,22,0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = ""; e.currentTarget.style.background = ""; }}>
            Sign in
          </Link>

          <Link href="/workspace" style={{ padding: "8px 16px", borderRadius: 4, background: "var(--terracotta)", color: "var(--chalk)", display: "inline-flex", alignItems: "center", gap: 6, transition: "background 160ms var(--ease-out)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--terracotta-deep)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--terracotta)"; }}>
            Open workspace <ArrowRightIcon weight="thin" size={15} />
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between", textAlign: "center",
        padding: "88px 32px 40px", position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-mute)", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20, animation: "blurUp 0.9s cubic-bezier(0.22,1,0.36,1) both" }}>
            <span style={{ width: 24, height: 1, background: "var(--rule-strong)" }} />
            A reading instrument for images
            <span style={{ width: 24, height: 1, background: "var(--rule-strong)" }} />
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(56px, 10vw, 160px)",
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

          <p style={{ maxWidth: 540, fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: "clamp(16px, 1.4vw, 20px)", lineHeight: 1.45, color: "var(--walnut)", margin: "20px 0 28px", fontWeight: 400, textAlign: "center", animation: "blurUp 1s cubic-bezier(0.22,1,0.36,1) 0.55s both" }}>
            Drop a photograph, a still, a painting. Vellum returns a precise prompt — palette, lighting, mood, composition — ready for any image model.
          </p>

          <div style={{ display: "flex", gap: 14, alignItems: "center", animation: "blurUp 1s cubic-bezier(0.22,1,0.36,1) 0.7s both" }}>
            <Link href="/workspace" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--ink)", color: "var(--chalk)", padding: "15px 24px", borderRadius: 4, fontSize: 14, fontWeight: 500, letterSpacing: "-0.005em", textDecoration: "none", transition: "all 220ms var(--ease-out)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--walnut)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--ink)"; }}>
              Open workspace <ArrowRightIcon weight="thin" size={17} />
            </Link>
            <a href="#pricing" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--walnut)", fontSize: 13, fontFamily: "var(--font-mono)", letterSpacing: "0.04em", textDecoration: "none", transition: "color 160ms var(--ease-out)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--terracotta)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--walnut)")}>
              See pricing →
            </a>
          </div>

          {/* Compatible with strip */}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, animation: "blurUp 1s cubic-bezier(0.22,1,0.36,1) 0.85s both" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-mute)" }}>Compatible with</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {["Midjourney", "DALL·E 3", "Flux", "Stable Diffusion", "Firefly"].map((m, i) => (
                <span key={m} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--stone)", letterSpacing: "0.02em", padding: "0 14px", borderLeft: i === 0 ? "none" : "1px solid var(--rule)" }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ScrollDown to="demo" />
      </section>

      {/* ─── DEMO ─── */}
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

        <ScrollDown to="compare" />
      </section>

      {/* ─── COMPARE ─── */}
      <section id="compare" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", padding: "60px 40px 48px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 28 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-mute)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexShrink: 0 }}>
            <span style={{ flex: "0 0 60px", height: 1, background: "var(--rule)" }} />
            One read. One result.
            <span style={{ flex: "0 0 60px", height: 1, background: "var(--rule)" }} />
          </div>

          <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 28px 1.1fr", gap: 24 }}>
            <div style={{ background: "var(--chalk)", border: "1px solid var(--rule-soft)", borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 20, minHeight: 0 }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--terracotta)" }}>In practice</div>
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

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--stone)", fontFamily: "var(--font-mono)", fontSize: 22 }}>→</div>

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

          <ScrollDown to="manifesto" />
        </div>
      </section>

      {/* ─── MANIFESTO ─── */}
      <section id="manifesto" style={{
        height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "60px 40px 48px", position: "relative", zIndex: 1,
      }}>
        {/* Two-tone editorial card */}
        <div style={{
          flex: 1, minHeight: 0, maxWidth: 1200, width: "100%", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1.15fr 1fr",
          borderRadius: 8, overflow: "hidden",
          boxShadow: "var(--shadow-3)", border: "1px solid var(--rule-soft)",
        }}>

          {/* Left — dark panel with quote */}
          <div style={{
            background: "var(--ink)", padding: "52px 56px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            position: "relative", overflow: "hidden",
          }}>
            {/* Decorative oversized quote mark */}
            <span aria-hidden style={{
              position: "absolute", bottom: -40, right: -10,
              fontFamily: "var(--font-accent)", fontStyle: "italic",
              fontSize: "clamp(240px, 28vw, 380px)", lineHeight: 1,
              color: "rgba(197,105,74,0.1)", userSelect: "none", pointerEvents: "none",
              letterSpacing: "-0.06em",
            }}>"</span>

            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--stone)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 20, height: 1, background: "var(--bark)" }} />
              Manifesto
            </div>

            <blockquote style={{
              fontFamily: "var(--font-accent)", fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(20px, 2.4vw, 36px)", lineHeight: 1.38,
              color: "var(--chalk)", letterSpacing: "-0.025em", margin: 0,
              position: "relative", zIndex: 1,
            }}>
              "Every image contains a hidden visual syntax — lighting, composition, texture, emotion, rhythm.
              <em style={{ color: "var(--terracotta)" }}> Vellum extracts that language.</em>"
            </blockquote>

            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--bark)", letterSpacing: "0.08em" }}>
              — VELLUM
            </div>
          </div>

          {/* Right — chalk panel with principles */}
          <div style={{
            background: "var(--chalk)", padding: "52px 48px",
            display: "flex", flexDirection: "column", justifyContent: "center", gap: 0,
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-mute)", marginBottom: 32 }}>
              How it works
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {PRINCIPLES.map(({ n, title, desc }, i) => (
                <div key={n} style={{
                  display: "grid", gridTemplateColumns: "28px 1fr",
                  gap: "0 16px", alignItems: "start",
                  paddingTop: i === 0 ? 0 : 24, marginTop: i === 0 ? 0 : 24,
                  borderTop: i === 0 ? "none" : "1px solid var(--rule-soft)",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--terracotta)", letterSpacing: "0.12em", paddingTop: 2 }}>{n}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 520, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1 }}>{title}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--walnut)", marginTop: 5, lineHeight: 1.55 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--rule)", fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 13, color: "var(--stone)", lineHeight: 1.6 }}>
              Not selling prompts. Selling <em style={{ color: "var(--walnut)", fontStyle: "normal" }}>Aesthetic Understanding</em>.
            </div>
          </div>
        </div>

        <ScrollDown to="pricing" />
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 40px 48px", position: "relative", zIndex: 1 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 900, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-mute)", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 16 }}>
              <span style={{ flex: "0 0 48px", height: 1, background: "var(--rule)" }} />
              Pricing
              <span style={{ flex: "0 0 48px", height: 1, background: "var(--rule)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 510, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.05 }}>
              One tool.{" "}
              <em style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", color: "var(--walnut)" }}>Two depths.</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Free */}
            <div style={{ background: "var(--chalk)", border: "1px solid var(--rule-soft)", borderRadius: 8, padding: "28px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 10 }}>Free</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 520, letterSpacing: "-0.04em", color: "var(--ink)", lineHeight: 1 }}>$0</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--stone)" }}>/month</span>
                </div>
                <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 13, color: "var(--walnut)", marginTop: 6 }}>The essential read.</p>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: 9, listStyle: "none", flex: 1 }}>
                {FREE_FEATURES.map(f => (
                  <li key={f} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "var(--walnut)" }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--terracotta)", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", color: "var(--walnut)", padding: "10px 18px", borderRadius: 4, fontSize: 13, fontWeight: 500, border: "1px solid var(--rule)", textDecoration: "none", transition: "all 160ms var(--ease-out)" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "var(--linen)"; el.style.borderColor = "var(--rule-strong)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.borderColor = "var(--rule)"; }}>
                Start free
              </Link>
            </div>

            {/* Pro */}
            <div style={{ background: "var(--ink)", borderRadius: 8, padding: "28px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--terracotta)", marginBottom: 10 }}>Pro</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 520, letterSpacing: "-0.04em", color: "var(--chalk)", lineHeight: 1 }}>$10</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mist)" }}>/month</span>
                </div>
                <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 13, color: "var(--mist)", marginTop: 6 }}>The full instrument.</p>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: 9, listStyle: "none", flex: 1 }}>
                {PRO_FEATURES.map(f => (
                  <li key={f} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "var(--linen)" }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--terracotta)", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up?plan=pro" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--terracotta)", color: "var(--chalk)", padding: "10px 18px", borderRadius: 4, fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "background 160ms var(--ease-out)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--terracotta-deep)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--terracotta)"; }}>
                Upgrade to Pro <ArrowRightIcon weight="thin" size={16} />
              </Link>
            </div>
          </div>
        </div>
        </div>
        <ScrollDown to="cta" />
      </section>

      {/* ─── FINAL CTA ─── */}
      <section id="cta" style={{ padding: "80px 40px", position: "relative", zIndex: 1 }}>
        <div style={{
          maxWidth: 700, margin: "0 auto",
          background: "var(--chalk)", border: "1px solid var(--rule-soft)",
          borderRadius: 8, padding: "56px 64px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
          textAlign: "center", boxShadow: "var(--shadow-2)",
        }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-mute)", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 32, height: 1, background: "var(--rule)" }} />
            Start now
            <span style={{ width: 32, height: 1, background: "var(--rule)" }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 510, letterSpacing: "-0.035em", color: "var(--ink)", lineHeight: 1.05 }}>
            Read your first<br />
            <em style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", color: "var(--walnut)" }}>image today.</em>
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--stone)", lineHeight: 1.6, maxWidth: 360 }}>
            Free to start. No credit card required.
          </p>
          {isSignedIn ? (
            <Link href="/workspace" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--ink)", color: "var(--chalk)", padding: "15px 28px", borderRadius: 4, fontSize: 14, fontWeight: 500, letterSpacing: "-0.005em", textDecoration: "none", transition: "background 220ms var(--ease-out)", marginTop: 4 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--walnut)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--ink)"; }}>
              Open workspace <ArrowRightIcon weight="thin" size={18} />
            </Link>
          ) : (
            <SignUpButton mode="modal">
              <button style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--ink)", color: "var(--chalk)", padding: "15px 28px", borderRadius: 4, fontSize: 14, fontWeight: 500, letterSpacing: "-0.005em", cursor: "pointer", transition: "background 220ms var(--ease-out)", marginTop: 4 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--walnut)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)"; }}>
                Get started free <ArrowRightIcon weight="thin" size={18} />
              </button>
            </SignUpButton>
          )}
        </div>
      </section>

      {/* ─── BACK TO TOP ─── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "fixed", bottom: 32, right: 32, zIndex: 40,
          width: 44, height: 44, borderRadius: "50%",
          background: "var(--ink)", color: "var(--chalk)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "var(--shadow-3)",
          opacity: pastHero ? 1 : 0,
          transform: pastHero ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 260ms var(--ease-out), transform 260ms var(--ease-out), background 160ms var(--ease-out)",
          pointerEvents: pastHero ? "auto" : "none",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--terracotta)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)"; }}
        aria-label="Back to top"
      >
        <CaretDownIcon weight="thin" size={18} style={{ transform: "rotate(180deg)" }} />
      </button>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: "1px solid var(--rule-soft)", padding: "28px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.04em" }}>
          <div>VELLUM · Visual language, extracted</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Link href="/workspace" style={{ transition: "color 160ms" }}>Workspace</Link>
            <a href="#pricing" style={{ transition: "color 160ms" }}>Pricing</a>
            <a href="#manifesto" style={{ transition: "color 160ms" }}>Manifesto</a>
            <a href="mailto:hello@vellum.art" style={{ transition: "color 160ms" }}>hello@vellum.art</a>
          </div>
          <div>© 2026 Vellum</div>
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--rule-soft)", display: "flex", gap: 16, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-faint)", letterSpacing: "0.04em" }}>
          <Link href="/privacy" style={{ transition: "color 160ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--stone)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}>Privacy Policy</Link>
          <Link href="/terms" style={{ transition: "color 160ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--stone)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}>Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
