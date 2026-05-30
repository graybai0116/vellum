"use client";
import { useState } from "react";
import Link from "next/link";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Mark } from "@/components/ui/Mark";

type Screen = "landing" | "analyzing" | "results" | "library" | "history";

const MONTHLY_LIMIT = 10;

export function TopBar({
  active, onNavigate, plan, monthlyCount = 0,
}: {
  active: Screen;
  onNavigate: (s: Screen) => void;
  plan?: "free" | "pro";
  monthlyCount?: number;
}) {
  const { isSignedIn } = useUser();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setUpgrading(false);
  };

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
        {isSignedIn && plan === "free" && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.04em" }}>
            {Math.max(0, MONTHLY_LIMIT - monthlyCount)}/{MONTHLY_LIMIT}
          </span>
        )}
        {isSignedIn && plan === "free" && (
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            style={{
              padding: "6px 14px", borderRadius: 4, fontSize: 12, fontWeight: 600,
              background: "var(--ink)", color: "var(--chalk)", cursor: "pointer",
              opacity: upgrading ? 0.6 : 1, fontFamily: "var(--font-body)",
              letterSpacing: "0.02em",
            }}
          >
            {upgrading ? "..." : "Upgrade Pro"}
          </button>
        )}
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="btn" style={{ padding: "7px 16px", fontSize: 13 }}>Sign in</button>
          </SignInButton>
        )}
      </div>
    </header>
  );
}
