"use client";
import { useState } from "react";
import { PaletteColor } from "@/lib/data";

export function PaletteStrip({
  palette, height = 56, withLabels = false, copyable = false, onToast,
}: {
  palette: PaletteColor[];
  height?: number;
  withLabels?: boolean;
  copyable?: boolean;
  onToast?: (msg: string) => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopied(hex);
    onToast?.(`${hex} copied`);
    setTimeout(() => setCopied(null), 1100);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${palette.length}, 1fr)`,
        gap: 1, borderRadius: "var(--r-sm)", overflow: "hidden",
        border: "1px solid var(--rule-soft)",
      }}>
        {palette.map((c) => (
          <button
            key={c.hex}
            onClick={() => copyable && copy(c.hex)}
            title={`${c.name} · ${c.hex}`}
            style={{
              background: c.hex, height,
              cursor: copyable ? "copy" : "default",
              position: "relative",
              transition: "filter var(--t-fast) var(--ease-out)",
            }}
            onMouseEnter={(e) => copyable && (e.currentTarget.style.filter = "brightness(1.06)")}
            onMouseLeave={(e) => copyable && (e.currentTarget.style.filter = "none")}
          >
            {copied === c.hex && (
              <span style={{
                position: "absolute", inset: 0, display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "var(--chalk)", fontFamily: "var(--font-mono)", fontSize: 10,
                background: "rgba(34,26,20,.45)",
              }}>copied</span>
            )}
          </button>
        ))}
      </div>
      {withLabels && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${palette.length}, 1fr)`, gap: 1 }}>
          {palette.map((c) => (
            <div key={c.hex} style={{ paddingTop: 4 }}>
              <div className="meta-mono" style={{ color: "var(--fg-2)" }}>{c.hex.toUpperCase()}</div>
              <div className="meta-mono" style={{ color: "var(--fg-mute)", marginTop: 2 }}>{c.role.toLowerCase()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
