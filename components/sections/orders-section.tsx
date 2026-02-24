"use client"

import { useState, useEffect } from "react"
import type { Order, OrderItem, Customer, Product, Sell } from "@/lib/types"
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
import { Plus, Trash2, Search, Eye, X } from "lucide-react"

import { ordersApi, customersApi, stockApi, sellsApi } from "@/lib/api"

export function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [sells, setSells] = useState<Sell[]>([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailOrderId, setDetailOrderId] = useState<number | null>(null)

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

      const [ordersData, customersData, productsData, sellsData] =
        await Promise.all([
          ordersApi.getAll(),
          customersApi.getAll(),
          stockApi.getAll(),
          sellsApi.getAll(),
        ])

      setOrders(ordersData)
      setCustomers(customersData)
      setProducts(productsData)
      setSells(sellsData)
    } catch (error) {
      console.error(error)
      alert("Error loading data")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 CREATE ORDER
  async function addOrder(order: Omit<Order, "id" | "total">) {
    try {
      const newOrder = await ordersApi.create(order)
      setOrders((prev) => [...prev, newOrder])
    } catch (error) {
      console.error(error)
      alert("Error creating order")
    }
  }

  // 🔥 DELETE ORDER
  async function deleteOrder(id: number) {
    if (!confirm("Delete this order?")) return

    try {
      await ordersApi.delete(id)
      setOrders((prev) => prev.filter((o) => o.id !== id))
    } catch (error) {
      console.error(error)
      alert("Error deleting order")
    }
  }

  // 🔎 FILTER
  const filtered = orders.filter((o) => {
    const customer = customers.find((c) => c.id === o.customerId)
    const term = search.toLowerCase()
    return (
      o.id.toString().includes(term) ||
      (customer && customer.name.toLowerCase().includes(term))
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

    const orderItems: OrderItem[] = items
      .filter((i) => i.productId && i.quantity)
      .map((i) => {
        const product = products.find((p) => p.id === parseInt(i.productId))
        return {
          productId: parseInt(i.productId),
          quantity: parseInt(i.quantity),
          unitPrice: product?.price || 0,
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
  function getCustomerName(id: number) {
    return customers.find((c) => c.id === id)?.name || `Customer #${id}`
  }

  function getProductName(id: number) {
    return products.find((p) => p.id === id)?.name || `Product #${id}`
  }

  function isSold(orderId: number) {
    return sells.some((s) => s.orderId === orderId)
  }

  const detailOrder = detailOrderId
    ? orders.find((o) => o.id === detailOrderId)
    : null

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
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
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
                  <TableCell>{getCustomerName(order.customerId)}</TableCell>
                  <TableCell className="text-right">{order.items.length}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {isSold(order.id) ? (
                      <Badge variant="secondary">Completed</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDetailOrderId(order.id)
                        setDetailOpen(true)
                      }}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteOrder(order.id)}
                    >
                      <Trash2 className="size-4 text-red-500" />
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