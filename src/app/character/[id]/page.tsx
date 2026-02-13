"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useReducer, useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import { characterReducer } from "@/domain/character-reducer"
import { cloneBaseCharacter } from "@/domain/character-state"
import { abilityCategories, attributeCategories, FlatStatSection } from "@/domain/stat"
import Dots from "@/components/Dots"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { loadCharacterSheets, saveCharacterSheets } from "@/storage/characterStorage"
import { SectionKey } from "@/domain/section"
import ThemeSwitch from "@/components/ThemeSwitch"

const optionalSections: { key: SectionKey; label: string }[] = [
  { key: "spheres", label: "Spheres" },
  { key: "magetraits", label: "Mage Traits" },
  { key: "backgrounds", label: "Backgrounds" },
  { key: "merits", label: "Merits" },
  { key: "flaws", label: "Flaws" },
  { key: "tags", label: "Tags" },
]

function FlatSectionEditor({
  title,
  section,
  data,
  onAdd,
  onUpdate,
}: {
  title: string
  section: FlatStatSection
  data: Record<string, { value: number }>
  onAdd: (section: FlatStatSection, key: string) => void
  onUpdate: (section: FlatStatSection, key: string, value: number) => void
}) {
  const [draft, setDraft] = useState("")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Adicionar item em ${title}`}
          />
          <Button
            size="sm"
            onClick={() => {
              const normalized = draft.trim().toLowerCase().replace(/\s+/g, "_")
              if (!normalized || data[normalized]) return
              onAdd(section, normalized)
              setDraft("")
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

        {Object.keys(data).length === 0 && <p className="text-sm text-muted-foreground">Sem itens nesta seção.</p>}

        <div className="space-y-3">
          {Object.entries(data).map(([key, stat]) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <span className="capitalize">{key.replace(/_/g, " ")}</span>
              <Dots value={stat.value} onChange={(value) => onUpdate(section, key, value)} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function CharacterDetailPage() {
  const params = useParams<{ id: string }>()
  const characterId = params.id
  const sheets = useMemo(() => loadCharacterSheets(), [])
  const selected = sheets.find((sheet) => sheet.id === characterId)
  const [tagDraft, setTagDraft] = useState("")

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
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">Mudanças salvas automaticamente.</p>
            <ThemeSwitch />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seções visíveis da ficha</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {[
              { key: "attributes", label: "Attributes" },
              { key: "abilities", label: "Abilities" },
              ...optionalSections,
            ].map((section) => {
              const active = state.activeSections.includes(section.key as SectionKey)
              return (
                <Button
                  key={section.key}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => dispatch({ type: "TOGGLE_SECTION", section: section.key as SectionKey })}
                >
                  {section.label}
                </Button>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Identidade da Ficha</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div><Label>Nome</Label><Input value={state.name} onChange={(e) => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })} /></div>
            <div><Label>Conceito</Label><Input value={state.concept} onChange={(e) => dispatch({ type: "SET_FIELD", field: "concept", value: e.target.value })} /></div>
            <div><Label>Natureza</Label><Input value={state.nature} onChange={(e) => dispatch({ type: "SET_FIELD", field: "nature", value: e.target.value })} /></div>
            <div><Label>Comportamento</Label><Input value={state.demeanor} onChange={(e) => dispatch({ type: "SET_FIELD", field: "demeanor", value: e.target.value })} /></div>
            <div className="md:col-span-2"><Label>Crônica</Label><Input value={state.chronicle} onChange={(e) => dispatch({ type: "SET_FIELD", field: "chronicle", value: e.target.value })} /></div>
          </CardContent>
        </Card>

        {state.activeSections.includes("attributes") && (
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
                        <Dots value={stat.value} onChange={(value) => dispatch({ type: "SET_STAT", section: "attributes", category, key, value })} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {state.activeSections.includes("abilities") && (
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
                        <Dots value={stat.value} onChange={(value) => dispatch({ type: "SET_STAT", section: "abilities", category, key, value })} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {state.activeSections.includes("spheres") && (
          <FlatSectionEditor title="Spheres" section="spheres" data={state.spheres} onAdd={(section, key) => dispatch({ type: "ADD_STAT", section, key })} onUpdate={(section, key, value) => dispatch({ type: "SET_STAT", section, key, value })} />
        )}
        {state.activeSections.includes("magetraits") && (
          <FlatSectionEditor title="Mage Traits" section="magetraits" data={state.magetraits} onAdd={(section, key) => dispatch({ type: "ADD_STAT", section, key })} onUpdate={(section, key, value) => dispatch({ type: "SET_STAT", section, key, value })} />
        )}
        {state.activeSections.includes("backgrounds") && (
          <FlatSectionEditor title="Backgrounds" section="backgrounds" data={state.backgrounds} onAdd={(section, key) => dispatch({ type: "ADD_STAT", section, key })} onUpdate={(section, key, value) => dispatch({ type: "SET_STAT", section, key, value })} />
        )}
        {state.activeSections.includes("merits") && (
          <FlatSectionEditor title="Merits" section="merits" data={state.merits} onAdd={(section, key) => dispatch({ type: "ADD_STAT", section, key })} onUpdate={(section, key, value) => dispatch({ type: "SET_STAT", section, key, value })} />
        )}
        {state.activeSections.includes("flaws") && (
          <FlatSectionEditor title="Flaws" section="flaws" data={state.flaws} onAdd={(section, key) => dispatch({ type: "ADD_STAT", section, key })} onUpdate={(section, key, value) => dispatch({ type: "SET_STAT", section, key, value })} />
        )}

        {state.activeSections.includes("tags") && (
          <Card>
            <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={tagDraft} onChange={(e) => setTagDraft(e.target.value)} placeholder="Adicionar tag" />
                <Button
                  onClick={() => {
                    const normalized = tagDraft.trim()
                    if (!normalized) return
                    if (state.tags.some((tag) => tag.toLowerCase() === normalized.toLowerCase())) return
                    dispatch({ type: "SET_TAGS", tags: [...state.tags, normalized] })
                    setTagDraft("")
                  }}
                >
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {state.tags.map((tag) => (
                  <Badge key={tag} className="cursor-pointer" onClick={() => dispatch({ type: "SET_TAGS", tags: state.tags.filter((item) => item !== tag) })}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle>Anotações</CardTitle></CardHeader>
          <CardContent>
            <Textarea className="min-h-40" value={state.notes} onChange={(e) => dispatch({ type: "SET_FIELD", field: "notes", value: e.target.value })} placeholder="Histórico, objetivos, observações da campanha..." />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
