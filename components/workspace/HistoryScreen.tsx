"use client";
import { BookmarkSimple, ClockCounterClockwise, Plus } from "@phosphor-icons/react";
import { LibraryItem } from "@/lib/data";

export function HistoryScreen({
  items,
  savedSet,
  onToggleSave,
  onOpenModal,
  onNavigate,
}: {
  items: LibraryItem[];
  savedSet: Set<string>;
  onToggleSave: (id: string) => void;
  onOpenModal: (id: string) => void;
  onNavigate: (s: "landing") => void;
}) {
  return (
    <div className="screen fade-enter">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              <ClockCounterClockwise weight="thin" size={12} style={{ marginRight: 6, display: "inline", verticalAlign: "middle" }} />
              History
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-0.025em", lineHeight: 1.0, color: "var(--ink)", marginTop: 10 }}>
              {items.length} {items.length === 1 ? "analysis" : "analyses"},
              <span style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", color: "var(--walnut)" }}> saved locally</span>.
            </h2>
          </div>
          <button className="btn btn-accent" onClick={() => onNavigate("landing")}>
            <Plus weight="thin" size={16} />New read
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", border: "1px solid var(--rule-strong)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "var(--fg-mute)" }}>
              <ClockCounterClockwise weight="thin" size={22} />
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--walnut)", marginBottom: 8 }}>No analyses yet</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-mute)" }}>
              Drop an image on the workspace to get started.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {items.map((item, i) => (
              <HistoryRow
                key={item.id}
                item={item}
                index={i + 1}
                saved={savedSet.has(item.id)}
                onOpen={() => onOpenModal(item.id)}
                onSave={() => onToggleSave(item.id)}
                isLast={i === items.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryRow({ item, index, saved, onOpen, onSave, isLast }: {
  item: LibraryItem;
  index: number;
  saved: boolean;
  onOpen: () => void;
  onSave: () => void;
  isLast: boolean;
}) {
  const mode = item.subjects ? "realism" : "style";

  return (
    <div style={{ display: "flex", gap: 20, padding: "20px 0", borderBottom: isLast ? "none" : "1px solid var(--rule-soft)", alignItems: "center" }}>
      {/* Index */}
      <div className="meta-mono" style={{ color: "var(--fg-faint)", fontSize: 11, width: 24, flexShrink: 0, paddingTop: 2 }}>
        {String(index).padStart(2, "0")}
      </div>

      {/* Thumbnail */}
      <button
        onClick={onOpen}
        style={{ width: 72, height: 90, borderRadius: 4, overflow: "hidden", background: "var(--linen)", flexShrink: 0, cursor: "pointer", border: 0, padding: 0, position: "relative" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 400ms var(--ease-out)" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        />
        {/* Palette bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", height: 4 }}>
          {item.palette.map((c, i) => <span key={i} style={{ flex: 1, background: c.hex }} />)}
        </div>
      </button>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={onOpen}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.015em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.title}
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em",
            padding: "2px 6px", borderRadius: "var(--r-pill)", flexShrink: 0,
            background: mode === "realism" ? "color-mix(in oklch, var(--terracotta) 12%, transparent)" : "var(--linen)",
            color: mode === "realism" ? "var(--terracotta)" : "var(--stone)",
            border: `1px solid ${mode === "realism" ? "color-mix(in oklch, var(--terracotta) 30%, transparent)" : "var(--rule)"}`,
          }}>
            {mode === "realism" ? "PHOTO FIDELITY" : "VISUAL STYLE"}
          </span>
        </div>
        <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 13.5, color: "var(--walnut)", lineHeight: 1.4, marginBottom: 10 }}>
          &ldquo;{item.italic}&rdquo;
        </p>
        <div style={{ display: "flex", gap: 4 }}>
          {item.tags.slice(0, 4).map((t) => <span key={t} className="chip">#{t}</span>)}
        </div>
      </div>

      {/* Palette swatches */}
      <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
        {item.palette.map((c, i) => (
          <div key={i} title={`${c.name} · ${c.hex}`} style={{ width: 16, height: 16, borderRadius: 3, background: c.hex }} />
        ))}
      </div>

      {/* Right: date + save */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
        <span className="meta-mono" style={{ color: "var(--fg-3)", fontSize: 11 }}>{item.date}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          style={{ padding: 6, borderRadius: 4, color: saved ? "var(--terracotta)" : "var(--fg-mute)", background: "transparent", transition: "color 160ms var(--ease-out)" }}
        >
          <BookmarkSimple weight={saved ? "fill" : "thin"} size={16} />
        </button>
      </div>
    </div>
  );
}
