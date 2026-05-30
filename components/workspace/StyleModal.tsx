"use client";
import { useState, useEffect, useRef } from "react";
import { BookmarkSimple, X, ArrowLeft, ArrowRight, Copy, Check, PencilSimple, ListDashes, TerminalWindow, ArrowsOut, ArrowSquareOut, ArrowCounterClockwise } from "@phosphor-icons/react";
import { PromptHighlight } from "@/components/ui/PromptHighlight";
import { LibraryItem } from "@/lib/data";
import { fmtMidjourney, fmtFLUX, fmtSD, fmtDALLE, fmtGemini, Mode } from "@/lib/formatters";

const ICON_BTN: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 6,
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "var(--fg-2)", cursor: "pointer",
  transition: "background 140ms var(--ease-out), color 140ms var(--ease-out)",
};

const INLINE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "7px 12px", fontFamily: "var(--font-mono)", fontSize: 11,
  letterSpacing: "0.04em", background: "var(--paper)", color: "var(--walnut)",
  border: "1px solid var(--rule)", borderRadius: 4, cursor: "pointer",
  transition: "all 140ms var(--ease-out)", whiteSpace: "nowrap",
};

// ─── Component ────────────────────────────────────────────────────────────────
export function StyleModal({
  item, onClose, onToast, onSave, isSaved, onPrev, onNext, hasPrev, hasNext, onOpenResults, isPro = false, onShowUpgrade,
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
  onOpenResults?: () => void;
  isPro?: boolean;
  onShowUpgrade?: () => void;
}) {
  const mode: Mode = item.subjects ? "realism" : "style";
  const [tab, setTab] = useState<"structured" | "midjourney" | "flux" | "dalle" | "gemini" | "sd">("structured");
  const [body, setBody] = useState(item.promptText);
  const [editing, setEditing] = useState(false);
  const [fullModal, setFullModal] = useState<{ title: string; text: string } | null>(null);
  const [entered, setEntered] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBody(item.promptText);
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
      if (e.key === "Escape") { if (fullModal) { setFullModal(null); } else { onClose(); } }
      else if (e.key === "ArrowLeft" && hasPrev && !fullModal) onPrev();
      else if (e.key === "ArrowRight" && hasNext && !fullModal) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [hasPrev, hasNext, onClose, onPrev, onNext, fullModal]);

  const effectiveItem = { ...item, promptText: body };

  const TABS = [
    { id: "structured" as const, lbl: "Analysis", Icon: ListDashes, pro: false },
    { id: "midjourney" as const, lbl: "Midjourney", Icon: TerminalWindow, pro: true },
    { id: "flux" as const, lbl: "FLUX", Icon: TerminalWindow, pro: true },
    { id: "dalle" as const, lbl: "ChatGPT / DALL-E", Icon: TerminalWindow, pro: true },
    { id: "gemini" as const, lbl: "Gemini", Icon: TerminalWindow, pro: true },
    { id: "sd" as const, lbl: "Stable Diffusion", Icon: TerminalWindow, pro: true },
  ];

  return (
    <>
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
          {/* Sticky header */}
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
              <span style={{ color: "var(--fg-faint)" }}>·</span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em",
                padding: "2px 7px", borderRadius: "var(--r-pill)",
                background: mode === "realism" ? "color-mix(in oklch, var(--terracotta) 12%, transparent)" : "var(--linen)",
                color: mode === "realism" ? "var(--terracotta)" : "var(--stone)",
                border: `1px solid ${mode === "realism" ? "color-mix(in oklch, var(--terracotta) 30%, transparent)" : "var(--rule)"}`,
              }}>
                {mode === "realism" ? "PHOTO FIDELITY" : "VISUAL STYLE"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {onOpenResults && (
                <button onClick={onOpenResults} className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 12px", gap: 6 }}>
                  <ArrowSquareOut weight="thin" size={14} />Full analysis
                </button>
              )}
              <button onClick={onSave} title={isSaved ? "Saved" : "Save"} style={ICON_BTN}>
                <BookmarkSimple weight={isSaved ? "fill" : "thin"} size={16} color={isSaved ? "var(--terracotta)" : undefined} />
              </button>
              <span style={{ width: 1, height: 18, background: "var(--rule)", margin: "0 6px" }} />
              <button onClick={onClose} aria-label="Close" style={ICON_BTN}><X weight="thin" size={16} /></button>
            </div>
          </div>

          {/* Two-column body */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.6fr)", gap: 0 }}>
            {/* Left: image + palette strip */}
            <div style={{ padding: 28, borderRight: "1px solid color-mix(in oklch, var(--rule) 60%, transparent)" }}>
              <div style={{ aspectRatio: "4 / 5", borderRadius: 6, overflow: "hidden", background: "var(--linen)", boxShadow: "0 8px 24px -8px rgba(20,14,10,0.25)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 2 }}>
                {item.palette.map((c, i) => (
                  <button key={i} onClick={() => { navigator.clipboard?.writeText(c.hex); onToast(`${c.hex} copied`); }} title={`${c.name} · ${c.hex}`}
                    style={{ flex: 1, height: 8, background: c.hex, cursor: "copy", borderRadius: 2, transition: "transform 200ms var(--ease-out)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scaleY(1.3)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                  />
                ))}
              </div>
              <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: `repeat(${item.palette.length}, 1fr)` }}>
                {item.palette.map((c, i) => (
                  <div key={i} className="meta-mono" style={{ color: "var(--fg-mute)", fontSize: 9 }}>{c.hex.toUpperCase()}</div>
                ))}
              </div>
            </div>

            {/* Right: title, facets, prompts */}
            <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 2.8vw, 40px)", fontWeight: 520, letterSpacing: "-0.025em", lineHeight: 1.0, color: "var(--ink)", fontVariationSettings: '"opsz" 84' }}>
                  {item.title}<span style={{ color: "var(--terracotta)" }}>.</span>
                </h2>
                <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontWeight: 450, fontSize: 16, color: "var(--walnut)", marginTop: 8, lineHeight: 1.45 }}>
                  &ldquo;{item.italic}.&rdquo;
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, rowGap: 14 }}>
                {[{ label: "Mood", v: item.mood }, { label: "Lighting", v: item.lighting }, { label: "Composition", v: item.composition }, { label: "Texture", v: item.texture }].map((f) => (
                  <div key={f.label}>
                    <div className="meta-mono" style={{ color: "var(--fg-mute)", letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 10, marginBottom: 4 }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: "var(--walnut)", lineHeight: 1.5, maxHeight: 60, overflowY: "auto" }}>{f.v}</div>
                  </div>
                ))}
              </div>

              {item.palette_descriptor && (
                <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 13.5, color: "var(--walnut)", lineHeight: 1.5 }}>
                  {item.palette_descriptor}
                </p>
              )}

              {item.art_references && (
                <div>
                  <div className="meta-mono" style={{ color: "var(--fg-mute)", letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 10, marginBottom: 4 }}>Art References</div>
                  <div style={{ fontSize: 13, color: "var(--walnut)", lineHeight: 1.5 }}>{item.art_references}</div>
                </div>
              )}

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {item.tags.map((t) => <span key={t} className="chip">#{t}</span>)}
              </div>

              {/* Prompt tabs */}
              <div style={{ background: "color-mix(in oklch, var(--chalk) 70%, transparent)", border: "1px solid color-mix(in oklch, var(--rule) 70%, transparent)", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ display: "flex", padding: "8px 8px 0", borderBottom: "1px solid color-mix(in oklch, var(--rule) 60%, transparent)", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
                  {TABS.map(({ id, lbl, Icon, pro }) => {
                    const locked = pro && !isPro;
                    return (
                      <button
                        key={id}
                        onClick={() => locked ? onShowUpgrade?.() : setTab(id)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "8px 11px", fontSize: 11.5, fontWeight: tab === id ? 600 : 500,
                          color: locked ? "var(--fg-mute)" : tab === id ? "var(--ink)" : "var(--fg-mute)",
                          borderBottom: tab === id ? "1px solid var(--ink)" : "1px solid transparent",
                          marginBottom: -1, whiteSpace: "nowrap",
                          opacity: locked ? 0.65 : 1,
                        }}
                      >
                        <Icon weight="thin" size={13} />{lbl}
                        {locked && (
                          <span style={{
                            fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em",
                            padding: "2px 5px", borderRadius: "var(--r-pill)",
                            background: "color-mix(in oklch, #C4A76A 15%, transparent)",
                            color: "#A88A50",
                            border: "1px solid color-mix(in oklch, #C4A76A 30%, transparent)",
                          }}>PRO</span>
                        )}
                      </button>
                    );
                  })}
                  <div style={{ flex: 1 }} />
                  {tab === "structured" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {editing && body !== item.promptText && (
                        <button onClick={() => setBody(item.promptText)} className="meta-mono" style={{ padding: "9px 8px", color: "var(--fg-mute)", fontSize: 10 }} title="Reset to original">
                          <ArrowCounterClockwise weight="thin" size={12} style={{ marginRight: 4, display: "inline" }} />reset
                        </button>
                      )}
                      <button onClick={() => setEditing(!editing)} className="meta-mono" style={{ padding: "9px 8px", color: editing ? "var(--terracotta)" : "var(--fg-mute)", fontSize: 10 }}>
                        {editing ? <Check weight="thin" size={12} style={{ marginRight: 4, display: "inline" }} /> : <PencilSimple weight="thin" size={12} style={{ marginRight: 4, display: "inline" }} />}
                        {editing ? "done" : "edit"}
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ padding: 14 }}>
                  {tab === "structured" && (
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, color: "var(--walnut)" }}>
                      <div style={{ maxHeight: 160, overflowY: "auto", background: "color-mix(in oklch, var(--paper) 50%, transparent)", padding: 10, borderRadius: 4 }}>
                        {editing ? (
                          <textarea value={body} onChange={(e) => setBody(e.target.value)} style={{ width: "100%", minHeight: 120, border: 0, outline: 0, fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, color: "var(--walnut)", background: "transparent", resize: "none" }} />
                        ) : (
                          <PromptHighlight text={body} />
                        )}
                      </div>
                      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <span className="meta-mono" style={{ color: "var(--fg-mute)" }}>{body.length} chars · {body.split(/\s+/).filter(Boolean).length} words</span>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => setFullModal({ title: "Analysis prompt", text: body })} style={INLINE}><ArrowsOut weight="thin" size={12} /> View full</button>
                          <button onClick={() => { navigator.clipboard?.writeText(body); onToast(`Copied · ${body.length} chars`); }} style={INLINE}><Copy weight="thin" size={12} /> Copy</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {tab === "midjourney" && (() => {
                    const { prompt, flags } = fmtMidjourney(effectiveItem, mode);
                    const full = `${prompt} ${flags}`;
                    return (
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, color: "var(--walnut)", background: "color-mix(in oklch, var(--paper) 50%, transparent)", padding: 12, borderRadius: 4, maxHeight: 160, overflowY: "auto" }}>
                          <div style={{ color: "var(--fg-mute)", marginBottom: 6 }}># /imagine prompt</div>
                          <div>{prompt}</div>
                          <div style={{ marginTop: 8, color: "var(--terracotta)" }}>{flags}</div>
                        </div>
                        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                          <button onClick={() => setFullModal({ title: "# /imagine prompt · Midjourney", text: full })} style={INLINE}><ArrowsOut weight="thin" size={12} /> View full</button>
                          <button onClick={() => { navigator.clipboard?.writeText(full); onToast(`Midjourney copied · ${full.length} chars`); }} style={INLINE}><Copy weight="thin" size={12} /> Copy</button>
                        </div>
                      </div>
                    );
                  })()}

                  {tab === "flux" && (() => {
                    const prompt = fmtFLUX(effectiveItem, mode);
                    return (
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, color: "var(--walnut)", background: "color-mix(in oklch, var(--paper) 50%, transparent)", padding: 12, borderRadius: 4, maxHeight: 160, overflowY: "auto" }}>
                          <div style={{ color: "var(--fg-mute)", marginBottom: 6 }}># FLUX 2 / FLUX.1 [dev]</div>
                          <div>{prompt}</div>
                        </div>
                        <div style={{ marginTop: 8, display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {item.palette.map((c) => (
                            <span key={c.hex} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 4, background: "var(--chalk)", border: "1px solid var(--rule)", fontFamily: "var(--font-mono)", fontSize: 10 }}>
                              <span style={{ width: 10, height: 10, borderRadius: 2, background: c.hex, display: "inline-block" }} />{c.hex}
                            </span>
                          ))}
                        </div>
                        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                          <button onClick={() => setFullModal({ title: "# FLUX 2 / FLUX.1 [dev]", text: prompt })} style={INLINE}><ArrowsOut weight="thin" size={12} /> View full</button>
                          <button onClick={() => { navigator.clipboard?.writeText(prompt); onToast(`FLUX copied · ${prompt.length} chars`); }} style={INLINE}><Copy weight="thin" size={12} /> Copy</button>
                        </div>
                      </div>
                    );
                  })()}

                  {tab === "dalle" && (() => {
                    const prompt = fmtDALLE(effectiveItem, mode);
                    return (
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, color: "var(--walnut)", background: "color-mix(in oklch, var(--paper) 50%, transparent)", padding: 12, borderRadius: 4, maxHeight: 160, overflowY: "auto" }}>
                          <div style={{ color: "var(--fg-mute)", marginBottom: 6 }}># ChatGPT / DALL-E 3</div>
                          <div>{prompt}</div>
                        </div>
                        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                          <button onClick={() => setFullModal({ title: "# ChatGPT / DALL-E 3", text: prompt })} style={INLINE}><ArrowsOut weight="thin" size={12} /> View full</button>
                          <button onClick={() => { navigator.clipboard?.writeText(prompt); onToast(`DALL-E copied · ${prompt.length} chars`); }} style={INLINE}><Copy weight="thin" size={12} /> Copy</button>
                        </div>
                      </div>
                    );
                  })()}

                  {tab === "gemini" && (() => {
                    const prompt = fmtGemini(effectiveItem, mode);
                    return (
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, color: "var(--walnut)", background: "color-mix(in oklch, var(--paper) 50%, transparent)", padding: 12, borderRadius: 4, maxHeight: 160, overflowY: "auto" }}>
                          <div style={{ color: "var(--fg-mute)", marginBottom: 6 }}># Gemini / Imagen 3</div>
                          <div>{prompt}</div>
                        </div>
                        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                          <button onClick={() => setFullModal({ title: "# Gemini / Imagen 3", text: prompt })} style={INLINE}><ArrowsOut weight="thin" size={12} /> View full</button>
                          <button onClick={() => { navigator.clipboard?.writeText(prompt); onToast(`Gemini copied · ${prompt.length} chars`); }} style={INLINE}><Copy weight="thin" size={12} /> Copy</button>
                        </div>
                      </div>
                    );
                  })()}

                  {tab === "sd" && (() => {
                    const { positive, negative } = fmtSD(effectiveItem, mode);
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div>
                          <div className="meta-mono" style={{ color: "var(--fg-mute)", fontSize: 10, marginBottom: 6 }}>POSITIVE PROMPT</div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, color: "var(--walnut)", background: "color-mix(in oklch, var(--paper) 50%, transparent)", padding: 12, borderRadius: 4, maxHeight: 100, overflowY: "auto" }}>{positive}</div>
                        </div>
                        <div>
                          <div className="meta-mono" style={{ color: "var(--fg-mute)", fontSize: 10, marginBottom: 6 }}>NEGATIVE PROMPT</div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, color: "var(--fg-mute)", background: "color-mix(in oklch, var(--paper) 50%, transparent)", padding: 12, borderRadius: 4, maxHeight: 80, overflowY: "auto" }}>{negative}</div>
                        </div>
                        <div style={{ display: "flex", gap: 6, justifyContent: "space-between", alignItems: "center" }}>
                          <button onClick={() => setFullModal({ title: "# Stable Diffusion", text: `POSITIVE:\n${positive}\n\nNEGATIVE:\n${negative}` })} style={INLINE}><ArrowsOut weight="thin" size={12} /> View full</button>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button onClick={() => { navigator.clipboard?.writeText(positive); onToast("Positive copied"); }} style={INLINE}><Copy weight="thin" size={12} /> Copy positive</button>
                            <button onClick={() => { navigator.clipboard?.writeText(negative); onToast("Negative copied"); }} style={INLINE}><Copy weight="thin" size={12} /> Copy negative</button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full text sub-modal */}
      {fullModal && (
        <div
          onClick={() => setFullModal(null)}
          style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(34,26,20,0.48)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--chalk)", border: "1px solid var(--rule-soft)", borderRadius: "var(--r-lg)", width: "min(700px, 100%)", maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-3)" }}
          >
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--rule-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--terracotta)", letterSpacing: "0.1em" }}>{fullModal.title}</span>
              <button onClick={() => setFullModal(null)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--rule)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--fg-3)" }}>
                <X weight="thin" size={14} />
              </button>
            </div>
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.75, color: "var(--walnut)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {fullModal.text}
            </div>
            <div style={{ padding: "14px 24px", borderTop: "1px solid var(--rule-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="meta-mono" style={{ color: "var(--fg-mute)" }}>{fullModal.text.length} chars · {fullModal.text.split(/\s+/).filter(Boolean).length} words</span>
              <button onClick={() => { navigator.clipboard?.writeText(fullModal.text); onToast(`Copied · ${fullModal.text.length} chars`); }} style={INLINE}><Copy weight="thin" size={13} /> Copy all</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
