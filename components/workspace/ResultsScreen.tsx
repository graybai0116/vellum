"use client";
import { useState, useMemo } from "react";
import { ArrowLeft, BookmarkSimple, Export, Copy, ListDashes, Tag, TerminalWindow, PencilSimple, Check, Plus, X } from "@phosphor-icons/react";
import { Eyebrow, SectionRule } from "@/components/ui/Eyebrow";
import { PaletteStrip } from "@/components/ui/PaletteStrip";
import { PromptHighlight } from "@/components/ui/PromptHighlight";
import { LibraryItem } from "@/lib/data";

const INLINE_COPY_STYLE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "7px 12px", fontFamily: "var(--font-mono)", fontSize: 11,
  letterSpacing: "0.04em", background: "var(--paper)", color: "var(--walnut)",
  border: "1px solid var(--rule)", borderRadius: 4, cursor: "pointer",
  transition: "all 140ms var(--ease-out)", whiteSpace: "nowrap",
};

export function ResultsScreen({
  item, image, onNavigate, onToast, onSave, isSaved,
}: {
  item: LibraryItem;
  image: { src: string; name: string } | null;
  onNavigate: (s: "library") => void;
  onToast: (msg: string) => void;
  onSave: (id: string) => void;
  isSaved: boolean;
}) {
  const [tab, setTab] = useState<"structured" | "tokens" | "flags">("structured");
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(item.promptText);
  const [flagsText, setFlagsText] = useState(item.flags);

  const chips = useMemo(() => ([
    { group: "lighting", text: item.lighting.split(" · ")[0].toLowerCase() },
    { group: "lighting", text: "soft falloff" },
    { group: "composition", text: item.composition.split(" · ")[0].toLowerCase() },
    { group: "palette", text: "warm walnut + cream" },
    { group: "palette", text: "single terracotta accent" },
    { group: "mood", text: item.mood.split(" · ")[0].toLowerCase() },
    { group: "texture", text: "35mm grain" },
    { group: "lens", text: "medium format, 80mm" },
  ]), [item.id]);

  const copyPrompt = () => {
    const text = tab === "flags" ? `${body} ${flagsText}` : body;
    navigator.clipboard?.writeText(text);
    onToast(`Prompt copied · ${text.length} chars`);
  };

  const TABS = [
    { id: "structured" as const, lbl: "Structured", Icon: ListDashes },
    { id: "tokens" as const, lbl: "Tokens", Icon: Tag },
    { id: "flags" as const, lbl: "Midjourney flags", Icon: TerminalWindow },
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
            <button className="btn btn-ghost"><Export weight="thin" size={16} />Export</button>
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
              <Eyebrow num="04">Analysis</Eyebrow>
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
                  <div style={{ fontSize: 13.5, color: "var(--walnut)", lineHeight: 1.5 }}>{f.v}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Palette</div>
              <PaletteStrip palette={item.palette} height={42} withLabels copyable onToast={onToast} />
              <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 14, color: "var(--walnut)", lineHeight: 1.5, marginTop: 12 }}>
                {item.palette_descriptor}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {item.tags.map((t) => <span key={t} className="chip">#{t}</span>)}
            </div>
          </div>
        </div>

        <SectionRule num="05" label="Prompt output" />
        <div style={{ background: "var(--chalk)", border: "1px solid var(--rule-soft)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--rule-soft)", padding: "12px 18px 0", gap: 0 }}>
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
            <button onClick={() => setEditing(!editing)} className="meta-mono" style={{ padding: "10px 8px", color: editing ? "var(--terracotta)" : "var(--fg-mute)" }}>
              {editing ? <Check weight="thin" size={14} style={{ marginRight: 6, display: "inline" }} /> : <PencilSimple weight="thin" size={14} style={{ marginRight: 6, display: "inline" }} />}
              {editing ? "done" : "edit"}
            </button>
          </div>

          <div style={{ padding: 24 }}>
            {tab === "structured" && (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--walnut)" }}>
                {editing ? (
                  <textarea value={body} onChange={(e) => setBody(e.target.value)} style={{ width: "100%", minHeight: 140, border: 0, outline: 0, fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--walnut)", background: "var(--bg-sunken)", padding: 12, borderRadius: 4, resize: "vertical" }} />
                ) : (
                  <PromptHighlight text={body} />
                )}
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--rule-soft)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <span className="meta-mono" style={{ color: "var(--fg-mute)" }}>
                    {body.length} characters · {body.split(/\s+/).length} words
                    <span style={{ margin: "0 10px", color: "var(--fg-faint)" }}>·</span>
                    <span style={{ color: "var(--sage)" }}>
                      <Check weight="thin" size={12} style={{ marginRight: 4, display: "inline" }} />
                      within Midjourney 4000-char limit
                    </span>
                  </span>
                  <button onClick={() => { navigator.clipboard?.writeText(body); onToast(`Prompt copied · ${body.length} chars`); }} className="inline-copy" style={INLINE_COPY_STYLE}>
                    <Copy weight="thin" size={13} /> Copy
                  </button>
                </div>
              </div>
            )}

            {tab === "tokens" && (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {["lighting", "composition", "palette", "mood", "texture", "lens"].map((g) => (
                    <div key={g} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, alignItems: "start" }}>
                      <div className="eyebrow" style={{ paddingTop: 6 }}>{g}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {chips.filter((c) => c.group === g).map((c, i) => (
                          <span key={i} className="chip" style={{ background: "var(--bg-sunken)", color: "var(--ink)", border: "1px solid var(--rule)", padding: "5px 10px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                            {c.text}<X weight="thin" size={12} color="var(--fg-mute)" />
                          </span>
                        ))}
                        <button className="chip" style={{ background: "transparent", color: "var(--fg-mute)", border: "1px dashed var(--rule)", cursor: "pointer" }}>
                          <Plus weight="thin" size={11} />add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--rule-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="meta-mono" style={{ color: "var(--fg-mute)" }}>{chips.length} tokens across 6 groups</span>
                  <button onClick={() => { const joined = chips.map((c) => c.text).join(", "); navigator.clipboard?.writeText(joined); onToast(`${chips.length} tokens copied`); }} className="inline-copy" style={INLINE_COPY_STYLE}>
                    <Copy weight="thin" size={13} /> Copy all
                  </button>
                </div>
              </div>
            )}

            {tab === "flags" && (
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--walnut)", background: "var(--bg-sunken)", padding: 16, borderRadius: 4 }}>
                  <div style={{ color: "var(--fg-mute)" }}># Midjourney v6.1</div>
                  <div style={{ marginTop: 8 }}>{body}</div>
                  <div style={{ marginTop: 10 }}>
                    {editing ? (
                      <input value={flagsText} onChange={(e) => setFlagsText(e.target.value)} style={{ width: "100%", border: 0, outline: 0, fontFamily: "inherit", fontSize: "inherit", color: "var(--terracotta)", background: "transparent" }} />
                    ) : (
                      <span style={{ color: "var(--terracotta)" }}>{flagsText}</span>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--rule-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="meta-mono" style={{ color: "var(--fg-mute)" }}>
                    Switch model: <button className="btn-text">Stable Diffusion</button> · <button className="btn-text">FLUX</button> · <button className="btn-text">Ideogram</button>
                  </span>
                  <button onClick={() => { const full = `${body} ${flagsText}`; navigator.clipboard?.writeText(full); onToast(`Prompt + flags copied · ${full.length} chars`); }} className="inline-copy" style={INLINE_COPY_STYLE}>
                    <Copy weight="thin" size={13} /> Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
