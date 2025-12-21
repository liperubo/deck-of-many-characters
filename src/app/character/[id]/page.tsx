//src/app/character/[id]/page.tsx
"use client"

import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Edit, Save } from "lucide-react"
import { useReducer, useState } from "react"
import { characterReducer } from "@/domain/character-reducer"
import { initialState } from "@/domain/character-state"
import Dots from "@/components/Dots"
import { AttributeCategory, attributeCategories } from "@/domain/stat"

export default function CharacterDetailPage() {

  const [state, dispatch] = useReducer(characterReducer, initialState)
  const [isEditing, setIsEditing] = useState(false)

  // Mock data
  const character = {
    name: "Aria Shadowblade",
    avatar: "/elf-rogue-female.jpg",
    role: "Rogue / Assassin",
    level: 12,
    status: "active",
    race: "Elf",
    background: "Criminal",
    alignment: "Chaotic Neutral",
  }

  const attributes = [
    { name: "Strength", value: 10, modifier: "+0" },
    { name: "Dexterity", value: 18, modifier: "+4" },
    { name: "Constitution", value: 14, modifier: "+2" },
    { name: "Intelligence", value: 13, modifier: "+1" },
    { name: "Wisdom", value: 12, modifier: "+1" },
    { name: "Charisma", value: 16, modifier: "+3" },
  ]

  const skills = [
    { name: "Stealth", proficient: true, value: "+8" },
    { name: "Sleight of Hand", proficient: true, value: "+8" },
    { name: "Acrobatics", proficient: true, value: "+8" },
    { name: "Deception", proficient: true, value: "+7" },
    { name: "Insight", proficient: false, value: "+1" },
    { name: "Investigation", proficient: true, value: "+5" },
  ]

  return (
    <div className="dark min-h-screen bg-background">
      <Sidebar />

      <div className="ml-64">
        <Header title="Character Details" />

        <main className="p-8">
          <Card className="gap-6 p-0">
            <Card className="lg:col-span-3 space-y-6" id="character-header">
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 border-4 border-primary/20">
                    <AvatarImage src={character.avatar || "/placeholder.svg"} alt={character.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                      {character.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>


                  <h1 className="mt-4 text-2xl font-bold text-foreground">{character.name}</h1>
                  <p className="text-muted-foreground">{character.role}</p>

                  <div className="mt-4 flex gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      Lvl {character.level}
                    </Badge>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                      {character.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Race</span>
                    <span className="text-sm font-medium text-foreground">{character.race}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Background</span>
                    <span className="text-sm font-medium text-foreground">{character.background}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Alignment</span>
                    <span className="text-sm font-medium text-foreground">{character.alignment}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full"
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Character
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>


            <div className="lg:col-span-2 space-y-6">
              <Collapsible defaultOpen>
                <Card>
                  <CardHeader>
                    <CollapsibleTrigger className="flex w-full items-center justify-between hover:opacity-80">
                      <CardTitle>Attributes</CardTitle>
                      <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {attributeCategories.map((category) => (
                          <Card key={category} className="bg-secondary/50">
                            <CardContent className="p-4">
                              <h3 className="mb-4 text-center font-semibold capitalize">
                                {category}
                              </h3>

                              <div className="space-y-3">
                                {Object.entries(state.attributes[category]).map(
                                  ([statKey, stat]) => (
                                    <div
                                      key={statKey}
                                      className="flex items-center justify-between"
                                    >
                                      <Label className="capitalize">
                                        {statKey.replace(/_/g, " ")}
                                      </Label>

                                      <Dots
                                        value={stat.value}
                                        onChange={(v) =>
                                          dispatch({
                                            type: "SET_STAT",
                                            section: "attributes",
                                            category,
                                            key: statKey,
                                            value: v,
                                          })
                                        }
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              <Collapsible defaultOpen>
                <Card>
                  <CardHeader>
                    <CollapsibleTrigger className="flex w-full items-center justify-between hover:opacity-80">
                      <CardTitle>Skills</CardTitle>
                      <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="space-y-2">
                        {skills.map((skill) => (
                          <div
                            key={skill.name}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-2 w-2 rounded-full ${skill.proficient ? "bg-primary" : "bg-muted"}`} />
                              <span className="text-sm font-medium text-foreground">{skill.name}</span>
                            </div>
                            <Badge variant="outline" className="font-mono">
                              {skill.value}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              <Collapsible defaultOpen>
                <Card>
                  <CardHeader>
                    <CollapsibleTrigger className="flex w-full items-center justify-between hover:opacity-80">
                      <CardTitle>Notes & Background</CardTitle>
                      <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="backstory">Backstory</Label>
                        <Textarea
                          id="backstory"
                          placeholder="Write your character's backstory..."
                          className="mt-2 min-h-[120px] resize-none bg-secondary/30"
                          defaultValue="Aria grew up in the shadows of the great cities, learning to survive by her wits and nimble fingers..."
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Session Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Add notes from your sessions..."
                          className="mt-2 min-h-[120px] resize-none bg-secondary/30"
                          readOnly={!isEditing}
                        />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
