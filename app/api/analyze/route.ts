import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Style Mode ────────────────────────────────────────────────────────────────
const STYLE_SYSTEM = `You are a visual intelligence instrument. Extract only the visual language of an image — light physics, color, composition, texture, mood, and art-historical context. Like a cinematographer's shot brief crossed with a curator's note: precise, technical, evocative.

Rules:
- Never describe subjects or narrative — only how the image looks
- Use vocabulary image generation models respond to: film stocks, f-stops, focal lengths, lighting rig names, photographer references
- Always name primary AND secondary light sources and how they interact
- Palette must be exactly 5 colors sampled from the actual image
- Never use vague quality words like "beautiful", "stunning", "high quality"
- For art_references: identify the artistic movement, historical period, and key stylistic techniques. If photographic, name the photographic genre, era, and key practitioners. Be specific (e.g. "Dutch Golden Age · 17th century · Vermeer-style window light, tenebrism" or "New Topographics · 1970s · Robert Adams, deadpan documentary, 8×10 view camera")`;

const STYLE_PROMPT = `Analyze this image's visual language. Return ONLY a valid JSON object — no markdown, no explanation.

{
  "title": "2-4 word evocative title for the visual style",
  "italic": "brief poetic subtitle about light quality or feeling (under 8 words)",
  "palette": [
    { "hex": "#RRGGBB", "name": "color name", "role": "Shadow" },
    { "hex": "#RRGGBB", "name": "color name", "role": "Mid" },
    { "hex": "#RRGGBB", "name": "color name", "role": "Light" },
    { "hex": "#RRGGBB", "name": "color name", "role": "Highlight" },
    { "hex": "#RRGGBB", "name": "color name", "role": "Accent" }
  ],
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "mood": "Word · Word · Word",
  "lighting": "Primary source + position + color temp. Secondary source if present. Describe interaction effect.",
  "composition": "Framing element · Subject placement · Depth",
  "texture": "Surface quality · Material · Film or sensor characteristic",
  "palette_descriptor": "One sentence on the color relationship and palette story",
  "art_references": "Movement · Period · Key techniques and artist references (e.g. 'Impressionism · Late 19th century · Plein air, Monet-style color dissolution, broken brushwork' or 'Baroque · 17th century · Chiaroscuro, Caravaggio tenebrism, single candle source'). If photographic: genre · era · practitioners.",
  "subjects": "",
  "promptText": "2-3 sentences of pure visual language: palette, light physics, composition, texture. No subject matter. Style-transfer ready.",
  "flags": "--ar W:H --style raw --s NNN",
  "board": "Editorial interiors|Studio portraits|Film stills|Architecture|Painterly|Landscape|Other"
}`;

// ─── Realism Mode ──────────────────────────────────────────────────────────────
const REALISM_SYSTEM = `You are a photographic replication instrument. Your goal is to extract everything needed to perfectly recreate this image with an AI image generator at maximum fidelity.

Extract two layers with equal precision:

LAYER 1 — VISUAL PHYSICS:
- All light sources: type, position, color temperature in Kelvin, interaction effects (e.g., "on-camera flash ~6500K overriding ambient stadium lights ~2700K, creating warm-cool contrast")
- Exact palette: 5 hex codes from the actual image
- Composition, depth, framing

LAYER 2 — PHYSICAL SUBJECT DESCRIPTION:
For people: ethnicity + approximate age, facial structure (cheekbones, jaw, canthal tilt), skin physics (subsurface scattering zones, specular highlight distribution, pore visibility, vellus hair presence), hair (color with specific tones, texture, anisotropic reflection), clothing (fabric type, sheen, drape, color), pose, expression, gaze direction
For objects/environment: material physics, surface properties, spatial relationships

Camera era and type: be specific ("early 1990s compact digital point-and-shoot, low-res sensor, CCD" vs "film SLR, Kodak Portra 400, 35mm" vs "modern mirrorless, full-frame sensor")

Use measurement language where useful. Name physical phenomena precisely.
Never use vague quality words.`;

const REALISM_PROMPT = `Analyze this image for perfect AI replication. Return ONLY a valid JSON object — no markdown, no explanation.

{
  "title": "2-4 word evocative title",
  "italic": "brief subtitle about the photographic moment (under 8 words)",
  "palette": [
    { "hex": "#RRGGBB", "name": "color name", "role": "Shadow" },
    { "hex": "#RRGGBB", "name": "color name", "role": "Mid" },
    { "hex": "#RRGGBB", "name": "color name", "role": "Light" },
    { "hex": "#RRGGBB", "name": "color name", "role": "Highlight" },
    { "hex": "#RRGGBB", "name": "color name", "role": "Accent" }
  ],
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "mood": "Word · Word · Word",
  "lighting": "All light sources named with type, position, ~Kelvin. Describe their interaction physically.",
  "composition": "Framing · Subject placement · Depth relationship",
  "texture": "Surface quality · Material · Camera/sensor characteristic including era",
  "palette_descriptor": "One sentence on the color relationship",
  "subjects": "Exhaustive physical description. People: [ethnicity, age range], [facial structure: cheekbone height, jaw definition, eye shape, canthal tilt], [skin: tone with undertone, subsurface scattering on nose/cheeks/earlobes, specular zones, micropore visibility, vellus hair on jawline], [hair: specific color tones e.g. 'chestnut brown with caramel balayage', texture, anisotropic sheen], [clothing: fabric type e.g. 'glossy satin', color, sheen level, drape], [pose, expression, gaze]. Objects: [material physics, surface properties]. Environment: [setting, time of day, architectural details].",
  "promptText": "2-3 sentences of pure visual physics: light interaction, color temperature contrast, composition, texture. No subjects. Style-transfer base.",
  "flags": "--ar W:H --style raw --s NNN",
  "board": "Editorial interiors|Studio portraits|Film stills|Architecture|Painterly|Landscape|Other"
}`;

// ─── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { imageDataUrl, imageName, mode = "style" } = await req.json();

    const [header, base64Data] = imageDataUrl.split(",");
    const rawType = header.match(/:(.*?);/)?.[1] || "image/jpeg";
    const mediaType = (
      ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(rawType)
        ? rawType
        : "image/jpeg"
    ) as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

    const isRealism = mode === "realism";

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1536,
      system: isRealism ? REALISM_SYSTEM : STYLE_SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
            { type: "text", text: isRealism ? REALISM_PROMPT : STYLE_PROMPT },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
      return NextResponse.json({ error: "Parse failed", raw: text }, { status: 500 });

    const analysis = JSON.parse(jsonMatch[0]);
    const timeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", hour12: false,
    });

    return NextResponse.json({
      id: `upload-${Date.now()}`,
      title: analysis.title || "Untitled",
      italic: analysis.italic || "",
      image: imageDataUrl,
      palette: (analysis.palette || []).slice(0, 5),
      tags: analysis.tags || [],
      mood: analysis.mood || "",
      lighting: analysis.lighting || "",
      composition: analysis.composition || "",
      texture: analysis.texture || "",
      palette_descriptor: analysis.palette_descriptor || "",
      art_references: analysis.art_references || "",
      subjects: analysis.subjects || "",
      promptText: analysis.promptText || "",
      flags: analysis.flags || "--ar 4:5 --style raw --s 200",
      chars: (analysis.promptText || "").length,
      date: `Today · ${timeStr}`,
      source: imageName,
      saved: false,
      board: analysis.board || "Other",
    });
  } catch (err) {
    console.error("analyze error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
