import { Stat } from "./stats"

export type AttributeKey =
  | "strength"
  | "dexterity"
  | "stamina"
  | "charisma"
  | "manipulation"
  | "appearance"
  | "perception"
  | "intelligence"
  | "wits"

export type Attributes = Record<AttributeKey, Stat>