"use client"

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes"


export default function Page() {

  const { setTheme } = useTheme();

  return (
    <main className="h-screen dark:bg-background w-full flex items-center justify-center">
      <h1>Welcome</h1>
      <p onClick={() => setTheme("light")}>
        Light
      </p>
      <p onClick={() => setTheme("dark")}>
        Dark
      </p>
      <p onClick={() => setTheme("system")}>
        System
      </p>
      <Button>
        Hi
      </Button>
    </main>
  )
}