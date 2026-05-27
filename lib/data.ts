export interface PaletteColor {
  hex: string;
  name: string;
  role: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  italic: string;
  image: string;
  palette: PaletteColor[];
  tags: string[];
  mood: string;
  lighting: string;
  composition: string;
  texture: string;
  palette_descriptor: string;
  art_references: string;
  promptText: string;
  subjects: string;
  flags: string;
  chars: number;
  date: string;
  source: string;
  saved: boolean;
  board: string;
}

export interface Board {
  id: string;
  name: string;
  count: number;
}

const PALETTES: Record<string, PaletteColor[]> = {
  editorial_interior: [
    { hex: "#1F1611", name: "Walnut ink", role: "Shadow" },
    { hex: "#5A4634", name: "Aged oak", role: "Mid" },
    { hex: "#A38A6E", name: "Linen rope", role: "Light" },
    { hex: "#D8C4A4", name: "Warm cream", role: "Highlight" },
    { hex: "#C5694A", name: "Terracotta", role: "Accent" },
  ],
  fashion_portrait: [
    { hex: "#0E0B09", name: "Ink", role: "Shadow" },
    { hex: "#3E2B1F", name: "Cocoa", role: "Mid" },
    { hex: "#9B7A5C", name: "Camel", role: "Skin" },
    { hex: "#E9DAC2", name: "Bone", role: "Highlight" },
    { hex: "#8A3A23", name: "Rust", role: "Accent" },
  ],
  film_still: [
    { hex: "#0A0F1A", name: "Midnight", role: "Shadow" },
    { hex: "#2D3B4C", name: "Steel", role: "Mid" },
    { hex: "#7B6A52", name: "Tobacco", role: "Skin" },
    { hex: "#D7A24E", name: "Honey", role: "Glow" },
    { hex: "#C5694A", name: "Lantern", role: "Accent" },
  ],
  architectural: [
    { hex: "#181614", name: "Carbon", role: "Shadow" },
    { hex: "#6A5C4E", name: "Concrete", role: "Mid" },
    { hex: "#B6A78A", name: "Stone wash", role: "Plaster" },
    { hex: "#EADFC9", name: "Chalk", role: "Highlight" },
    { hex: "#7B8A5F", name: "Sage", role: "Foliage" },
  ],
  still_life: [
    { hex: "#1C1410", name: "Espresso", role: "Shadow" },
    { hex: "#6E4F3B", name: "Walnut", role: "Mid" },
    { hex: "#C29A6C", name: "Brass", role: "Surface" },
    { hex: "#F0E3C9", name: "Parchment", role: "Highlight" },
    { hex: "#9F4F36", name: "Sienna", role: "Accent" },
  ],
  desert: [
    { hex: "#2A1C13", name: "Tar", role: "Shadow" },
    { hex: "#7B5238", name: "Earth", role: "Mid" },
    { hex: "#C99572", name: "Sandstone", role: "Light" },
    { hex: "#EFD8B0", name: "Sun-bleach", role: "Sky" },
    { hex: "#D7A24E", name: "Honey", role: "Accent" },
  ],
};

const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?w=1100&q=80&auto=format&fit=crop`;

export const LIBRARY: LibraryItem[] = [
  {
    id: "ed-int-01",
    title: "Editorial interior",
    italic: "warm afternoon, half-step back",
    image: IMG("photo-1505691938895-1758d7feb511"),
    palette: PALETTES.editorial_interior,
    tags: ["interior", "editorial", "35mm", "warm"],
    mood: "Calm · Restrained · Lived-in",
    lighting: "Soft natural · Camera-left · Late afternoon",
    composition: "Centered · Negative space right · Eye-level",
    texture: "Mid-format film grain · Soft falloff",
    palette_descriptor: "Walnut, cream, terracotta — a 90/10 neutral-to-accent split.",
    art_references: "Editorial Photography · 1990s–2000s · AD / Architectural Digest style, Oberto Gili influence, warm-grain interior reportage",
    promptText:
      "A muted interior tableau bathed in soft late-afternoon light from camera-left. Walnut wood and warm cream walls anchor the composition; a single terracotta object draws the eye. The camera is held a quiet half-step back, mid-format on 35mm-equivalent film, eye-level. Restrained palette, subtle grain, no contrast push.",
    subjects: "",
    flags: "--ar 4:5 --style raw --s 250",
    chars: 312,
    date: "Today · 14:32",
    source: "upload-2847.jpg · 3024 × 4032",
    saved: true,
    board: "Editorial interiors",
  },
  {
    id: "fa-po-02",
    title: "Fashion portrait, soft",
    italic: "diffused window, low contrast",
    image: IMG("photo-1531123897727-8f129e1688ce"),
    palette: PALETTES.fashion_portrait,
    tags: ["portrait", "fashion", "studio", "low-contrast"],
    mood: "Quiet · Reserved · Tactile",
    lighting: "Diffused window · Soft fill · Overcast",
    composition: "Three-quarter · Crop at clavicle · Negative left",
    texture: "Smooth grain · Subtle film bloom",
    palette_descriptor: "Bone, cocoa, and a single rust accent in the lip.",
    art_references: "Fashion Photography · 1990s–2000s · Peter Lindbergh influence, soft-light humanism, Helmut Newton restraint without severity",
    promptText:
      "A reserved fashion portrait in diffused window light, three-quarter framing cropped at the clavicle. Skin reads as warm camel against a bone backdrop; a single rust note appears in the lip. Low contrast, soft film bloom, no harsh shadows. 6x7 medium format, 80mm equivalent.",
    subjects: "",
    flags: "--ar 4:5 --style raw --s 180",
    chars: 296,
    date: "Yesterday · 18:04",
    source: "linked-url.webp · 2400 × 3000",
    saved: true,
    board: "Studio portraits",
  },
  {
    id: "fi-st-03",
    title: "Lantern, night corridor",
    italic: "Wong Kar-wai, lanterns at dusk",
    image: IMG("photo-1493514789931-586cb221d7a7"),
    palette: PALETTES.film_still,
    tags: ["film", "cinematic", "night", "honey"],
    mood: "Romantic · Suspended · Melancholy",
    lighting: "Single warm source · Lantern-glow · Top-down",
    composition: "Tight corridor · Leading lines · Off-center subject",
    texture: "Grain · Light bloom · Wet floor reflection",
    palette_descriptor: "Midnight blue undertone interrupted by lantern honey.",
    art_references: "In-Camera Film · 1990s Hong Kong Cinema · Wong Kar-wai, Christopher Doyle, available-light expressionism, saturated neon against deep shadow",
    promptText:
      "A single warm lantern lights a narrow night corridor from above; a figure stands slightly off-center, half-turned. Midnight blue undertones throughout, the lantern punching a small honey glow with light bloom. Wet floor reflects the source. 35mm cinematic, anamorphic flare, romantic and suspended.",
    subjects: "",
    flags: "--ar 21:9 --style cinematic --s 350",
    chars: 318,
    date: "Mar 14 · 09:11",
    source: "still-0123.png · 1920 × 1080",
    saved: true,
    board: "Film stills",
  },
  {
    id: "ar-04",
    title: "Concrete cloister",
    italic: "Tadao Ando, oblique light",
    image: IMG("photo-1481253127861-534498168948"),
    palette: PALETTES.architectural,
    tags: ["architecture", "concrete", "stone", "shadow"],
    mood: "Austere · Silent · Reverent",
    lighting: "Oblique skylight · Single shaft · High noon",
    composition: "Symmetric vanishing · Strong diagonals · Geometric",
    texture: "Bush-hammered concrete · Smooth plaster · Dust motes",
    palette_descriptor: "Carbon and chalk separated only by a single sage strip.",
    art_references: "Architectural Photography · Contemporary · Tadao Ando minimalism, Julius Shulman influence, New Brutalism, light-as-material philosophy",
    promptText:
      "A concrete cloister photographed from the cardinal axis with strong oblique skylight cutting diagonally across bush-hammered walls. Tadao-Ando minimalism, near-silent palette of carbon and chalk, a single sliver of sage foliage just visible through the opening. Dust motes catch the shaft.",
    subjects: "",
    flags: "--ar 3:2 --style architectural --s 200",
    chars: 304,
    date: "Mar 12 · 21:48",
    source: "linked-url.jpg · 4000 × 2667",
    saved: false,
    board: "Architecture",
  },
  {
    id: "sl-05",
    title: "Pewter & pear",
    italic: "Chardin, single window, dusk",
    image: IMG("photo-1481349518771-20055b2a7b24"),
    palette: PALETTES.still_life,
    tags: ["still-life", "painterly", "tactile", "warm"],
    mood: "Contemplative · Domestic · Slow",
    lighting: "Single high window · Falloff to black · Dusk",
    composition: "Asymmetric · Tabletop · Painter's eye-level",
    texture: "Painterly · Soft focus on edges · Brass patina",
    palette_descriptor: "Chardin's brass-and-parchment study with one sienna note.",
    art_references: "Dutch Golden Age Still Life · 17th century · Jean-Baptiste-Siméon Chardin, tenebrism, single-window chiaroscuro, tactile surface rendering",
    promptText:
      "A small still life of brass and pear on a worn oak table, lit by a single high window at dusk with deep falloff to black. Painterly soft focus, asymmetric composition at painter's eye-level. Brass patina catches the last light; one sienna fold of cloth completes the palette.",
    subjects: "",
    flags: "--ar 4:5 --style painterly --s 220",
    chars: 290,
    date: "Mar 09 · 17:22",
    source: "upload-2851.jpg · 3024 × 4032",
    saved: true,
    board: "Painterly",
  },
  {
    id: "de-06",
    title: "Sun-bleached crossing",
    italic: "Joel Sternfeld, US Route, midday",
    image: IMG("photo-1473773508845-188df298d2d1"),
    palette: PALETTES.desert,
    tags: ["landscape", "desert", "documentary", "sunbleached"],
    mood: "Wide · Patient · American",
    lighting: "Overhead sun · Flat shadow · Heat haze",
    composition: "Wide horizon · Rule-of-thirds road · Distant figure",
    texture: "Crisp sand grain · Heat shimmer · Dust",
    palette_descriptor: "Earth and sandstone under sun-bleached sky.",
    art_references: "New Topographics · 1970s–1980s · Joel Sternfeld, Robert Adams, deadpan large-format documentary, 8×10 view camera, non-dramatic American vernacular landscape",
    promptText:
      "A wide desert crossing under flat overhead sun, the road bisecting the lower third and a small distant figure on the right horizon. Sternfeld-style documentary, earth and sandstone tones beneath a sun-bleached sky, heat shimmer above the asphalt. 8x10 view camera feel, no drama.",
    subjects: "",
    flags: "--ar 16:9 --style documentary --s 160",
    chars: 312,
    date: "Mar 04 · 11:00",
    source: "linked-url.webp · 5000 × 2813",
    saved: false,
    board: "Landscape",
  },
  {
    id: "ed-int-07",
    title: "Linen room, white noon",
    italic: "Axel Vervoordt, midday plaster",
    image: IMG("photo-1567016376408-0226e4d0c1ea"),
    palette: PALETTES.architectural,
    tags: ["interior", "minimal", "plaster", "noon"],
    mood: "Spare · Bright · Monastic",
    lighting: "Overhead diffuse · Window-bounced · Midday",
    composition: "Centered chair · Negative space dominant · Wide frame",
    texture: "Lime plaster · Linen weave · Bare wood",
    palette_descriptor: "Stone wash and chalk, no accent.",
    art_references: "Wabi-Sabi Interior Photography · Contemporary · Axel Vervoordt, Pieter Porters influence, Belgian minimalism, imperfect-material philosophy",
    promptText:
      "A spare room in midday white light: lime plaster walls, a single linen-covered chair centered against vast negative space, bare wood floor beneath. Stone wash and chalk palette throughout, no accent colour. Overhead diffuse light bounced through a tall window. Vervoordt-quiet.",
    subjects: "",
    flags: "--ar 3:2 --style raw --s 140",
    chars: 286,
    date: "Feb 28 · 08:14",
    source: "upload-2849.jpg · 3024 × 4032",
    saved: true,
    board: "Editorial interiors",
  },
  {
    id: "po-08",
    title: "Studio, harsh side",
    italic: "Avedon, white seamless",
    image: IMG("photo-1503443207922-dff7d543fd0e"),
    palette: PALETTES.fashion_portrait,
    tags: ["portrait", "studio", "harsh", "graphic"],
    mood: "Confrontational · Graphic · Direct",
    lighting: "Single hard strobe · Raking side · No fill",
    composition: "Frontal · Tight · Eye-line",
    texture: "Sharp · No grain · Dust on lens",
    palette_descriptor: "Bone and ink with a deep rust shadow.",
    art_references: "Studio Portrait Photography · 1960s–1980s · Richard Avedon, Irving Penn, white-seamless graphic reductionism, strobe-lit confrontational directness",
    promptText:
      "A frontal Avedon-style portrait on white seamless, a single hard strobe raking from the side with no fill, throwing half the face into deep rust shadow. Tight crop, eye-line direct, no grain — clinical and graphic. Subject is still, expression resolved.",
    subjects: "",
    flags: "--ar 4:5 --style raw --s 280",
    chars: 274,
    date: "Feb 22 · 19:35",
    source: "linked-url.jpg · 3000 × 3750",
    saved: false,
    board: "Studio portraits",
  },
  {
    id: "ed-int-09",
    title: "Reading nook, brass lamp",
    italic: "Belgian house, evening",
    image: IMG("photo-1493663284031-b7e3aefcae8e"),
    palette: PALETTES.editorial_interior,
    tags: ["interior", "warm", "evening", "lamp"],
    mood: "Quiet · Inhabited · Slow",
    lighting: "Single brass lamp · Pool of warm · Falloff",
    composition: "Off-center chair · Foreground table · Eye-level",
    texture: "Wool throw · Aged leather · Hardwood",
    palette_descriptor: "Aged oak with warm cream, terracotta in the throw.",
    art_references: "Atmospheric Interior Photography · Contemporary · Dries Otten, Paulina Arcklin influence, Belgian/Flemish domestic warmth, available lamplight reportage",
    promptText:
      "A reading nook in a Belgian house at evening: a single brass lamp throws a warm pool of light over an aged leather chair off-centered in the frame. Walnut wood, warm cream walls, a terracotta wool throw. Foreground table catches the edge. Eye-level, restrained, inhabited.",
    subjects: "",
    flags: "--ar 4:5 --style raw --s 220",
    chars: 298,
    date: "Feb 16 · 22:10",
    source: "upload-2848.jpg · 3024 × 4032",
    saved: true,
    board: "Editorial interiors",
  },
];

export const BOARDS: Board[] = [
  { id: "all", name: "All analyses", count: LIBRARY.length },
  { id: "ed-int", name: "Editorial interiors", count: 3 },
  { id: "studio", name: "Studio portraits", count: 2 },
  { id: "film", name: "Film stills", count: 1 },
  { id: "arch", name: "Architecture", count: 1 },
  { id: "paint", name: "Painterly", count: 1 },
  { id: "land", name: "Landscape", count: 1 },
];
