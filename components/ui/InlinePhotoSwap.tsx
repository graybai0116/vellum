"use client";
import { useState, useEffect, useMemo } from "react";
import { LIBRARY } from "@/lib/data";

export function InlinePhotoSwap() {
  const samples = useMemo(() => LIBRARY.slice(0, 5).map((x) => x.image), []);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setIdx((n) => (n + 1) % samples.length), 2400);
    return () => clearInterval(iv);
  }, [samples.length]);

  return (
    <span
      aria-label="image"
      style={{
        display: "inline-block", width: "1.5em", height: "1.5em",
        position: "relative", verticalAlign: "middle",
        margin: "0 0.18em", transform: "translateY(-0.06em)",
      }}
    >
      <span style={{
        position: "absolute", inset: 0, background: "var(--linen)",
        borderRadius: 5, transform: "rotate(7deg) translate(0.18em, 0.08em)",
        boxShadow: "0 4px 12px -4px rgba(34,26,20,0.18)", opacity: 0.6,
      }} />
      <span style={{
        position: "absolute", inset: 0, background: "var(--chalk)",
        borderRadius: 5, transform: "rotate(-4deg) translate(-0.10em, 0.02em)",
        boxShadow: "0 6px 14px -6px rgba(34,26,20,0.22)",
      }} />
      <span style={{
        position: "absolute", inset: 0, borderRadius: 5, overflow: "hidden",
        background: "var(--ink)", border: "3px solid var(--chalk)",
        boxShadow: "0 10px 22px -8px rgba(34,26,20,0.35)",
        transform: "rotate(2deg)",
      }}>
        {samples.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt=""
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: i === idx ? 1 : 0,
              transition: "opacity 700ms var(--ease-out)",
            }}
          />
        ))}
        <span style={{
          position: "absolute", top: 3, left: 3, width: 6, height: 6,
          borderTop: "1px solid rgba(245,233,206,0.9)",
          borderLeft: "1px solid rgba(245,233,206,0.9)", pointerEvents: "none",
        }} />
        <span style={{
          position: "absolute", bottom: 3, right: 3, width: 6, height: 6,
          borderBottom: "1px solid rgba(245,233,206,0.9)",
          borderRight: "1px solid rgba(245,233,206,0.9)", pointerEvents: "none",
        }} />
      </span>
    </span>
  );
}
