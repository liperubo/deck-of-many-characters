// src/domain/action.ts
import { CharacterState } from "./character-state";
import { SectionKey, StatSectionKey, TextSectionKey } from "./section";
import { AbilityCategory, AttributeCategory } from "./stat";

export type Action =
  | { type: "INIT"; payload: CharacterState }
  | { type: "ADD_STAT"; section: StatSectionKey; key: string }
  | { type: "SET_FIELD"; field: "name" | "nature" | "demeanor"; value: string }
  | {
      type: "SET_STAT"
      section:
        | "attributes"
        | "abilities"
        | "spheres"
        | "magetraits"
        | "backgrounds"
        | "merits"
        | "flaws"
      category?: string
      key: string
      value: number
    }
  | { type: "TOGGLE_SECTION"; section: SectionKey }
// | { type: "SET_TEXT"; section: TextSectionKey; key: string; value: string }
// | { type: "ADD_TEXT"; section: TextSectionKey; key: string }