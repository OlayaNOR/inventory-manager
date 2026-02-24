"use client"

import { DataProvider } from "@/components/data-provider"
import { AppShell } from "@/components/app-shell"
import { DashboardSection } from "@/components/sections/dashboard-section"

export default function HomePage() {
  return (
    <DataProvider>
      <AppShell>
        <DashboardSection />
      </AppShell>
    </DataProvider>
  )
}