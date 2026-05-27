"use client";
import { useState, useCallback, useRef } from "react";
import { LIBRARY, LibraryItem } from "@/lib/data";
import { TopBar } from "./TopBar";
import { LandingScreen, AnalysisMode } from "./LandingScreen";
import { AnalyzingScreen } from "./AnalyzingScreen";
import { ResultsScreen } from "./ResultsScreen";
import { LibraryScreen } from "./LibraryScreen";
import { StyleModal } from "./StyleModal";
import { Toast } from "@/components/ui/Toast";

type Screen = "landing" | "analyzing" | "results" | "library";
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

export function WorkspaceApp() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [currentItemId, setCurrentItemId] = useState(LIBRARY[0].id);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState<UploadedImage | null>(null);
  const [analysisResult, setAnalysisResult] = useState<LibraryItem | null>(null);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("style");
  const [toastMsg, setToastMsg] = useState("");
  const [savedSet, setSavedSet] = useState<Set<string>>(
    new Set(LIBRARY.filter((x) => x.saved).map((x) => x.id))
  );
  const [savedUploads, setSavedUploads] = useState<LibraryItem[]>([]);
  // Tracks all analyzed items by id so toggleSave can find them without prop drilling
  const analyzedItemsRef = useRef<Map<string, LibraryItem>>(new Map());
  const [modalItemId, setModalItemId] = useState<string | null>(null);

  const navigate = (s: Screen | "results-sample" | "back-to-results", id?: string) => {
    if (s === "results" && id) {
      setCurrentItemId(id); setUploadedImage(null); setAnalysisResult(null); setScreen("results");
    } else if (s === "results-sample") {
      const sample = LIBRARY[0];
      setAnalyzingImage({ src: sample.image, name: "sample · editorial-interior.jpg" });
      setCurrentItemId(sample.id);
      setAnalysisResult(null);
      setAnalysisReady(true);
      setScreen("analyzing");
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
    setAnalysisMode(mode);
    setScreen("analyzing");

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageDataUrl: resized, imageName: name, mode }),
    })
      .then((r) => r.json())
      .then((result) => { analyzedItemsRef.current.set(result.id, result); setAnalysisResult(result); setAnalysisReady(true); })
      .catch(() => setAnalysisReady(true)); // fallback: let animation finish with sample data
  };

  const handleAnalyzingDone = useCallback(() => {
    setUploadedImage(analyzingImage);
    setScreen("results");
  }, [analyzingImage]);

  const toggleSave = (id: string) => {
    const inLibrary = LIBRARY.some((x) => x.id === id);
    setSavedSet((s) => {
      const ns = new Set(s);
      if (ns.has(id)) {
        ns.delete(id);
        if (!inLibrary) setSavedUploads((prev) => prev.filter((x) => x.id !== id));
        setToastMsg("Removed from saved");
      } else {
        ns.add(id);
        if (!inLibrary) {
          const item = analyzedItemsRef.current.get(id);
          if (item) setSavedUploads((prev) => [item, ...prev]);
        }
        setToastMsg("Saved to library");
      }
      return ns;
    });
  };

  const currentItem = analysisResult || LIBRARY.find((x) => x.id === currentItemId) || LIBRARY[0];

  const allLibraryItems = [...savedUploads, ...LIBRARY];
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
        <LandingScreen onUpload={handleUpload} onNavigate={() => navigate("results-sample")} />
      )}
      {screen === "analyzing" && analyzingImage && (
        <AnalyzingScreen image={analyzingImage} onDone={handleAnalyzingDone} ready={analysisReady} />
      )}
      {screen === "results" && (
        <ResultsScreen item={currentItem} image={uploadedImage} mode={analysisMode} onNavigate={() => navigate("library")} onToast={setToastMsg} onSave={toggleSave} isSaved={savedSet.has(currentItem.id)} />
      )}
      {screen === "library" && (
        <LibraryScreen onNavigate={() => navigate("landing")} savedSet={savedSet} onToggleSave={toggleSave} onOpenModal={(id) => setModalItemId(id)} extraItems={savedUploads} hasLastAnalysis={analysisResult !== null} onBackToResults={() => navigate("back-to-results")} />
      )}

      {modalItem && (
        <StyleModal
          item={modalItem}
          onClose={() => setModalItemId(null)}
          onToast={setToastMsg}
          onSave={() => toggleSave(modalItem.id)}
          isSaved={savedSet.has(modalItem.id)}
          hasPrev={modalIdx > 0}
          hasNext={modalIdx < allLibraryItems.length - 1}
          onPrev={() => setModalItemId(allLibraryItems[modalIdx - 1].id)}
          onNext={() => setModalItemId(allLibraryItems[modalIdx + 1].id)}
        />
      )}

      <Toast msg={toastMsg} onDone={() => setToastMsg("")} />
      </div>
    </div>
  );
}
