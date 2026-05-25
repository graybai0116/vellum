"use client";
import { useEffect } from "react";
import { Check } from "@phosphor-icons/react";

export function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [msg, onDone]);

  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%",
      transform: `translateX(-50%) translateY(${msg ? 0 : 16}px)`,
      opacity: msg ? 1 : 0,
      transition: "all 320ms var(--ease-out)",
      pointerEvents: "none", zIndex: 200,
    }}>
      <div style={{
        background: "var(--ink)", color: "var(--chalk)",
        padding: "12px 18px", borderRadius: "var(--r-sm)",
        boxShadow: "var(--shadow-2)",
        fontSize: 13, letterSpacing: "-0.005em",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Check weight="thin" size={16} color="var(--honey)" />
        {msg}
      </div>
    </div>
  );
}
