"use client"

import { cn } from "@/lib/utils"
import { Package, Users, ShoppingCart, Receipt, LayoutDashboard } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter, usePathname } from "next/navigation"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { id: "stock", label: "Stock", icon: Package, path: "/stock" },
  { id: "customers", label: "Customers", icon: Users, path: "/customers" },
  { id: "orders", label: "Orders", icon: ShoppingCart, path: "/orders" },
  { id: "sales", label: "Sales", icon: Receipt, path: "/sales" },
] as const

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-6">
            <span className="text-base font-semibold tracking-tight text-foreground">
              Inventory
            </span>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.path)

                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.path)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <ThemeToggle />
        </div>

        {/* Mobile nav */}
        <div className="flex items-center gap-1 overflow-x-auto border-t px-4 py-1.5 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path)

            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                {item.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-6 lg:py-8">
        {children}
      </main>
    </div>
  )
}