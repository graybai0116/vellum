"use client";
import { useState, useCallback } from "react";
import { LIBRARY } from "@/lib/data";
import { TopBar } from "./TopBar";
import { LandingScreen } from "./LandingScreen";
import { AnalyzingScreen } from "./AnalyzingScreen";
import { ResultsScreen } from "./ResultsScreen";
import { LibraryScreen } from "./LibraryScreen";
import { StyleModal } from "./StyleModal";
import { Toast } from "@/components/ui/Toast";

type Screen = "landing" | "analyzing" | "results" | "library";
interface UploadedImage { src: string; name: string; }

export function WorkspaceApp() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [currentItemId, setCurrentItemId] = useState(LIBRARY[0].id);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState<UploadedImage | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [savedSet, setSavedSet] = useState<Set<string>>(
    new Set(LIBRARY.filter((x) => x.saved).map((x) => x.id))
  );
  const [modalItemId, setModalItemId] = useState<string | null>(null);

  const navigate = (s: Screen | "results-sample", id?: string) => {
    if (s === "results" && id) {
      setCurrentItemId(id); setUploadedImage(null); setScreen("results");
    } else if (s === "results-sample") {
      const sample = LIBRARY[0];
      setAnalyzingImage({ src: sample.image, name: "sample · editorial-interior.jpg" });
      setCurrentItemId(sample.id);
      setScreen("analyzing");
    } else {
      setScreen(s as Screen);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpload = ({ name, dataUrl }: { name: string; dataUrl: string }) => {
    setAnalyzingImage({ src: dataUrl, name });
    setCurrentItemId(LIBRARY[0].id);
    setScreen("analyzing");
  };

  const handleAnalyzingDone = useCallback(() => {
    setUploadedImage(analyzingImage);
    setScreen("results");
  }, [analyzingImage]);

  const toggleSave = (id: string) => {
    setSavedSet((s) => {
      const ns = new Set(s);
      if (ns.has(id)) { ns.delete(id); setToastMsg("Removed from saved"); }
      else { ns.add(id); setToastMsg("Saved to library"); }
      return ns;
    });
  };

  const currentItem = LIBRARY.find((x) => x.id === currentItemId) || LIBRARY[0];

  const modalItem = modalItemId ? LIBRARY.find((x) => x.id === modalItemId) : null;
  const modalIdx = modalItemId ? LIBRARY.findIndex((x) => x.id === modalItemId) : -1;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <TopBar active={screen} onNavigate={(s) => navigate(s)} />

      {screen === "landing" && (
        <LandingScreen onUpload={handleUpload} onNavigate={() => navigate("results-sample")} />
      )}
      {screen === "analyzing" && analyzingImage && (
        <AnalyzingScreen image={analyzingImage} onDone={handleAnalyzingDone} />
      )}
      {screen === "results" && (
        <ResultsScreen item={currentItem} image={uploadedImage} onNavigate={() => navigate("library")} onToast={setToastMsg} onSave={toggleSave} isSaved={savedSet.has(currentItem.id)} />
      )}
      {screen === "library" && (
        <LibraryScreen onNavigate={() => navigate("landing")} savedSet={savedSet} onToggleSave={toggleSave} onOpenModal={(id) => setModalItemId(id)} />
      )}

      {modalItem && (
        <StyleModal
          item={modalItem}
          onClose={() => setModalItemId(null)}
          onToast={setToastMsg}
          onSave={() => toggleSave(modalItem.id)}
          isSaved={savedSet.has(modalItem.id)}
          hasPrev={modalIdx > 0}
          hasNext={modalIdx < LIBRARY.length - 1}
          onPrev={() => setModalItemId(LIBRARY[modalIdx - 1].id)}
          onNext={() => setModalItemId(LIBRARY[modalIdx + 1].id)}
        />
      )}

      <Toast msg={toastMsg} onDone={() => setToastMsg("")} />
    </div>
  );
}
