"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import CharacterCard from "@/components/CharacterCard";

const mockCharacters = [
  {
    id: "1",
    name: "Aria Shadowblade",
    avatar: "/elf-rogue-female.jpg",
    role: "Rogue / Assassin",
    level: 12,
    status: "active" as const,
  }];

export default function Home() {
  const [isNewCharacterOpen, setIsNewCharacterOpen] = useState(false)
  const [strength, setStrength] = useState(3);

  return (
    <div className="dark min-h-screen bg-background">
      <Sidebar />

      <div className="ml-64">
        <Header title="Characters" onNewClick={() => setIsNewCharacterOpen(true)} newButtonText="New Character" />

        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* <AttributeDots value={strength} onChange={setStrength} /> */}
            {mockCharacters.map((character) => (
              <CharacterCard key={character.id} {...character} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
