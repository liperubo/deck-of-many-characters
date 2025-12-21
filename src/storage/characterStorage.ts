import { CharacterState, initialState } from "@/domain/character-state"

const STORAGE_KEY = "deck.characters"

export function loadCharacters(): CharacterState {
  if (typeof window === "undefined") return initialState
  
  const json = localStorage.getItem(STORAGE_KEY)
  
  if (!json) return initialState
  try {
    return JSON.parse(json) as CharacterState
  } catch {
    return initialState
  }
}

export function saveCharacters(state: CharacterState) {
  if (typeof window === "undefined") return

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
