"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { LIBRARY, LibraryItem } from "@/lib/data";
import { TopBar } from "./TopBar";
import { LandingScreen, AnalysisMode } from "./LandingScreen";
import { AnalyzingScreen } from "./AnalyzingScreen";
import { ResultsScreen } from "./ResultsScreen";
import { LibraryScreen } from "./LibraryScreen";
import { HistoryScreen } from "./HistoryScreen";
import { StyleModal } from "./StyleModal";
import { Toast } from "@/components/ui/Toast";

type Screen = "landing" | "analyzing" | "results" | "library" | "history";
interface UploadedImage { src: string; name: string; }

// Resize image to max 1536px before sending to API
function resizeImage(dataUrl: string, maxPx = 1536): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.src = dataUrl;
  });
}

export function WorkspaceApp({ initialScreen = "landing" }: { initialScreen?: Screen }) {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [currentItemId, setCurrentItemId] = useState(LIBRARY[0].id);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState<UploadedImage | null>(null);
  const [analysisResult, setAnalysisResult] = useState<LibraryItem | null>(null);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [analysisError, setAnalysisError] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("style");
  const [toastMsg, setToastMsg] = useState("");
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());
  const [savedUploads, setSavedUploads] = useState<LibraryItem[]>([]);
  const [analysisHistory, setAnalysisHistory] = useState<LibraryItem[]>([]);
  const hasLoadedRef = useRef(false);
  const [confirmUnsaveId, setConfirmUnsaveId] = useState<string | null>(null);
  const analyzedItemsRef = useRef<Map<string, LibraryItem>>(new Map());

  useEffect(() => {
    fetch("/api/user-data")
      .then((r) => r.json())
      .then((data) => {
        setAnalysisHistory(data.history ?? []);
        setSavedUploads(data.saved_uploads ?? []);
        setSavedSet(new Set(data.saved_ids ?? []));
        hasLoadedRef.current = true;
      })
      .catch(() => { hasLoadedRef.current = true; });
  }, []);

  const persistUserData = (
    history: LibraryItem[],
    savedIds: string[],
    savedUploadsArr: LibraryItem[]
  ) => {
    fetch("/api/user-data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        history: history.slice(0, 30),
        saved_ids: savedIds,
        saved_uploads: savedUploadsArr.slice(0, 30),
      }),
    });
  };
  const [modalItemId, setModalItemId] = useState<string | null>(null);

  const navigate = (s: Screen | "back-to-results", id?: string) => {
    if (s === "results" && id) {
      const allItems = [...analysisHistory, ...savedUploads, ...LIBRARY];
      const found = allItems.find((x) => x.id === id);
      if (found) setAnalysisMode(found.subjects ? "realism" : "style");
      setCurrentItemId(id); setUploadedImage(null); setAnalysisResult(null); setScreen("results");
    } else if (s === "back-to-results") {
      setScreen("results");
    } else if (s === "landing") {
      setAnalysisResult(null); setUploadedImage(null); setAnalyzingImage(null);
      setScreen("landing");
    } else {
      setScreen(s as Screen);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpload = async ({ name, dataUrl }: { name: string; dataUrl: string }, mode: AnalysisMode) => {
    const resized = await resizeImage(dataUrl);
    setAnalyzingImage({ src: resized, name });
    setAnalysisResult(null);
    setAnalysisReady(false);
    setAnalysisError(false);
    setAnalysisMode(mode);
    setScreen("analyzing");

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageDataUrl: resized, imageName: name, mode }),
    })
      .then((r) => r.json())
      .then((result) => {
        analyzedItemsRef.current.set(result.id, result);
        setAnalysisResult(result);
        setAnalysisReady(true);
        setAnalysisHistory((prev) => {
          const next = [result, ...prev];
          persistUserData(next, [...savedSet], savedUploads);
          return next;
        });
      })
      .catch(() => { setAnalysisError(true); setAnalysisReady(true); });
  };

  const handleUploadUrl = (url: string, mode: AnalysisMode) => {
    const name = url.split("/").pop()?.split("?")[0] || "image";
    setAnalyzingImage({ src: url, name });
    setAnalysisResult(null);
    setAnalysisReady(false);
    setAnalysisError(false);
    setAnalysisMode(mode);
    setScreen("analyzing");

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: url, imageName: name, mode }),
    })
      .then((r) => r.json())
      .then((result) => {
        analyzedItemsRef.current.set(result.id, result);
        setAnalysisResult(result);
        setAnalysisReady(true);
        setAnalysisHistory((prev) => {
          const next = [result, ...prev];
          persistUserData(next, [...savedSet], savedUploads);
          return next;
        });
      })
      .catch(() => { setAnalysisError(true); setAnalysisReady(true); });
  };

  const handleAnalyzingDone = useCallback(() => {
    setUploadedImage(analyzingImage);
    setScreen("results");
  }, [analyzingImage]);

  const toggleSave = (id: string) => {
    const inLibrary = LIBRARY.some((x) => x.id === id);
    const newSet = new Set(savedSet);
    let newUploads = savedUploads;

    if (newSet.has(id)) {
      newSet.delete(id);
      if (!inLibrary) newUploads = savedUploads.filter((x) => x.id !== id);
      setToastMsg("Removed from saved");
    } else {
      newSet.add(id);
      if (!inLibrary) {
        const item = analyzedItemsRef.current.get(id) || analysisHistory.find((x) => x.id === id);
        if (item && !savedUploads.some((x) => x.id === id)) newUploads = [item, ...savedUploads];
      }
      setToastMsg("Saved to library");
    }

    setSavedSet(newSet);
    setSavedUploads(newUploads);
    persistUserData(analysisHistory, [...newSet], newUploads);
  };

  const requestToggleSave = (id: string) => {
    if (savedSet.has(id)) {
      setConfirmUnsaveId(id);
    } else {
      toggleSave(id);
    }
  };

  const seenIds = new Set<string>();
  const allLibraryItems: LibraryItem[] = [];
  for (const item of [...analysisHistory, ...savedUploads, ...LIBRARY]) {
    if (!seenIds.has(item.id)) { seenIds.add(item.id); allLibraryItems.push(item); }
  }

  const currentItem = analysisResult || allLibraryItems.find((x) => x.id === currentItemId) || LIBRARY[0];
  const modalItem = modalItemId ? allLibraryItems.find((x) => x.id === modalItemId) : null;
  const modalIdx = modalItemId ? allLibraryItems.findIndex((x) => x.id === modalItemId) : -1;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Paper texture — fine grain + warm vignette */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        {/* Fine grain */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          backgroundRepeat: "repeat",
          opacity: 0.28,
          mixBlendMode: "overlay",
        }} />
        {/* Coarser fiber layer */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.25' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23f)'/%3E%3C/svg%3E")`,
          backgroundSize: "400px 400px",
          backgroundRepeat: "repeat",
          opacity: 0.06,
          mixBlendMode: "multiply",
        }} />
        {/* Edge vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 25%, rgba(120,85,40,0.22) 100%)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>
      <TopBar active={screen} onNavigate={(s) => navigate(s)} />

      {screen === "landing" && (
        <LandingScreen onUpload={handleUpload} onUploadUrl={handleUploadUrl} />
      )}
      {screen === "analyzing" && analyzingImage && (
        <AnalyzingScreen image={analyzingImage} onDone={handleAnalyzingDone} ready={analysisReady} error={analysisError} onBack={() => navigate("landing")} />
      )}
      {screen === "results" && (
        <ResultsScreen item={currentItem} image={uploadedImage} mode={analysisMode} onNavigate={() => navigate("library")} onToast={setToastMsg} onSave={requestToggleSave} isSaved={savedSet.has(currentItem.id)} />
      )}
      {screen === "library" && (
        <LibraryScreen onNavigate={() => navigate("landing")} savedSet={savedSet} onToggleSave={requestToggleSave} onOpenModal={(id) => setModalItemId(id)} extraItems={savedUploads} hasLastAnalysis={analysisResult !== null} onBackToResults={() => navigate("back-to-results")} />
      )}
      {screen === "history" && (
        <HistoryScreen items={analysisHistory} savedSet={savedSet} onToggleSave={requestToggleSave} onOpenModal={(id) => setModalItemId(id)} onNavigate={() => navigate("landing")} />
      )}

      {modalItem && (
        <StyleModal
          item={modalItem}
          onClose={() => setModalItemId(null)}
          onToast={setToastMsg}
          onSave={() => requestToggleSave(modalItem.id)}
          isSaved={savedSet.has(modalItem.id)}
          hasPrev={modalIdx > 0}
          hasNext={modalIdx < allLibraryItems.length - 1}
          onPrev={() => setModalItemId(allLibraryItems[modalIdx - 1].id)}
          onNext={() => setModalItemId(allLibraryItems[modalIdx + 1].id)}
          onOpenResults={() => { setModalItemId(null); navigate("results", modalItem.id); }}
        />
      )}

      <Toast msg={toastMsg} onDone={() => setToastMsg("")} />

      {confirmUnsaveId && (() => {
        const item = allLibraryItems.find((x) => x.id === confirmUnsaveId) || LIBRARY.find((x) => x.id === confirmUnsaveId);
        return (
          <div
            onClick={() => setConfirmUnsaveId(null)}
            style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(20,14,10,0.45)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: "var(--chalk)", border: "1px solid var(--rule-soft)", borderRadius: "var(--r-lg)", width: "min(400px, 100%)", boxShadow: "var(--shadow-3)", overflow: "hidden" }}
            >
              <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.02em" }}>Remove from saved?</div>
                  {item && <div style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 14, color: "var(--walnut)", marginTop: 6 }}>&ldquo;{item.title}&rdquo;</div>}
                </div>
                <button onClick={() => setConfirmUnsaveId(null)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--rule)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--fg-3)", flexShrink: 0 }}>
                  <X weight="thin" size={14} />
                </button>
              </div>
              <div style={{ padding: "10px 24px 24px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)", lineHeight: 1.6 }}>
                  This will remove it from your saved collection. You can save it again any time.
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button
                    onClick={() => setConfirmUnsaveId(null)}
                    className="btn btn-ghost"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { toggleSave(confirmUnsaveId); setConfirmUnsaveId(null); }}
                    style={{ flex: 1, padding: "10px 0", background: "var(--terracotta)", color: "var(--chalk)", borderRadius: "var(--r-sm)", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "background 160ms var(--ease-out)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--terracotta-deep)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--terracotta)")}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      </div>
    </div>
  );
}
