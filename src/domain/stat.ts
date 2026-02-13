// src/domain/stat.ts
export type Stat = {
  value: number
  observation?: string | null
  minValue?: number
  maxValue?: number
  label?: string
  description?: string
}

export type Stats = Record<string, Stat>

export type AttributeCategory = "physical" | "social" | "mental"
export const attributeCategories = ["physical", "social", "mental"] as const

export type AbilityCategory = "talents" | "skills" | "knowledges"
export const abilityCategories = ["talents", "skills", "knowledges"] as const

export type FlatStatSection = "spheres" | "magetraits" | "backgrounds" | "merits" | "flaws"
