// WCAG 2.x contrast, computed at build time so the ratios shown are never typed by hand.

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Text needs 4.5:1 (AA) or 7:1 (AAA). Control edges and focus rings need 3:1.
export function grade(ratio: number, kind: "text" | "ui" = "text") {
  if (kind === "ui") return ratio >= 3 ? "Pass" : "Fail";
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "Large text only";
  return "Fail";
}
