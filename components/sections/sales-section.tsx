"use client"

import { useState, useEffect } from "react"
import type { Sale, Order, Customer } from "@/lib/types"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Plus, Receipt, TrendingUp } from "lucide-react"

import { sellsApi, ordersApi, customersApi } from "@/lib/api"

export function SalesSection() {
  const [sales, setSales] = useState<Sale[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])

  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState("")

  // 🔥 LOAD DATA
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)

      const [salesData, ordersData, customersData] = await Promise.all([
        sellsApi.getAll(),
        ordersApi.getAll(),
        customersApi.getAll(),
      ])

      setSales(salesData)
      setOrders(ordersData)
      setCustomers(customersData)
    } catch (error) {
      console.error(error)
      alert("Error loading sales data")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 RECORD SALE
  async function recordSale(orderId: number) {
    try {
      const newSell = await sellsApi.recordSale(orderId)
      console.log(newSell)
      setSales((prev) => [...prev, newSell])
    } catch (error) {
      console.error(error)
      alert("Error recording sale")
    }
  }

  async function handleRecord() {
    const orderId = parseInt(selectedOrderId)
    if (isNaN(orderId)) return

    try {
      await recordSale(orderId)

      // 🔥 usar el mismo campo
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, orderStatus: true }
            : order
        )
      )

      setDialogOpen(false)
      setSelectedOrderId("")
    } catch (error) {
      alert("Error recording sale")
    }
  }

  // 🔥 DERIVED DATA
  const pendingOrders = orders.filter(o => !o.orderStatus)

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)

  function getCustomerName(orderId: number) {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return "Unknown"

    return (
      customers.find((c) => c.id === order.customer.id)?.name ||
      `Customer #${order.customer.id}`
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sales</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record and track completed sales from orders.
          </p>
        </div>

        <Button
          onClick={() => setDialogOpen(true)}
          size="sm"
          className="gap-1.5"
          disabled={pendingOrders.length === 0}
        >
          <Plus className="size-4" />
          Record Sale
        </Button>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Sales
            </CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{sales.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Revenue
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              ${totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {orders.filter(order => !order.orderStatus).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No sales recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sell) => (
                <TableRow key={sell.id}>
                  <TableCell>{sell.id}</TableCell>
                  <TableCell>Order # {sell.order.id}</TableCell>
                  <TableCell>{sell.order.customer.name}</TableCell>
                  <TableCell>
                    {new Date(sell.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${sell.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Completed</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record a Sale</DialogTitle>
            <DialogDescription>
              Select a pending order to mark as sold.
            </DialogDescription>
          </DialogHeader>

          <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
            <SelectTrigger>
              <SelectValue placeholder="Select order" />
            </SelectTrigger>

            <SelectContent>
              {pendingOrders.map((o) => (
                <SelectItem key={o.id} value={o.id.toString()}>
                  Order #{o.id} - {getCustomerName(o.id)} (
                  ${o.totalAmount.toFixed(2)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRecord} disabled={!selectedOrderId}>
              Record Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}