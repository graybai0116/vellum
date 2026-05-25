"use client";
import { useRef, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { InlinePhotoSwap } from "@/components/ui/InlinePhotoSwap";
import { LibraryItem } from "@/lib/data";

interface UploadedImage {
  name: string;
  dataUrl: string;
}

export function LandingScreen({
  onUpload, onNavigate,
}: {
  onUpload: (img: UploadedImage) => void;
  onNavigate: (s: "results-sample") => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onUpload({ name: f.name, dataUrl: e.target?.result as string });
    reader.readAsDataURL(f);
  };

  return (
    <div className="screen fade-enter" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "min(720px, 88vw)", display: "flex", flexDirection: "column", alignItems: "center", gap: 28, padding: "48px 24px 96px" }}>
        <div style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Workspace</div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4.4vw, 56px)",
            letterSpacing: "-0.03em", lineHeight: 1.1,
            color: "var(--ink)", fontWeight: 500,
            display: "inline-flex", flexWrap: "wrap",
            justifyContent: "center", alignItems: "center",
            columnGap: "0.22em", rowGap: "0.1em",
          }}>
            <span>Drop&nbsp;an</span>
            <InlinePhotoSwap />
            <span>to <span style={{ fontFamily: "var(--font-accent)", fontStyle: "italic" }}>read</span> it.</span>
          </h1>

          <ol style={{
            display: "flex", justifyContent: "center", flexWrap: "wrap",
            gap: 22, rowGap: 8, marginTop: 22,
            listStyle: "none", padding: 0,
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--fg-mute)", letterSpacing: "0.08em",
          }}>
            {["Drop an image", "We read its language", "Copy the prompt"].map((step, i) => (
              <li key={step} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 16, height: 16, borderRadius: "50%",
                  border: "1px solid var(--rule-strong)",
                  color: "var(--terracotta)",
                  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: 0,
                }}>{i + 1}</span>
                <span style={{ color: "var(--walnut)" }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          style={{
            width: "100%",
            background: dragging ? "var(--chalk)" : "transparent",
            border: `1px dashed ${dragging ? "var(--terracotta)" : "var(--rule-strong)"}`,
            borderRadius: "var(--r-lg)", padding: "88px 48px",
            cursor: "pointer", transition: "all 220ms var(--ease-out)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            border: "1px solid var(--rule-strong)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--walnut)", background: "var(--chalk)",
          }}>
            <ArrowUp weight="thin" size={22} />
          </div>
          <div className="meta-mono" style={{
            color: "var(--fg-mute)", display: "flex", flexWrap: "wrap",
            justifyContent: "center", alignItems: "center", columnGap: 14, rowGap: 6,
          }}>
            <span style={{ color: "var(--rust)", borderBottom: "1px solid color-mix(in oklch, var(--rust) 30%, transparent)" }}>
              Drop a file
            </span>
            <span style={{ color: "var(--fg-faint)" }}>·</span>
            <span>paste a URL with ⌘V</span>
            <span style={{ color: "var(--fg-faint)" }}>·</span>
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate("results-sample"); }}
              style={{ color: "var(--rust)", borderBottom: "1px solid color-mix(in oklch, var(--rust) 30%, transparent)", background: "none", border: "none", cursor: "pointer", font: "inherit" }}
            >try a sample</button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFiles(e.target.files)} />
        </div>
      </div>
    </div>
  );
}
