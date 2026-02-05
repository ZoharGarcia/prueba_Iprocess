// src/app/components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: { children: React.ReactNode } & any) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="mi-tema-app"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}