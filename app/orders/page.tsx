"use client"

import { AppShell } from "@/components/app-shell"
import { OrdersSection } from "@/components/sections/orders-section"

export default function OrdersPage() {
  return (
    <AppShell>
      <OrdersSection />
    </AppShell>
  )
}