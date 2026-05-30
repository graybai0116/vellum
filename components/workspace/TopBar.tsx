"use client";
import { useState } from "react";
import Link from "next/link";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Mark } from "@/components/ui/Mark";

type Screen = "landing" | "analyzing" | "results" | "library" | "history";

const MONTHLY_LIMIT = 10;
const ANON_LIMIT = 3;

export function TopBar({
  active, onNavigate, plan, monthlyCount = 0, anonCount = 0, hasResult = false,
}: {
  active: Screen;
  onNavigate: (s: Screen) => void;
  plan?: "free" | "pro";
  monthlyCount?: number;
  anonCount?: number;
  hasResult?: boolean;
}) {
  const { isSignedIn } = useUser();
  const [upgrading, setUpgrading] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setUpgrading(false);
  };

  const handleManage = async () => {
    setOpeningPortal(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setOpeningPortal(false);
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
          onClick={() => onNavigate(hasResult ? "results" : "landing")}
          className={`min-link${active === "landing" || active === "results" ? " active" : ""}`}
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
        {isSignedIn && plan === "pro" && (
          <>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.1em", color: "var(--terracotta)",
              background: "color-mix(in srgb, var(--terracotta) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--terracotta) 30%, transparent)",
              borderRadius: 3, padding: "3px 7px", lineHeight: 1,
            }}>PRO</span>
            <button
              onClick={handleManage}
              disabled={openingPortal}
              style={{
                padding: "6px 14px", borderRadius: 4, fontSize: 12, fontWeight: 500,
                background: "transparent", color: "var(--fg-3)", cursor: "pointer",
                opacity: openingPortal ? 0.5 : 1, fontFamily: "var(--font-body)",
                border: "1px solid var(--rule)", letterSpacing: "0.01em",
              }}
            >
              {openingPortal ? "..." : "Manage subscription"}
            </button>
          </>
        )}
        {!isSignedIn && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.04em" }}>
            {Math.max(0, ANON_LIMIT - anonCount)}/{ANON_LIMIT} free
          </span>
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
