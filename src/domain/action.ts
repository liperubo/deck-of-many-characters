import { CharacterState, LoreEntry } from "./character-state"
import { SectionKey, StatSectionKey } from "./section"
import { AbilityCategory, AttributeCategory, Stat } from "./stat"

export type Action =
  | { type: "INIT"; payload: CharacterState }
  | { type: "ADD_STAT"; section: StatSectionKey; key: string; stat?: Stat }
  | {
      type: "DELETE_STAT"
      section: "abilities" | "backgrounds" | "merits" | "flaws"
      category?: AbilityCategory | null
      key: string
    }
  | {
      type: "SET_FIELD"
      field: "name" | "chronicle" | "concept" | "nature" | "demeanor"
      value: string
    }
  | {
      type: "SET_STAT"
      section: "attributes" | "abilities" | "spheres" | "magetraits" | "backgrounds" | "merits" | "flaws"
      category?: AbilityCategory | AttributeCategory | null
      key: string
      value: number
    }
  | { type: "ADD_LORE"; entry: LoreEntry }
  | { type: "UPDATE_LORE"; id: string; content: string }
  | { type: "DELETE_LORE"; id: string }
  | { type: "SET_TAGS"; tags: string[] }
  | { type: "TOGGLE_SECTION"; section: SectionKey }
