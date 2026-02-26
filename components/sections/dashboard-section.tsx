"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, ShoppingCart, Receipt, TrendingUp, AlertTriangle } from "lucide-react"
import { productsApi, customersApi, ordersApi, sellsApi } from "@/lib/api"
import type { Order, Sell } from "@/lib/types"

export function DashboardSection() {
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState<Order[]>([])
  const [sales, setSales] = useState<Sell[]>([])

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    try {
      const [p, c, o, s] = await Promise.all([
        productsApi.getAll(),
        customersApi.getAll(),
        ordersApi.getAll(),
        sellsApi.getAll(),
      ])

      setProducts(p)
      setCustomers(c)
      setOrders(o)
      setSales(s)
    } catch (err) {
      console.error("Error loading dashboard data", err)
    }
  }

  // cálculos
  const totalRevenue = sales.reduce((sum: number, s) => sum + s.total, 0)

  const lowStock = products.filter((p: any) => p.quantityInStock <= 10)

  const safeOrders = Array.isArray(orders) ? orders : []
  const safeSales = Array.isArray(sales) ? sales : []

  const pendingOrders = safeOrders.filter(
    (o) => !safeSales.some((s) => s.orderId === o.id)
  )

  const stats = [
    {
      label: "Products",
      value: products.length,
      icon: Package,
      description: `${lowStock.length} low stock`,
    },
    {
      label: "Customers",
      value: customers.length,
      icon: Users,
      description: "Total registered",
    },
    {
      label: "Orders",
      value: orders.length,
      icon: ShoppingCart,
      description: `${pendingOrders.length} total`,
    },
    {
      label: "Sales",
      value: sales.length,
      icon: Receipt,
      description: "Completed",
    },
    {
      label: "Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      description: "Total earned",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your business at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stat.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Low stock */}
      {lowStock.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-3">
            <AlertTriangle className="size-4 text-destructive" />
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {lowStock.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {p.quantityInStock} left
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent sales */}
      {sales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sales
                .slice(-5)
                .reverse()
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">Order #{s.orderId}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(s.date).toLocaleDateString("en-US")}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      ${s.total.toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}