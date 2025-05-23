"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDarkMode = theme === "dark"

  return (
    <div className="relative flex items-center">
      <button
        aria-label="Toggle theme"
        className="relative h-8 w-16 rounded-full bg-muted p-1 shadow-inner transition-colors"
        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
      >
        <span className="sr-only">Toggle theme</span>

        {/* Track with icons */}
        <span className="flex h-full w-full items-center justify-between px-1">
          <Sun className="h-4 w-4 text-yellow-500" />
          <Moon className="h-4 w-4 text-blue-500" />
        </span>

        {/* Animated thumb */}
        <motion.span
          className="absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-sm"
          animate={{ x: isDarkMode ? "calc(100% - 1.5rem)" : "0%" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {isDarkMode ? (
            <Moon className="h-3.5 w-3.5 text-blue-500" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-yellow-500" />
          )}
        </motion.span>
      </button>
    </div>
  )
}