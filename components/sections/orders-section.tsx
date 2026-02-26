"use client"

import { useState, useEffect } from "react"
import type { Order, Customer, Product } from "@/lib/types"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Trash2, Search, X, Eye } from "lucide-react"

import { ordersApi, customersApi, stockApi } from "@/lib/api"

export function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const [customerId, setCustomerId] = useState("")
  const [items, setItems] = useState<{ productId: string; quantity: string }[]>([
    { productId: "", quantity: "" },
  ])

  // 🔥 LOAD DATA
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)

      const [ordersData, customersData, productsData] = await Promise.all([
        ordersApi.getAll(),
        customersApi.getAll(),
        stockApi.getAll(),
      ])

      setOrders(ordersData)
      setCustomers(customersData)
      setProducts(productsData)
    } catch (error) {
      alert("Error loading data")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 CREATE ORDER
  async function addOrder(input: {
    customerId: number
    items: { productId: number; quantity: number }[]
  }) {
    try {
      const newOrder = await ordersApi.create(input)
      loadData()
    } catch (error) {
      alert(error)
    }
  }

  // 🔥 DELETE ORDER
  async function deleteOrder(id: number) {
    if (!confirm("Delete this order?")) return

    try {
      await ordersApi.delete(id)
      setOrders((prev) => prev.filter((o) => o.id !== id))
      loadData()
    }catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message)
      } else {
        alert("Unexpected error")
      }
    }
  }

  // 🔎 FILTER
  const filtered = orders.filter((o) => {
    const customerName = getCustomerName(o)
    const term = search.toLowerCase()
    return (
      o.id.toString().includes(term) ||
      customerName.toLowerCase().includes(term)
    )
  })

  function openCreate() {
    setCustomerId("")
    setItems([{ productId: "", quantity: "" }])
    setDialogOpen(true)
  }

  function addItemRow() {
    setItems([...items, { productId: "", quantity: "" }])
  }

  function removeItemRow(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  function updateItem(index: number, field: "productId" | "quantity", value: string) {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  function handleSave() {
    const cid = parseInt(customerId)
    if (isNaN(cid)) return

    const orderItems = items
      .filter((i) => i.productId && i.quantity)
      .map((i) => {
        return {
          productId: parseInt(i.productId),
          quantity: parseInt(i.quantity),
        }
      })

    if (orderItems.length === 0) return

    addOrder({
      customerId: cid,
      items: orderItems,
    })

    setDialogOpen(false)
  }

  // 🔧 HELPERS
  function getCustomerName(order: Order) {
    if ((order as any).customer?.name) return (order as any).customer.name as string
    const id = (order as any).customer?.id as number | undefined
    if (id != null) {
      const customer = customers.find((c) => c.id === id)
      if (customer) return customer.name
    }
    return "Customer"
  }

  function getOrderTotal(order: Order) {
    const anyOrder = order as any
    if (typeof anyOrder.totalAmount === "number") return anyOrder.totalAmount as number
    if (typeof anyOrder.total === "number") return anyOrder.total as number
    return 0
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage customer orders.
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="size-4" />
          New Order
        </Button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by ID or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* TABLE */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableCell>STATUS</TableCell>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{getCustomerName(order)}</TableCell>
                  <TableCell>
                    {order.items?.map((item, index) => (
                      <div key={index}>
                        {item.product.name} x{item.quantity}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{order.orderStatus ? "Completed" : "Pending"}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${getOrderTotal(order).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteOrder(order.id)}
                    >
                      <Trash2 className="size-5 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* CREATE DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Order</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Select
                  value={item.productId}
                  onValueChange={(v) => updateItem(index, "productId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name} (${p.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                />

                <Button onClick={() => removeItemRow(index)}>
                  <X />
                </Button>
              </div>
            ))}

            <Button onClick={addItemRow}>Add Item</Button>
          </div>

          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}