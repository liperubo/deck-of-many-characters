// src/domain/section.ts
export type StatSectionKey =
  | "attributes"
  | "abilities"
  | "spheres"
  | "magetraits"
  | "backgrounds"
  | "merits"
  | "flaws"

export type TextSectionKey =
  | "tags"
  | "lore"

export type SectionKey = StatSectionKey | TextSectionKey

export type ActiveSections = SectionKey[]