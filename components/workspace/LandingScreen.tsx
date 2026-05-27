"use client";
import { useRef, useState } from "react";
import { ArrowUp, PaintBrush, Camera, ArrowRight } from "@phosphor-icons/react";
import { InlinePhotoSwap } from "@/components/ui/InlinePhotoSwap";

export type AnalysisMode = "style" | "realism";

interface UploadedImage {
  name: string;
  dataUrl: string;
}

export function LandingScreen({
  onUpload,
  onUploadUrl,
}: {
  onUpload: (img: UploadedImage, mode: AnalysisMode) => void;
  onUploadUrl: (url: string, mode: AnalysisMode) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<AnalysisMode>("style");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");

  const handleFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onUpload({ name: f.name, dataUrl: e.target?.result as string }, mode);
    reader.readAsDataURL(f);
  };

  const handleUrlSubmit = () => {
    const url = urlInput.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setUrlError("Must be a valid http/https URL");
      return;
    }
    setUrlError("");
    onUploadUrl(url, mode);
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

        {/* Mode toggle */}
        <div style={{ display: "flex", background: "var(--bg-sunken)", borderRadius: "var(--r-pill)", padding: 3, gap: 2 }}>
          {([
            { id: "style" as const, label: "Visual Style", sub: "Art · Editorial · Cinematic", Icon: PaintBrush },
            { id: "realism" as const, label: "Photo Fidelity", sub: "Portrait · Candid · Realism", Icon: Camera },
          ]).map(({ id, label, sub, Icon }) => (
            <button key={id} onClick={() => setMode(id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 20px", borderRadius: "var(--r-pill)",
              background: mode === id ? "var(--chalk)" : "transparent",
              boxShadow: mode === id ? "var(--shadow-1)" : "none",
              border: mode === id ? "1px solid var(--rule)" : "1px solid transparent",
              transition: "all 180ms var(--ease-out)", cursor: "pointer",
            }}>
              <Icon weight={mode === id ? "fill" : "thin"} size={16} color={mode === id ? "var(--terracotta)" : "var(--fg-mute)"} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: mode === id ? "var(--ink)" : "var(--fg-3)", lineHeight: 1.2 }}>{label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: mode === id ? "var(--stone)" : "var(--fg-mute)", letterSpacing: "0.04em", marginTop: 2 }}>{sub}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          style={{
            width: "100%",
            background: dragging ? "var(--chalk)" : "transparent",
            border: `1px dashed ${dragging ? "var(--terracotta)" : "var(--rule-strong)"}`,
            borderRadius: "var(--r-lg)", padding: "72px 48px",
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
          <div className="meta-mono" style={{ color: "var(--rust)" }}>
            Drop a file or click to browse
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFiles(e.target.files)} />
        </div>

        {/* URL input */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="meta-mono" style={{ color: "var(--fg-mute)", textAlign: "center" }}>or paste an image URL</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleUrlSubmit(); }}
              style={{
                flex: 1, padding: "11px 14px",
                fontFamily: "var(--font-mono)", fontSize: 12,
                background: "var(--bg-sunken)", border: `1px solid ${urlError ? "var(--terracotta)" : "var(--rule)"}`,
                borderRadius: "var(--r-sm)", color: "var(--walnut)",
                outline: "none", transition: "border-color 160ms var(--ease-out)",
              }}
              onFocus={(e) => { if (!urlError) e.currentTarget.style.borderColor = "var(--walnut)"; }}
              onBlur={(e) => { if (!urlError) e.currentTarget.style.borderColor = "var(--rule)"; }}
            />
            <button
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="btn btn-accent"
              style={{ flexShrink: 0 }}
            >
              Analyze <ArrowRight weight="thin" size={14} />
            </button>
          </div>
          {urlError && (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--terracotta)" }}>{urlError}</div>
          )}
        </div>
      </div>
    </div>
  );
}
