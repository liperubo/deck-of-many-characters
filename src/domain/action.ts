// src/domain/action.ts
import { CharacterState } from "./character-state";
import { SectionKey, StatSectionKey, TextSectionKey } from "./section";

export type Action =
  | { type: "SET_STAT"; section: StatSectionKey; key: string; value: number }
  | { type: "ADD_STAT"; section: StatSectionKey; key: string }
  | { type: "TOGGLE_SECTION"; section: SectionKey }
  | { type: "SET_FIELD"; field: "name" | "nature" | "demeanor"; value: string }
  | { type: "INIT"; payload: CharacterState }
  // | { type: "SET_TEXT"; section: TextSectionKey; key: string; value: string }
  // | { type: "ADD_TEXT"; section: TextSectionKey; key: string }
