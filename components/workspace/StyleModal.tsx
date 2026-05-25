"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { BookmarkSimple, Export, X, ArrowLeft, ArrowRight, Copy, Check, PencilSimple } from "@phosphor-icons/react";
import { PromptHighlight } from "@/components/ui/PromptHighlight";
import { LibraryItem } from "@/lib/data";

const ICON_BTN: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 6,
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "var(--fg-2)", cursor: "pointer",
  transition: "background 140ms var(--ease-out), color 140ms var(--ease-out)",
};

export function StyleModal({
  item, onClose, onToast, onSave, isSaved, onPrev, onNext, hasPrev, hasNext,
}: {
  item: LibraryItem;
  onClose: () => void;
  onToast: (msg: string) => void;
  onSave: () => void;
  isSaved: boolean;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const [tab, setTab] = useState<"structured" | "tokens" | "flags">("structured");
  const [body, setBody] = useState(item.promptText);
  const [flagsText, setFlagsText] = useState(item.flags);
  const [editing, setEditing] = useState(false);
  const [entered, setEntered] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBody(item.promptText);
    setFlagsText(item.flags);
    setEditing(false);
    setTab("structured");
    if (panelRef.current) panelRef.current.scrollTop = 0;
  }, [item.id]);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 20);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasPrev) onPrev();
      else if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [hasPrev, hasNext, onClose, onPrev, onNext]);

  const chips = useMemo(() => ([
    { group: "lighting", text: item.lighting.split(" · ")[0].toLowerCase() },
    { group: "lighting", text: "soft falloff" },
    { group: "composition", text: item.composition.split(" · ")[0].toLowerCase() },
    { group: "palette", text: "warm walnut + cream" },
    { group: "palette", text: "single accent" },
    { group: "mood", text: item.mood.split(" · ")[0].toLowerCase() },
    { group: "texture", text: "35mm grain" },
    { group: "lens", text: "medium format, 80mm" },
  ]), [item.id]);

  const copyPrompt = () => {
    const text = tab === "flags" ? `${body} ${flagsText}` : body;
    navigator.clipboard?.writeText(text);
    onToast(`Prompt copied · ${text.length} chars`);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 32px",
        background: entered ? "rgba(20,14,10,0.55)" : "rgba(20,14,10,0)",
        backdropFilter: entered ? "blur(14px) saturate(0.8)" : "blur(0px)",
        transition: "background 320ms var(--ease-out), backdrop-filter 320ms var(--ease-out)",
      }}
    >
      {hasPrev && (
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="modal-nav" style={{ left: 18 }} aria-label="Previous">
          <ArrowLeft weight="thin" size={20} />
        </button>
      )}
      {hasNext && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="modal-nav" style={{ right: 18 }} aria-label="Next">
          <ArrowRight weight="thin" size={20} />
        </button>
      )}

      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1180px, 100%)", maxHeight: "calc(100vh - 96px)",
          background: "color-mix(in oklch, var(--paper) 88%, transparent)",
          backdropFilter: "blur(28px) saturate(1.05)",
          border: "1px solid color-mix(in oklch, var(--paper) 50%, var(--rule-strong))",
          borderRadius: 14,
          boxShadow: "0 40px 80px -20px rgba(20,14,10,0.55), 0 4px 12px rgba(20,14,10,0.15)",
          overflow: "auto",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0) scale(1)" : "translateY(16px) scale(0.985)",
          transition: "opacity 360ms var(--ease-out), transform 380ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div style={{
          position: "sticky", top: 0, zIndex: 5,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 22px",
          background: "color-mix(in oklch, var(--paper) 70%, transparent)",
          backdropFilter: "blur(20px)", borderBottom: "1px solid color-mix(in oklch, var(--rule) 60%, transparent)",
        }}>
          <div className="meta-mono" style={{ color: "var(--fg-mute)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--terracotta)" }} />
            <span>VELLUM · {item.board.toLowerCase()}</span>
            <span style={{ color: "var(--fg-faint)" }}>·</span>
            <span>{item.date.toLowerCase()}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={onSave} title={isSaved ? "Saved" : "Save"} style={ICON_BTN}>
              <BookmarkSimple weight={isSaved ? "fill" : "thin"} size={16} color={isSaved ? "var(--terracotta)" : undefined} />
            </button>
            <button title="Export" style={ICON_BTN}><Export weight="thin" size={16} /></button>
            <span style={{ width: 1, height: 18, background: "var(--rule)", margin: "0 6px" }} />
            <button onClick={onClose} aria-label="Close" style={ICON_BTN}><X weight="thin" size={16} /></button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)", gap: 0 }}>
          <div style={{ padding: 28, borderRight: "1px solid color-mix(in oklch, var(--rule) 60%, transparent)" }}>
            <div style={{ aspectRatio: "4 / 5", borderRadius: 6, overflow: "hidden", background: "var(--linen)", boxShadow: "0 8px 24px -8px rgba(20,14,10,0.25)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>

          <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <div className="meta-mono" style={{ color: "var(--terracotta)", letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 10 }}>Analysis</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px, 3.4vw, 46px)", fontWeight: 520, letterSpacing: "-0.025em", lineHeight: 1.0, color: "var(--ink)", marginTop: 6, fontVariationSettings: '"opsz" 84' }}>
                {item.title}<span style={{ color: "var(--terracotta)" }}>.</span>
              </h2>
              <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontWeight: 450, fontSize: 17, color: "var(--walnut)", marginTop: 10, lineHeight: 1.45 }}>
                &ldquo;{item.italic}.&rdquo;
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, rowGap: 16 }}>
              {[{ label: "Mood", v: item.mood }, { label: "Lighting", v: item.lighting }, { label: "Composition", v: item.composition }, { label: "Texture", v: item.texture }].map((f) => (
                <div key={f.label}>
                  <div className="meta-mono" style={{ color: "var(--fg-mute)", letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 10, marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 13.5, color: "var(--walnut)", lineHeight: 1.5 }}>{f.v}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="meta-mono" style={{ color: "var(--fg-mute)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, fontSize: 10 }}>Palette</div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${item.palette.length}, 1fr)`, gap: 0, borderRadius: 4, overflow: "hidden" }}>
                {item.palette.map((c, i) => (
                  <button key={i} onClick={() => { navigator.clipboard?.writeText(c.hex); onToast(`${c.hex} copied`); }} title={`${c.name} · ${c.hex}`} style={{ background: c.hex, height: 36, cursor: "copy", transition: "transform 200ms var(--ease-out)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scaleY(1.12)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                  />
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${item.palette.length}, 1fr)`, gap: 0, marginTop: 6 }}>
                {item.palette.map((c, i) => (
                  <div key={i} className="meta-mono" style={{ color: "var(--fg-mute)", fontSize: 10 }}>{c.hex.toUpperCase()}</div>
                ))}
              </div>
            </div>

            <div style={{ background: "color-mix(in oklch, var(--chalk) 70%, transparent)", border: "1px solid color-mix(in oklch, var(--rule) 70%, transparent)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "flex", padding: "8px 8px 0", borderBottom: "1px solid color-mix(in oklch, var(--rule) 60%, transparent)", gap: 0 }}>
                {[{ id: "structured" as const, lbl: "Prompt" }, { id: "tokens" as const, lbl: "Tokens" }, { id: "flags" as const, lbl: "Flags" }].map((t) => (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 14px", fontSize: 12, fontWeight: tab === t.id ? 600 : 500, color: tab === t.id ? "var(--ink)" : "var(--fg-mute)", borderBottom: tab === t.id ? "1px solid var(--ink)" : "1px solid transparent", marginBottom: -1, letterSpacing: "-0.005em" }}>
                    {t.lbl}
                  </button>
                ))}
                <div style={{ flex: 1 }} />
                <button onClick={() => setEditing(!editing)} className="meta-mono" style={{ padding: "9px 8px", color: editing ? "var(--terracotta)" : "var(--fg-mute)", fontSize: 10 }}>
                  {editing ? <Check weight="thin" size={12} style={{ marginRight: 4, display: "inline" }} /> : <PencilSimple weight="thin" size={12} style={{ marginRight: 4, display: "inline" }} />}
                  {editing ? "done" : "edit"}
                </button>
              </div>

              <div style={{ padding: 16 }}>
                {tab === "structured" && (
                  editing ? (
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} style={{ width: "100%", minHeight: 140, border: 0, outline: 0, fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.65, color: "var(--walnut)", background: "color-mix(in oklch, var(--paper) 50%, transparent)", padding: 10, borderRadius: 4, resize: "vertical" }} />
                  ) : (
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, color: "var(--walnut)", maxHeight: 220, overflow: "auto" }}>
                      <PromptHighlight text={body} />
                    </div>
                  )
                )}
                {tab === "tokens" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 240, overflow: "auto" }}>
                    {["lighting", "composition", "palette", "mood", "texture", "lens"].map((g) => (
                      <div key={g} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 12, alignItems: "start" }}>
                        <div className="meta-mono" style={{ color: "var(--fg-mute)", letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 10, paddingTop: 5 }}>{g}</div>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {chips.filter((c) => c.group === g).map((c, i) => (
                            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: 11, padding: "3px 9px", borderRadius: 999, background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--rule)" }}>
                              {c.text}<X weight="thin" size={11} color="var(--fg-mute)" />
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {tab === "flags" && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, color: "var(--walnut)", background: "color-mix(in oklch, var(--paper) 50%, transparent)", padding: 12, borderRadius: 4 }}>
                    <div style={{ color: "var(--fg-mute)" }}># Midjourney v6.1</div>
                    <div style={{ marginTop: 6 }}>{body}</div>
                    <div style={{ marginTop: 8, color: "var(--terracotta)" }}>{flagsText}</div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 6 }}>
              <span className="meta-mono" style={{ color: "var(--fg-mute)" }}>{body.length} chars · {body.split(/\s+/).length} words</span>
              <button onClick={copyPrompt} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--ink)", color: "var(--chalk)", padding: "11px 18px", borderRadius: 4, fontSize: 13, fontWeight: 500, letterSpacing: "-0.005em", transition: "background 160ms var(--ease-out)", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--walnut)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--ink)")}
              >
                <Copy weight="thin" size={15} /> Copy prompt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
