"use client";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Mark } from "@/components/ui/Mark";

type Screen = "landing" | "analyzing" | "results" | "library" | "history";

export function TopBar({
  active, onNavigate,
}: {
  active: Screen;
  onNavigate: (s: Screen) => void;
}) {
  return (
    <header className="topbar-minimal">
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
        <Mark size={26} />
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 520,
          letterSpacing: "0.005em", color: "var(--ink)", lineHeight: 1,
          fontVariationSettings: '"opsz" 84',
        }}>VELLUM</span>
      </Link>
      <div className="topbar-right">
        <button
          onClick={() => onNavigate("landing")}
          className={`min-link${active === "landing" ? " active" : ""}`}
        >New</button>
        <button
          onClick={() => onNavigate("library")}
          className={`min-link${active === "library" ? " active" : ""}`}
        >Library</button>
        <button
          onClick={() => onNavigate("history")}
          className={`min-link${active === "history" ? " active" : ""}`}
        >History</button>
        <span className="topbar-divider" />
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
