"use client";
import { useState } from "react";
import { MagnifyingGlass, Plus, SquaresFour, ListBullets, BookmarkSimple, ArrowLeft } from "@phosphor-icons/react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LIBRARY, BOARDS, LibraryItem } from "@/lib/data";

export function LibraryScreen({
  onNavigate, savedSet, onToggleSave, onOpenModal, extraItems = [], hasLastAnalysis = false, onBackToResults,
}: {
  onNavigate: (s: "landing") => void;
  savedSet: Set<string>;
  onToggleSave: (id: string) => void;
  onOpenModal: (id: string) => void;
  extraItems?: LibraryItem[];
  hasLastAnalysis?: boolean;
  onBackToResults?: () => void;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [board, setBoard] = useState("all");
  const [query, setQuery] = useState("");

  const allItems = [...extraItems, ...LIBRARY];
  const filtered = allItems.filter((it) => {
    if (board !== "all" && !it.board.toLowerCase().includes(board.split("-")[0])) return false;
    if (query && !`${it.title} ${it.tags.join(" ")} ${it.board}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="screen fade-enter">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <Eyebrow num="02">Your library</Eyebrow>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-0.025em", lineHeight: 1.0, color: "var(--ink)", marginTop: 10 }}>
              {allItems.length} reads,
              <span style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", color: "var(--walnut)" }}> catalogued</span>.
            </h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: "var(--bg-sunken)", borderRadius: "var(--r-sm)", minWidth: 260 }}>
              <MagnifyingGlass weight="thin" size={16} color="var(--fg-mute)" />
              <input placeholder="Search analyses, tags, palettes…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ all: "unset", flex: 1, fontSize: 13 }} />
            </div>
            {hasLastAnalysis && onBackToResults && (
              <button className="btn btn-ghost" onClick={onBackToResults}>
                <ArrowLeft weight="thin" size={16} />Last analysis
              </button>
            )}
            <button className="btn btn-accent" onClick={() => onNavigate("landing")}>
              <Plus weight="thin" size={16} />New read
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--rule)" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {BOARDS.map((b) => (
              <button key={b.id} className={`pill${board === b.id ? " active" : ""}`} onClick={() => setBoard(b.id)}>
                {b.name}
                <span className="meta-mono" style={{ marginLeft: 6, opacity: 0.6, fontSize: 10 }}>{b.count}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", background: "var(--bg-sunken)", borderRadius: 4 }}>
              {([{ id: "grid", Icon: SquaresFour }, { id: "list", Icon: ListBullets }] as const).map(({ id, Icon }) => (
                <button key={id} onClick={() => setView(id)} style={{
                  padding: "8px 10px", borderRadius: 4,
                  background: view === id ? "var(--chalk)" : "transparent",
                  color: view === id ? "var(--ink)" : "var(--fg-mute)",
                  boxShadow: view === id ? "var(--shadow-1)" : "none",
                }}>
                  <Icon weight="thin" size={18} />
                </button>
              ))}
            </div>
            <span className="meta-mono" style={{ color: "var(--fg-3)" }}>{filtered.length} / {allItems.length} shown</span>
          </div>
        </div>

        {view === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, rowGap: 48 }}>
            {filtered.map((it) => (
              <LibraryCard key={it.id} item={it} onOpen={() => onOpenModal(it.id)} saved={savedSet.has(it.id)} onSave={() => onToggleSave(it.id)} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filtered.map((it, i) => (
              <LibraryRow key={it.id} item={it} index={i + 1} onOpen={() => onOpenModal(it.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LibraryCard({ item, onOpen, saved, onSave }: { item: LibraryItem; onOpen: () => void; saved: boolean; onSave: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
      <div style={{ position: "relative", aspectRatio: "4 / 5", background: "var(--linen)", borderRadius: 4, overflow: "hidden" }}>
        <button onClick={onOpen} style={{ width: "100%", height: "100%", cursor: "pointer", display: "block", padding: 0, border: 0, background: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 600ms var(--ease-out), filter 320ms var(--ease-out)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLImageElement).style.filter = "brightness(0.96)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "none"; (e.currentTarget as HTMLImageElement).style.filter = "none"; }}
          />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onSave(); }} style={{ position: "absolute", top: 12, right: 12, padding: 6, borderRadius: 3, background: "rgba(244,236,221,0.7)", backdropFilter: "blur(8px)", color: saved ? "var(--terracotta)" : "var(--walnut)" }}>
          <BookmarkSimple weight={saved ? "fill" : "thin"} size={16} />
        </button>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", pointerEvents: "none" }}>
          {item.palette.map((c, i) => <span key={i} style={{ flex: 1, height: 6, background: c.hex }} />)}
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.015em" }}>{item.title}</h3>
          <span className="meta-mono">{item.date.split(" · ")[0]}</span>
        </div>
        <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 14, color: "var(--walnut)", marginTop: 4, lineHeight: 1.4 }}>&ldquo;{item.italic}&rdquo;</p>
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {item.tags.slice(0, 3).map((t) => <span key={t} className="chip">#{t}</span>)}
        </div>
      </div>
    </div>
  );
}

function LibraryRow({ item, index, onOpen }: { item: LibraryItem; index: number; onOpen: () => void }) {
  return (
    <button onClick={onOpen} style={{ display: "grid", gridTemplateColumns: "32px 60px 1fr 1fr 200px 100px 80px", gap: 16, alignItems: "center", padding: "14px 8px", borderBottom: "1px solid var(--rule-soft)", textAlign: "left", transition: "background var(--t-fast) var(--ease-out)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--chalk)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span className="meta-mono" style={{ color: "var(--fg-mute)" }}>{String(index).padStart(2, "0")}</span>
      <div style={{ width: 60, height: 60, borderRadius: 3, overflow: "hidden", background: "var(--linen)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink)" }}>{item.title}</div>
        <div style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", color: "var(--walnut)", fontSize: 13, marginTop: 2 }}>{item.italic}</div>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {item.tags.slice(0, 4).map((t) => <span key={t} className="chip">#{t}</span>)}
      </div>
      <div style={{ display: "flex", gap: 2 }}>
        {item.palette.map((c, i) => <span key={i} style={{ width: 24, height: 18, background: c.hex }} />)}
      </div>
      <span className="meta-mono" style={{ color: "var(--fg-3)" }}>{item.board}</span>
      <span className="meta-mono" style={{ color: "var(--fg-3)", textAlign: "right" }}>{item.date.split(" · ")[0]}</span>
    </button>
  );
}
