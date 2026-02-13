"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useReducer } from "react"
import { ArrowLeft } from "lucide-react"
import { characterReducer } from "@/domain/character-reducer"
import { cloneBaseCharacter } from "@/domain/character-state"
import { abilityCategories, attributeCategories } from "@/domain/stat"
import Dots from "@/components/Dots"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { loadCharacterSheets, saveCharacterSheets } from "@/storage/characterStorage"

export default function CharacterDetailPage() {
  const params = useParams<{ id: string }>()
  const characterId = params.id
  const sheets = useMemo(() => loadCharacterSheets(), [])
  const selected = sheets.find((sheet) => sheet.id === characterId)

  const [state, dispatch] = useReducer(characterReducer, selected?.data ?? cloneBaseCharacter())

  useEffect(() => {
    const updated = loadCharacterSheets().map((sheet) =>
      sheet.id === characterId
        ? {
            ...sheet,
            updatedAt: new Date().toISOString(),
            data: state,
          }
        : sheet,
    )
    saveCharacterSheets(updated)
  }, [characterId, state])

  return (
    <main className="min-h-screen bg-background px-6 py-8 md:px-12">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-foreground">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">As mudanças são salvas automaticamente no localStorage.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Identidade da Ficha</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Nome</Label>
              <Input value={state.name} onChange={(e) => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })} />
            </div>
            <div>
              <Label>Conceito</Label>
              <Input value={state.concept} onChange={(e) => dispatch({ type: "SET_FIELD", field: "concept", value: e.target.value })} />
            </div>
            <div>
              <Label>Natureza</Label>
              <Input value={state.nature} onChange={(e) => dispatch({ type: "SET_FIELD", field: "nature", value: e.target.value })} />
            </div>
            <div>
              <Label>Comportamento</Label>
              <Input value={state.demeanor} onChange={(e) => dispatch({ type: "SET_FIELD", field: "demeanor", value: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Crônica</Label>
              <Input value={state.chronicle} onChange={(e) => dispatch({ type: "SET_FIELD", field: "chronicle", value: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Atributos</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {attributeCategories.map((category) => (
              <Card key={category} className="bg-secondary/40">
                <CardHeader><CardTitle className="text-base capitalize">{category}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(state.attributes[category]).map(([key, stat]) => (
                    <div key={key} className="flex items-center justify-between gap-2 text-sm">
                      <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
                      <Dots
                        value={stat.value}
                        onChange={(value) => dispatch({ type: "SET_STAT", section: "attributes", category, key, value })}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Habilidades</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {abilityCategories.map((category) => (
              <Card key={category} className="bg-secondary/40">
                <CardHeader><CardTitle className="text-base capitalize">{category}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(state.abilities[category]).map(([key, stat]) => (
                    <div key={key} className="flex items-center justify-between gap-2 text-sm">
                      <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
                      <Dots
                        value={stat.value}
                        onChange={(value) => dispatch({ type: "SET_STAT", section: "abilities", category, key, value })}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Anotações</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              className="min-h-40"
              value={state.notes}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "notes", value: e.target.value })}
              placeholder="Histórico, objetivos, observações da campanha..."
            />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
