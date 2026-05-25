export function Eyebrow({ num, children, style }: { num?: string; children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="eyebrow" style={style}>
      {num && <span className="eyebrow-num">{num}</span>}
      {children}
    </div>
  );
}

export function SectionRule({ label, num }: { label?: string; num?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "48px 0 24px" }}>
      {(label || num) && (
        <span className="eyebrow" style={{ whiteSpace: "nowrap" }}>
          {num && <span className="eyebrow-num">{num}</span>}{label}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
    </div>
  );
}
