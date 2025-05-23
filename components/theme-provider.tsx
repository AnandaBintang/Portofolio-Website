"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Add a class to the body when the component mounts
  React.useEffect(() => {
    setMounted(true)
    document.body.classList.add("theme-transition")

    // Clean up function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove("theme-transition")
    }
  }, [])

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}