const LIGHT_KW = ["light", "lit", "afternoon", "evening", "shadow", "glow", "bloom", "diffused"];
const PALETTE_KW = ["walnut", "cream", "terracotta", "bone", "rust", "honey", "midnight", "sage", "carbon", "chalk"];
const FORMAT_KW = ["35mm", "mid-format", "medium format", "8x10", "6x7", "anamorphic", "view camera"];

export function PromptHighlight({ text }: { text: string }) {
  const tokens = text.split(/(\s+|[,.])/);
  return (
    <span>
      {tokens.map((t, i) => {
        const low = t.toLowerCase();
        if (LIGHT_KW.some((k) => low.includes(k))) return <span key={i} style={{ color: "var(--honey)" }}>{t}</span>;
        if (PALETTE_KW.some((k) => low.includes(k))) return <span key={i} style={{ color: "var(--terracotta)" }}>{t}</span>;
        if (FORMAT_KW.some((k) => low.includes(k))) return <span key={i} style={{ color: "var(--sage)" }}>{t}</span>;
        return <span key={i}>{t}</span>;
      })}
    </span>
  );
}
