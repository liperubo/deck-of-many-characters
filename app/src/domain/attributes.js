export function clampAttribute(value, max = 5) {
  return Math.max(0, Math.min(value, max));
}