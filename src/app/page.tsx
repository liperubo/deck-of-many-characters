"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Plus, Upload, Download } from "lucide-react"
import ThemeSwitch from "@/components/ThemeSwitch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CharacterSheet, createCharacterSheet } from "@/domain/character-sheet"
import {
  exportCharacterSheets,
  importCharacterSheets,
  loadCharacterSheets,
  saveCharacterSheets,
} from "@/storage/characterStorage"

export default function Home() {
  const [sheets, setSheets] = useState<CharacterSheet[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSheets(loadCharacterSheets())
  }, [])

  useEffect(() => {
    if (sheets.length > 0) {
      saveCharacterSheets(sheets)
    }
  }, [sheets])

  const handleCreate = () => {
    const created = createCharacterSheet()
    setSheets((prev) => [created, ...prev])
  }

  const handleImport = async (file: File | null) => {
    if (!file) return
    try {
      const imported = await importCharacterSheets(file)
      setSheets(imported)
      setError(null)
    } catch (importError) {
      const message = importError instanceof Error ? importError.message : "Invalid import file"
      setError(message)
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground md:px-12">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Deck of Many Characters</h1>
            <p className="text-muted-foreground">Forje heróis memoráveis, organize suas histórias e leve suas fichas para qualquer mesa.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeSwitch />
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova ficha
            </Button>
            <Button variant="outline" onClick={() => exportCharacterSheets(sheets)} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar JSON
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
              <Upload className="h-4 w-4" />
              Importar JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => handleImport(event.target.files?.[0] ?? null)}
            />
          </div>
        </header>

        {error && <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sheets.map((sheet) => (
            <Link key={sheet.id} href={`/character/${sheet.id}`}>
              <Card className="h-full transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{sheet.data.name || "Sem nome"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Conceito:</strong> {sheet.data.concept || "—"}</p>
                  <p><strong>Natureza:</strong> {sheet.data.nature || "—"}</p>
                  <p><strong>Última edição:</strong> {new Date(sheet.updatedAt).toLocaleString()}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </section>
    </main>
  )
}
