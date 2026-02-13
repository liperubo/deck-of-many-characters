import { CharacterState, cloneBaseCharacter } from "./character-state"

export type CharacterSheet = {
  id: string
  createdAt: string
  updatedAt: string
  data: CharacterState
}

export function createCharacterSheet(): CharacterSheet {
  const now = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    data: cloneBaseCharacter(),
  }
}
