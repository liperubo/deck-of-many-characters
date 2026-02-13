import { CharacterSheet, createCharacterSheet } from "@/domain/character-sheet"

const STORAGE_KEY = "deck.character-sheets.v2"

function isCharacterSheetArray(value: unknown): value is CharacterSheet[] {
  return Array.isArray(value)
}

export function loadCharacterSheets(): CharacterSheet[] {
  if (typeof window === "undefined") return [createCharacterSheet()]

  const json = localStorage.getItem(STORAGE_KEY)
  if (!json) return [createCharacterSheet()]

  try {
    const parsed = JSON.parse(json) as unknown
    return isCharacterSheetArray(parsed) && parsed.length > 0 ? parsed : [createCharacterSheet()]
  } catch {
    return [createCharacterSheet()]
  }
}

export function saveCharacterSheets(sheets: CharacterSheet[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sheets))
}

export function exportCharacterSheets(sheets: CharacterSheet[]) {
  const blob = new Blob([JSON.stringify(sheets, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = "deck-of-many-characters.json"
  anchor.click()
  URL.revokeObjectURL(url)
}

export function importCharacterSheets(file: File): Promise<CharacterSheet[]> {
  return file.text().then((text) => {
    const parsed = JSON.parse(text) as unknown
    if (!isCharacterSheetArray(parsed)) {
      throw new Error("Invalid JSON file format")
    }

    if (parsed.length === 0) {
      throw new Error("JSON file has no character sheets")
    }

    return parsed
  })
}
