"use client"

import { AppShell } from "@/components/app-shell"
import { DashboardSection } from "@/components/sections/dashboard-section"

export default function HomePage() {
  return (
    <AppShell>
      <DashboardSection />
    </AppShell>
  )
}