"use client";
import { useState } from "react";
import { X, Crown } from "@phosphor-icons/react";

export function UpgradePrompt({ onClose }: { onClose: () => void }) {
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setUpgrading(false);
  };

  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 300,
      width: 300,
      background: "var(--ink)",
      borderRadius: "var(--r-lg)",
      boxShadow: "0 12px 40px rgba(20,14,10,0.55), 0 2px 8px rgba(20,14,10,0.3)",
      padding: "20px",
      animation: "slideUpFade 260ms var(--ease-out) both",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Crown weight="thin" size={15} style={{ color: "#C4A76A" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", color: "#C4A76A", textTransform: "uppercase" as const }}>Pro</span>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 24, height: 24, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <X weight="thin" size={12} />
        </button>
      </div>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 500,
        color: "var(--chalk)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 8,
      }}>
        Unlock all formats
      </div>
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 12,
        color: "rgba(255,255,255,0.45)", lineHeight: 1.65, marginBottom: 18,
      }}>
        Midjourney, FLUX, DALL-E, Gemini, and Stable Diffusion — plus Compare mode and unlimited monthly analyses.
      </p>
      <button
        onClick={handleUpgrade}
        disabled={upgrading}
        style={{
          width: "100%", padding: "10px 0",
          background: upgrading ? "rgba(255,255,255,0.1)" : "var(--chalk)",
          color: upgrading ? "rgba(255,255,255,0.3)" : "var(--ink)",
          borderRadius: "var(--r-sm)", fontSize: 13, fontWeight: 600,
          cursor: upgrading ? "default" : "pointer",
          letterSpacing: "0.01em",
          transition: "background 140ms var(--ease-out)",
          border: "none",
        }}
      >
        {upgrading ? "..." : "Upgrade · $10 / month"}
      </button>
    </div>
  );
}
