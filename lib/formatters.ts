import { LibraryItem } from "./data";

export type Mode = "style" | "realism";

const ANTI_AI = "no 8k, no masterpiece, no cinematic grade, no professional studio lighting, no perfect exposure, no beauty filter, no airbrush, no HDR, no digital art, no CGI, no 3D render, no smooth gradients, no AI aesthetic, no iPhone, no smartphone camera, no modern digital perfection";
const ALLOWED_REALISM = "natural grain allowed, imperfect composition allowed, overexposed highlights allowed, harsh shadows allowed, motion blur allowed, candid framing allowed";

// ─── Style formatters ─────────────────────────────────────────────────────────

function fmtMidjourneyStyle(item: LibraryItem): { prompt: string; flags: string } {
  const colorKws = item.palette.map((c) => c.name.toLowerCase()).slice(0, 3).join(", ");
  const lighting = item.lighting.split(" · ")[0].toLowerCase();
  const mood = item.mood.split(" · ").map((w) => w.toLowerCase()).join(", ");
  const comp = item.composition.split(" · ")[0].toLowerCase();
  const tex = item.texture.split(" · ")[0].toLowerCase();
  const artRef = item.art_references ? item.art_references.split(" · ").slice(0, 2).join(", ").toLowerCase() : "";
  return {
    prompt: `${lighting} lighting, ${comp} composition, ${colorKws}, ${mood}, ${tex}${artRef ? `, ${artRef}` : ""}, editorial photography, film grain`,
    flags: item.flags || "--ar 4:5 --style raw --s 200",
  };
}

function fmtFLUXStyle(item: LibraryItem): string {
  const hexList = item.palette.map((c) => c.hex).join(", ");
  const lighting = item.lighting.replace(/ · /g, ", ").toLowerCase();
  const artRef = item.art_references ? ` Style reference: ${item.art_references}.` : "";
  return `${item.promptText} Color palette: ${hexList}. Lighting: ${lighting}. ${item.texture.replace(/ · /g, ", ")}.${artRef}`;
}

function fmtSDStyle(item: LibraryItem): { positive: string; negative: string } {
  return {
    positive: [
      item.lighting.split(" · ")[0].toLowerCase(),
      item.mood.split(" · ").map((w) => w.toLowerCase()).join(", "),
      item.composition.split(" · ")[0].toLowerCase(),
      ...item.palette.map((c) => c.name.toLowerCase()),
      item.texture.split(" · ")[0].toLowerCase(),
      "film grain", "editorial photography",
    ].join(", "),
    negative: "blurry, oversaturated, digital noise, cartoonish, anime, plastic skin, airbrushed",
  };
}

function fmtDALLEStyle(item: LibraryItem): string {
  const colors = item.palette.map((c) => c.name.toLowerCase()).join(", ");
  const mood = item.mood.split(" · ")[0].toLowerCase();
  const lighting = item.lighting.replace(/ · /g, ", ").toLowerCase();
  const artRef = item.art_references ? ` Inspired by: ${item.art_references}.` : "";
  return `A ${mood} photograph. ${item.promptText} Lighting: ${lighting}. Color palette: ${colors}. ${item.texture.split(" · ")[0].toLowerCase()} texture.${artRef} No digital art, no over-sharpening.`;
}

function fmtGeminiStyle(item: LibraryItem): string {
  const mood = item.mood.split(" · ")[0].toLowerCase();
  const colors = item.palette.map((c) => c.name.toLowerCase()).join(", ");
  const artRef = item.art_references ? ` Reference: ${item.art_references}.` : "";
  return `${mood.charAt(0).toUpperCase() + mood.slice(1)} photograph. ${item.promptText} Color tones: ${colors}. ${item.composition.split(" · ")[0]} framing.${artRef} Photographic style, natural light, no over-sharpening.`;
}

// ─── Realism formatters ───────────────────────────────────────────────────────

function fmtMidjourneyRealism(item: LibraryItem): { prompt: string; flags: string } {
  const subjects = item.subjects || item.promptText;
  const lighting = item.lighting.replace(/ · /g, ", ").toLowerCase();
  const colors = item.palette.map((c) => c.name.toLowerCase()).slice(0, 3).join(", ");
  const tex = item.texture.replace(/ · /g, ", ").toLowerCase();
  return {
    prompt: `${subjects} ${lighting} lighting. ${item.promptText} ${colors}. ${tex}. candid photography, authentic snapshot`,
    flags: (item.flags || "--ar 4:5 --style raw --s 180").replace("--s 200", "--s 140"),
  };
}

function fmtFLUXRealism(item: LibraryItem): string {
  const hexList = item.palette.map((c) => c.hex).join(", ");
  const lighting = item.lighting.replace(/ · /g, ", ").toLowerCase();
  const subjects = item.subjects || item.promptText;
  return `Photograph. ${subjects} ${item.promptText} Lighting: ${lighting}. Color palette: ${hexList}. ${item.texture.replace(/ · /g, ", ")}. ${ALLOWED_REALISM}. ${ANTI_AI}.`;
}

function fmtSDRealism(item: LibraryItem): { positive: string; negative: string } {
  const subjects = item.subjects || item.promptText;
  const lighting = item.lighting.replace(/ · /g, ", ").toLowerCase();
  return {
    positive: [
      subjects, lighting,
      item.mood.split(" · ").map((w) => w.toLowerCase()).join(", "),
      ...item.palette.map((c) => c.name.toLowerCase()),
      item.texture.split(" · ")[0].toLowerCase(),
      "film grain", "candid photography", "authentic", "(photorealistic:1.3)", "(RAW photo:1.2)",
    ].join(", "),
    negative: "8k, masterpiece, cinematic, professional studio lighting, sharp focus, perfect exposure, perfect composition, beauty filter, airbrushed, smooth skin, plastic texture, CGI, 3d render, digital art, anime, cartoon, watermark, signature, iPhone, smartphone, modern digital, excessive makeup, studio backdrop",
  };
}

function fmtDALLERealism(item: LibraryItem): string {
  const colors = item.palette.map((c) => c.name.toLowerCase()).join(", ");
  const lighting = item.lighting.replace(/ · /g, ", ").toLowerCase();
  const subjects = item.subjects || item.promptText;
  return `Photograph. ${subjects} ${item.promptText} Lighting: ${lighting}. Color palette: ${colors}. ${item.texture.replace(/ · /g, ", ")}. ${ALLOWED_REALISM}. ${ANTI_AI}.`;
}

function fmtGeminiRealism(item: LibraryItem): string {
  const mood = item.mood.split(" · ")[0].toLowerCase();
  const lighting = item.lighting.replace(/ · /g, ", ").toLowerCase();
  const colors = item.palette.map((c) => c.name.toLowerCase()).join(", ");
  const subjects = item.subjects || item.promptText;
  return `${mood.charAt(0).toUpperCase() + mood.slice(1)} photograph. ${subjects} Lighting: ${lighting}. ${item.promptText} Color tones: ${colors}. ${item.composition.split(" · ")[0]} framing. ${ALLOWED_REALISM}. ${ANTI_AI}.`;
}

// ─── Public dispatchers ───────────────────────────────────────────────────────

export function fmtMidjourney(item: LibraryItem, mode: Mode) {
  return mode === "realism" ? fmtMidjourneyRealism(item) : fmtMidjourneyStyle(item);
}
export function fmtFLUX(item: LibraryItem, mode: Mode) {
  return mode === "realism" ? fmtFLUXRealism(item) : fmtFLUXStyle(item);
}
export function fmtSD(item: LibraryItem, mode: Mode) {
  return mode === "realism" ? fmtSDRealism(item) : fmtSDStyle(item);
}
export function fmtDALLE(item: LibraryItem, mode: Mode) {
  return mode === "realism" ? fmtDALLERealism(item) : fmtDALLEStyle(item);
}
export function fmtGemini(item: LibraryItem, mode: Mode) {
  return mode === "realism" ? fmtGeminiRealism(item) : fmtGeminiStyle(item);
}
