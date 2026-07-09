import type { BackdropData } from "../services/giftAssets";

/** Fallback until API backdrops load */
export const FALLBACK_BACKDROPS: BackdropData[] = [
  { name: "Black", backdropId: 0, hex: { centerColor: "#363738", edgeColor: "#0e0f0f", patternColor: "#6c6868", textColor: "#8c8f91" } },
  { name: "Aquamarine", backdropId: 3, hex: { centerColor: "#4ecdc4", edgeColor: "#2a9d8f", patternColor: "#1a6b62", textColor: "#a8fff5" } },
  { name: "Burnt Sienna", backdropId: 4, hex: { centerColor: "#e07a5f", edgeColor: "#c44536", patternColor: "#8b2e20", textColor: "#ffd4cc" } },
  { name: "Caramel", backdropId: 6, hex: { centerColor: "#d4a574", edgeColor: "#a67c52", patternColor: "#6b4f35", textColor: "#ffe8cc" } },
  { name: "Celtic Blue", backdropId: 8, hex: { centerColor: "#3a86ff", edgeColor: "#2667cc", patternColor: "#1a4499", textColor: "#cce0ff" } },
  { name: "Chocolate", backdropId: 9, hex: { centerColor: "#7b4f35", edgeColor: "#5c3a28", patternColor: "#3d261a", textColor: "#e8c4a8" } }
];
