export type StyleKey = "ascii" | "jp" | "med" | "cyber";

export const STYLE_ORDER: StyleKey[] = ["ascii", "jp", "med", "cyber"];

export const STYLE_META: Record<StyleKey, { label: string; glyph: string; code: string }> = {
  ascii: { label: "ASCII", glyph: "#", code: "TX-00" },
  jp: { label: "和 / INK", glyph: "創", code: "JP-01" },
  med: { label: "CODEX", glyph: "✠", code: "MD-02" },
  cyber: { label: "CYBER", glyph: "◇", code: "CY-03" },
};

/** Glyph ramps ordered from empty to dense; all are exactly 16 long. */
export const GLYPHS: Record<StyleKey, string[]> = {
  ascii: [" ", ".", "'", ":", "-", "~", "=", "+", "*", "x", "o", "#", "%", "@", "&", "█"],
  jp: [" ", "・", "ノ", "一", "二", "三", "ヨ", "木", "水", "火", "日", "月", "田", "回", "雨", "龍"],
  med: [" ", ".", ":", "i", "l", "r", "t", "c", "s", "x", "a", "e", "o", "m", "w", "✠"],
  cyber: [" ", "·", ":", "-", "=", "+", "0", "1", "7", "A", "B", "C", "D", "E", "F", "█"],
};

/** Font CSS variable used to draw each style's glyph atlas. */
export const GLYPH_FONT_VAR: Record<StyleKey, string> = {
  ascii: "--nf-mono",
  jp: "--nf-jp",
  med: "--nf-fraktur",
  cyber: "--nf-mono",
};

/** Colours per style, mirrored in globals.css for the DOM. */
export const STYLE_COLORS: Record<StyleKey, { bg: string; fg: string; accent: string }> = {
  ascii: { bg: "#050505", fg: "#e9e6df", accent: "#007070" },
  jp: { bg: "#e6e1d6", fg: "#0c0b0a", accent: "#c1272d" },
  med: { bg: "#0b0908", fg: "#e3dccb", accent: "#c1272d" },
  cyber: { bg: "#04060b", fg: "#e9e6df", accent: "#007070" },
};

export function routeStyle(pathname: string): StyleKey {
  if (pathname.startsWith("/archive")) return "med";
  if (pathname.startsWith("/systems") || pathname.startsWith("/unit")) return "cyber";
  if (pathname.startsWith("/origin")) return "jp";
  return "ascii";
}
