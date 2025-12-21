// src/domain/attributes.js
export function clampAttribute(value: number, max: number) {
  return Math.max(0, Math.min(value, max));
}

export function toggleAttribute(
  current: number,
  next: number,
  max: number
) {
  const value = current === next ? 0 : next;
  return clampAttribute(value, max);
}
