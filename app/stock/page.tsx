"use client"

import { AppShell } from "@/components/app-shell"
import { StockSection } from "@/components/sections/stock-section"


export default function StockPage() {
  return (
    <AppShell>
      <StockSection />
    </AppShell>
  )
}