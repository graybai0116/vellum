"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, BookmarkSimple, Copy, ListDashes, TerminalWindow, PencilSimple, Check, X, ArrowsOut, ArrowCounterClockwise } from "@phosphor-icons/react";
import { Eyebrow, SectionRule } from "@/components/ui/Eyebrow";
import { PaletteStrip } from "@/components/ui/PaletteStrip";
import { PromptHighlight } from "@/components/ui/PromptHighlight";
import { LibraryItem } from "@/lib/data";
import { fmtMidjourney, fmtFLUX, fmtSD, fmtDALLE, fmtGemini } from "@/lib/formatters";

const INLINE_COPY_STYLE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "7px 12px", fontFamily: "var(--font-mono)", fontSize: 11,
  letterSpacing: "0.04em", background: "var(--paper)", color: "var(--walnut)",
  border: "1px solid var(--rule)", borderRadius: 4, cursor: "pointer",
  transition: "all 140ms var(--ease-out)", whiteSpace: "nowrap",
};

export function ResultsScreen({
  item, image, mode = "style", onNavigate, onToast, onSave, isSaved,
}: {
  item: LibraryItem;
  image: { src: string; name: string } | null;
  mode?: "style" | "realism";
  onNavigate: (s: "library") => void;
  onToast: (msg: string) => void;
  onSave: (id: string) => void;
  isSaved: boolean;
}) {
  const [tab, setTab] = useState<"structured" | "midjourney" | "flux" | "dalle" | "gemini" | "sd">("structured");
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(item.promptText);
  const [fullModal, setFullModal] = useState<{ title: string; text: string } | null>(null);

  useEffect(() => {
    setBody(item.promptText);
    setEditing(false);
    setTab("structured");
  }, [item.id]);

  const effectiveItem = { ...item, promptText: body };

  const copyPrompt = () => {
    const text = body;
    navigator.clipboard?.writeText(text);
    onToast(`Prompt copied · ${text.length} chars`);
  };

  const TABS = [
    { id: "structured" as const, lbl: "Analysis", Icon: ListDashes },
    { id: "midjourney" as const, lbl: "Midjourney", Icon: TerminalWindow },
    { id: "flux" as const, lbl: "FLUX", Icon: TerminalWindow },
    { id: "dalle" as const, lbl: "ChatGPT / DALL-E", Icon: TerminalWindow },
    { id: "gemini" as const, lbl: "Gemini", Icon: TerminalWindow },
    { id: "sd" as const, lbl: "Stable Diffusion", Icon: TerminalWindow },
  ];

  return (
    <div className="screen fade-enter">
      <div className="container" style={{ paddingTop: 36, paddingBottom: 96 }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "var(--fg-3)" }}>
            <button className="btn btn-icon" onClick={() => onNavigate("library")}>
              <ArrowLeft weight="thin" size={18} />
            </button>
            <span className="meta-mono">Library / {item.board} /</span>
            <span style={{ fontFamily: "var(--font-display)", color: "var(--ink)", fontSize: 16 }}>{item.title}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => onSave(item.id)}>
              <BookmarkSimple weight={isSaved ? "fill" : "thin"} size={16} />
              {isSaved ? "Saved to library" : "Save to library"}
            </button>
            <button className="btn btn-accent" onClick={copyPrompt}>
              <Copy weight="thin" size={16} />Copy prompt
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", gap: 32, alignItems: "stretch", marginBottom: 56 }}>
          <div style={{ background: "var(--chalk)", border: "1px solid var(--rule-soft)", borderRadius: "var(--r-lg)", padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ borderRadius: 4, overflow: "hidden", aspectRatio: "4 / 5", background: "var(--linen)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image?.src || item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 4px 0" }}>
              <div>
                <div className="meta-mono" style={{ color: "var(--fg-mute)" }}>Source</div>
                <div style={{ fontSize: 13, color: "var(--walnut)", marginTop: 2 }}>{item.source}</div>
              </div>
              <div className="meta-mono" style={{ color: "var(--fg-3)" }}>analysed {item.date.toLowerCase()}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22, padding: "12px 8px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Eyebrow num="04">Analysis</Eyebrow>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em",
                  padding: "3px 8px", borderRadius: "var(--r-pill)",
                  background: mode === "realism" ? "color-mix(in oklch, var(--terracotta) 12%, transparent)" : "var(--linen)",
                  color: mode === "realism" ? "var(--terracotta)" : "var(--stone)",
                  border: `1px solid ${mode === "realism" ? "color-mix(in oklch, var(--terracotta) 30%, transparent)" : "var(--rule)"}`,
                }}>
                  {mode === "realism" ? "PHOTO FIDELITY" : "VISUAL STYLE"}
                </span>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.0, letterSpacing: "-0.025em", marginTop: 14, color: "var(--ink)" }}>
                {item.title}<span style={{ color: "var(--terracotta)" }}>.</span>
              </h2>
              <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 18, color: "var(--walnut)", marginTop: 14, lineHeight: 1.45 }}>
                &ldquo;{item.italic}.&rdquo;
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, rowGap: 16 }}>
              {[
                { label: "Mood", v: item.mood },
                { label: "Lighting", v: item.lighting },
                { label: "Composition", v: item.composition },
                { label: "Texture", v: item.texture },
              ].map((f) => (
                <div key={f.label}>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>{f.label}</div>
                  <div style={{ fontSize: 13.5, color: "var(--walnut)", lineHeight: 1.5, maxHeight: 66, overflowY: "auto" }}>{f.v}</div>
                </div>
              ))}
            </div>

            {item.art_references && (
              <div>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Art References</div>
                <div style={{ fontSize: 13.5, color: "var(--walnut)", lineHeight: 1.5 }}>{item.art_references}</div>
              </div>
            )}

            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Palette</div>
              <PaletteStrip palette={item.palette} height={42} withLabels copyable onToast={onToast} />
              <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 14, color: "var(--walnut)", lineHeight: 1.5, marginTop: 12, maxHeight: 60, overflowY: "auto" }}>
                {item.palette_descriptor}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {item.tags.map((t) => <span key={t} className="chip">#{t}</span>)}
              </div>
              <button
                onClick={() => {
                  const lines = [
                    `TITLE: ${item.title}`,
                    `MOOD: ${item.mood}`,
                    `LIGHTING: ${item.lighting}`,
                    `COMPOSITION: ${item.composition}`,
                    `TEXTURE: ${item.texture}`,
                    `PALETTE: ${item.palette_descriptor}`,
                    item.subjects ? `\nSUBJECTS:\n${item.subjects}` : "",
                  ].filter(Boolean).join("\n");
                  setFullModal({ title: "Full analysis", text: lines });
                }}
                className="inline-copy" style={{ ...INLINE_COPY_STYLE, flexShrink: 0 }}
              >
                <ArrowsOut weight="thin" size={13} /> View full analysis
              </button>
            </div>
          </div>
        </div>

        <SectionRule num="05" label="Prompt output" />
        <div style={{ background: "var(--chalk)", border: "1px solid var(--rule-soft)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--rule-soft)", padding: "12px 18px 0", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
            {TABS.map(({ id, lbl, Icon }) => (
              <button key={id} onClick={() => setTab(id)} style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px",
                borderBottom: tab === id ? "1px solid var(--ink)" : "1px solid transparent",
                marginBottom: -1, color: tab === id ? "var(--ink)" : "var(--fg-mute)",
                fontSize: 13, fontWeight: tab === id ? 600 : 500,
                transition: "all var(--t-fast) var(--ease-out)",
              }}>
                <Icon weight="thin" size={16} />{lbl}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            {tab === "structured" && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {editing && body !== item.promptText && (
                  <button onClick={() => setBody(item.promptText)} className="meta-mono" style={{ padding: "10px 8px", color: "var(--fg-mute)" }} title="Reset to original">
                    <ArrowCounterClockwise weight="thin" size={14} style={{ marginRight: 4, display: "inline" }} />reset
                  </button>
                )}
                <button onClick={() => setEditing(!editing)} className="meta-mono" style={{ padding: "10px 8px", color: editing ? "var(--terracotta)" : "var(--fg-mute)" }}>
                  {editing ? <Check weight="thin" size={14} style={{ marginRight: 6, display: "inline" }} /> : <PencilSimple weight="thin" size={14} style={{ marginRight: 6, display: "inline" }} />}
                  {editing ? "done" : "edit"}
                </button>
              </div>
            )}
          </div>

          <div style={{ padding: 24 }}>
            {tab === "structured" && (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--walnut)" }}>
                <div style={{ maxHeight: 180, overflowY: "auto", background: "var(--bg-sunken)", padding: 12, borderRadius: 4 }}>
                  {editing ? (
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} style={{ width: "100%", minHeight: 120, border: 0, outline: 0, fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--walnut)", background: "transparent", resize: "none" }} />
                  ) : (
                    <PromptHighlight text={body} />
                  )}
                </div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--rule-soft)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <span className="meta-mono" style={{ color: "var(--fg-mute)" }}>{body.length} chars · {body.split(/\s+/).length} words</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setFullModal({ title: "Analysis prompt", text: body })} className="inline-copy" style={INLINE_COPY_STYLE}>
                      <ArrowsOut weight="thin" size={13} /> View full
                    </button>
                    <button onClick={() => { navigator.clipboard?.writeText(body); onToast(`Prompt copied · ${body.length} chars`); }} className="inline-copy" style={INLINE_COPY_STYLE}>
                      <Copy weight="thin" size={13} /> Copy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "midjourney" && (() => {
              const { prompt, flags } = fmtMidjourney(effectiveItem, mode);
              const full = `${prompt} ${flags}`;
              return (
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--walnut)", background: "var(--bg-sunken)", padding: 16, borderRadius: 4, maxHeight: 180, overflowY: "auto" }}>
                    <div style={{ color: "var(--fg-mute)", marginBottom: 8 }}># /imagine prompt</div>
                    <div>{prompt}</div>
                    <div style={{ marginTop: 8, color: "var(--terracotta)" }}>{flags}</div>
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--rule-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => setFullModal({ title: "# /imagine prompt · Midjourney", text: full })} className="inline-copy" style={INLINE_COPY_STYLE}>
                      <ArrowsOut weight="thin" size={13} /> View full
                    </button>
                    <button onClick={() => { navigator.clipboard?.writeText(full); onToast(`Midjourney prompt copied · ${full.length} chars`); }} className="inline-copy" style={INLINE_COPY_STYLE}>
                      <Copy weight="thin" size={13} /> Copy
                    </button>
                  </div>
                </div>
              );
            })()}

            {tab === "flux" && (() => {
              const prompt = fmtFLUX(effectiveItem, mode);
              return (
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--walnut)", background: "var(--bg-sunken)", padding: 16, borderRadius: 4, maxHeight: 180, overflowY: "auto" }}>
                    <div style={{ color: "var(--fg-mute)", marginBottom: 8 }}># FLUX 2 / FLUX.1 [dev]</div>
                    <div>{prompt}</div>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {item.palette.map((c) => (
                      <span key={c.hex} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 4, background: "var(--chalk)", border: "1px solid var(--rule)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                        <span style={{ width: 12, height: 12, borderRadius: 2, background: c.hex, display: "inline-block" }} />{c.hex}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--rule-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => setFullModal({ title: "# FLUX 2 / FLUX.1 [dev]", text: prompt })} className="inline-copy" style={INLINE_COPY_STYLE}>
                      <ArrowsOut weight="thin" size={13} /> View full
                    </button>
                    <button onClick={() => { navigator.clipboard?.writeText(prompt); onToast(`FLUX prompt copied · ${prompt.length} chars`); }} className="inline-copy" style={INLINE_COPY_STYLE}>
                      <Copy weight="thin" size={13} /> Copy
                    </button>
                  </div>
                </div>
              );
            })()}

            {tab === "dalle" && (() => {
              const prompt = fmtDALLE(effectiveItem, mode);
              return (
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--walnut)", background: "var(--bg-sunken)", padding: 16, borderRadius: 4, maxHeight: 180, overflowY: "auto" }}>
                    <div style={{ color: "var(--fg-mute)", marginBottom: 8 }}># ChatGPT / DALL-E 3</div>
                    <div>{prompt}</div>
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--rule-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => setFullModal({ title: "# ChatGPT / DALL-E 3", text: prompt })} className="inline-copy" style={INLINE_COPY_STYLE}>
                      <ArrowsOut weight="thin" size={13} /> View full
                    </button>
                    <button onClick={() => { navigator.clipboard?.writeText(prompt); onToast(`DALL-E prompt copied · ${prompt.length} chars`); }} className="inline-copy" style={INLINE_COPY_STYLE}>
                      <Copy weight="thin" size={13} /> Copy
                    </button>
                  </div>
                </div>
              );
            })()}

            {tab === "gemini" && (() => {
              const prompt = fmtGemini(effectiveItem, mode);
              return (
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--walnut)", background: "var(--bg-sunken)", padding: 16, borderRadius: 4, maxHeight: 180, overflowY: "auto" }}>
                    <div style={{ color: "var(--fg-mute)", marginBottom: 8 }}># Gemini / Imagen 3</div>
                    <div>{prompt}</div>
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--rule-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => setFullModal({ title: "# Gemini / Imagen 3", text: prompt })} className="inline-copy" style={INLINE_COPY_STYLE}>
                      <ArrowsOut weight="thin" size={13} /> View full
                    </button>
                    <button onClick={() => { navigator.clipboard?.writeText(prompt); onToast(`Gemini prompt copied · ${prompt.length} chars`); }} className="inline-copy" style={INLINE_COPY_STYLE}>
                      <Copy weight="thin" size={13} /> Copy
                    </button>
                  </div>
                </div>
              );
            })()}

            {tab === "sd" && (() => {
              const { positive, negative } = fmtSD(effectiveItem, mode);
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 8 }}>Positive prompt</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--walnut)", background: "var(--bg-sunken)", padding: 16, borderRadius: 4, maxHeight: 120, overflowY: "auto" }}>{positive}</div>
                  </div>
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 8 }}>Negative prompt</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--fg-mute)", background: "var(--bg-sunken)", padding: 16, borderRadius: 4, maxHeight: 100, overflowY: "auto" }}>{negative}</div>
                  </div>
                  <div style={{ paddingTop: 12, borderTop: "1px solid var(--rule-soft)", display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => setFullModal({ title: "# Stable Diffusion", text: `POSITIVE PROMPT:\n${positive}\n\nNEGATIVE PROMPT:\n${negative}` })} className="inline-copy" style={INLINE_COPY_STYLE}>
                      <ArrowsOut weight="thin" size={13} /> View full
                    </button>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { navigator.clipboard?.writeText(positive); onToast("Positive prompt copied"); }} className="inline-copy" style={INLINE_COPY_STYLE}>
                        <Copy weight="thin" size={13} /> Copy positive
                      </button>
                      <button onClick={() => { navigator.clipboard?.writeText(negative); onToast("Negative prompt copied"); }} className="inline-copy" style={INLINE_COPY_STYLE}>
                        <Copy weight="thin" size={13} /> Copy negative
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Full prompt modal */}
      {fullModal && (
        <div
          onClick={() => setFullModal(null)}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(34,26,20,0.48)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--chalk)", border: "1px solid var(--rule-soft)", borderRadius: "var(--r-lg)", width: "min(700px, 100%)", maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-3)" }}
          >
            {/* Header */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--rule-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--terracotta)", letterSpacing: "0.1em" }}>{fullModal.title}</span>
              <button onClick={() => setFullModal(null)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--rule)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--fg-3)" }}>
                <X weight="thin" size={14} />
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.75, color: "var(--walnut)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {fullModal.text}
            </div>
            {/* Footer */}
            <div style={{ padding: "14px 24px", borderTop: "1px solid var(--rule-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="meta-mono" style={{ color: "var(--fg-mute)" }}>{fullModal.text.length} chars · {fullModal.text.split(/\s+/).filter(Boolean).length} words</span>
              <button onClick={() => { navigator.clipboard?.writeText(fullModal.text); onToast(`Copied · ${fullModal.text.length} chars`); }} className="inline-copy" style={INLINE_COPY_STYLE}>
                <Copy weight="thin" size={13} /> Copy all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
