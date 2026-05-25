export function Mark({ size = 28, color = "var(--ink)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" role="img" aria-label="Vellum">
      <g fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round">
        <path d="M14 24 V14 H24" />
        <path d="M82 24 V14 H72" />
        <path d="M14 72 V82 H24" />
        <path d="M82 72 V82 H72" />
      </g>
      <text
        x="48" y="68" textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="500" fontSize="62" fill={color}
      >V</text>
      <line x1="40" y1="78" x2="56" y2="78" stroke="var(--terracotta)" strokeWidth="1.2" />
    </svg>
  );
}
