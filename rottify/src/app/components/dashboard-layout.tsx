"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-pink-100 to-purple-200 dark:from-neutral-900 dark:via-pink-900 dark:to-purple-950 text-neutral-900 dark:text-neutral-100 p-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 animate-pulse">
              Brainrot Video Generator
            </h1>
            <ThemeToggle />
          </div>
          {children}
        </div>
      </div>
    </ThemeProvider>
  )
}

