"use client";
import { useState, useEffect } from "react";
import { Check, Quotes } from "@phosphor-icons/react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const TOKEN_LIST = [
  "reading light",
  "sampling palette",
  "tracing edges",
  "estimating focal length",
  "naming mood",
  "matching references",
];

export function AnalyzingScreen({
  image, onDone, ready,
}: {
  image: { src: string; name: string };
  onDone: () => void;
  ready?: boolean;
}) {
  const [tokens, setTokens] = useState<string[]>([]);
  const [animDone, setAnimDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i >= TOKEN_LIST.length) { clearInterval(iv); return; }
      setTokens((prev) => [...prev, TOKEN_LIST[i]]);
      i++;
    }, 220);
    const t2 = setTimeout(() => setAnimDone(true), 3200);
    return () => { clearTimeout(t2); clearInterval(iv); };
  }, []);

  // Call onDone when animation finished AND API ready (or no API needed)
  useEffect(() => {
    if (animDone && ready !== false) onDone();
  }, [animDone, ready, onDone]);

  return (
    <div className="screen fade-enter">
      <div className="container" style={{ paddingTop: 48, paddingBottom: 96 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <Eyebrow num="03">Reading the image</Eyebrow>
          <span className="meta-mono" style={{ color: "var(--terracotta)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              display: "inline-block", width: 6, height: 6, borderRadius: "50%",
              background: "var(--terracotta)",
              animation: "pulse 1.4s ease-in-out infinite",
            }} />
            analysing · ≈ 3s
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)", gap: 40 }}>
          <div style={{
            position: "relative", background: "var(--chalk)",
            border: "1px solid var(--rule-soft)", borderRadius: "var(--r-lg)", padding: 14,
          }}>
            <div style={{
              position: "relative", borderRadius: 4, overflow: "hidden",
              aspectRatio: "4 / 5", background: "var(--ink)",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.95)" }} />
              <div style={{
                position: "absolute", left: 0, right: 0, top: 0, height: "32%",
                background: "linear-gradient(180deg, rgba(245,233,206,0) 0%, rgba(245,233,206,0.22) 60%, rgba(245,233,206,0.55) 100%)",
                mixBlendMode: "screen", pointerEvents: "none",
                animation: "scan 1.6s var(--ease-in-out) infinite alternate",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(245,233,206,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(245,233,206,0.15) 1px, transparent 1px)",
                backgroundSize: "33.33% 33.33%", pointerEvents: "none",
              }} />
              {(["tl", "tr", "bl", "br"] as const).map((p) => (
                <span key={p} style={{
                  position: "absolute", width: 14, height: 14, border: "1px solid var(--chalk)",
                  ...(p === "tl" ? { top: 8, left: 8, borderRight: "none", borderBottom: "none" } : {}),
                  ...(p === "tr" ? { top: 8, right: 8, borderLeft: "none", borderBottom: "none" } : {}),
                  ...(p === "bl" ? { bottom: 8, left: 8, borderRight: "none", borderTop: "none" } : {}),
                  ...(p === "br" ? { bottom: 8, right: 8, borderLeft: "none", borderTop: "none" } : {}),
                }} />
              ))}
              <div style={{
                position: "absolute", left: 14, bottom: 14,
                display: "flex", gap: 8, alignItems: "center",
                background: "rgba(34,26,20,0.62)", backdropFilter: "blur(8px)",
                padding: "6px 12px", borderRadius: 999,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terracotta)" }} />
                <span className="meta-mono" style={{ color: "var(--chalk)" }}>{image.name}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
            <Eyebrow>Stream</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {tokens.map((t, i) => (
                <div key={i} style={{
                  display: "flex", gap: 14, alignItems: "center",
                  animation: "tokenIn 360ms var(--ease-out) both",
                }}>
                  <span className="meta-mono" style={{ color: "var(--terracotta)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 16, color: "var(--walnut)" }}>{t}</span>
                  <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
                  <Check weight="thin" size={14} color="var(--sage)" />
                </div>
              ))}
              {tokens.length < TOKEN_LIST.length && (
                <div className="meta-mono" style={{ color: "var(--fg-mute)", marginTop: 4 }}>
                  {["●", "●", "●"].map((dot, i) => (
                    <span key={i} style={{
                      display: "inline-block", opacity: 0,
                      animation: `dotPulse 1.2s var(--ease-in-out) infinite`,
                      animationDelay: `${i * 180}ms`,
                    }}>{dot}</span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: 16, padding: 16, background: "var(--chalk)", borderRadius: "var(--r-md)", border: "1px solid var(--rule-soft)" }}>
              <div className="meta-mono" style={{ color: "var(--fg-mute)" }}>
                <Quotes weight="thin" size={14} style={{ marginRight: 6, color: "var(--terracotta)", display: "inline" }} />
                We never describe what the image <em>is about</em>. Only how it looks.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
        @keyframes tokenIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
        @keyframes scan { 0% { transform: translateY(-2%); } 100% { transform: translateY(100%); } }
        @keyframes dotPulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
