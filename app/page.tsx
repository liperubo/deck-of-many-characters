"use client";

import { useState } from "react";
import AttributeDots from "./src/components/AttributeDots/AttributeDots";

export default function Home() {
  const [value, setValue] = useState(2);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <AttributeDots value={value} maxDots={5} onChange={(value: any) => setValue(value)} />
      </main>
    </div>
  );
}
