"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"
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

import { Plus, Pencil, Trash2, Search } from "lucide-react"

import { stockApi } from "@/lib/api"

export function StockSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantityInStock: "",
  })

  // 🔥 LOAD DATA
  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      setLoading(true)
      const data = await stockApi.getAll()
      const cleanData = data.filter(p => p && p.name)
      setProducts(cleanData)
    } catch (error) {
      console.error(error)
      alert("Error loading products")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 CRUD
  async function addProduct(product: Omit<Product, "id">) {
    try {
      console.log("SENDING:", product)
      const newProduct = await stockApi.create(product)
      console.log("NEW PRODUCT:", newProduct)
      setProducts((prev) => [...prev, newProduct])
    } catch (error) {
      alert(error)
    }
  }

  async function updateProduct(product: Product) {
    try {
      await stockApi.update(product)
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      )
    } catch (error) {
      console.error(error)
      alert("Error updating product")
    }
  }

  async function deleteProduct(id: number) {
    try {
      await stockApi.delete(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      alert("Error deleting product")
    }
  }

  // 🔥 UI LOGIC
  const filtered = products.filter((p) =>
    p?.name?.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditing(null)
    setForm({ name: "", price: "", quantityInStock: "" })
    setDialogOpen(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setForm({
      name: product.name,
      price: product.price.toString(),
      quantityInStock: product.quantityInStock.toString(),
    })
    setDialogOpen(true)
  }

  function handleSave() {
    const price = parseFloat(form.price)
    const qty = parseInt(form.quantityInStock)

    if (!form.name || isNaN(price) || isNaN(qty)) return

    if (editing) {
      updateProduct({
        ...editing,
        name: form.name,
        price,
        quantityInStock: qty,
      })
    } else {
      addProduct({
        name: form.name,
        price,
        quantityInStock: qty,
      })
    }

    setDialogOpen(false)
  }

  function getStockBadge(qty: number) {
    if (qty === 0) return <Badge variant="destructive">Out of stock</Badge>
    if (qty <= 10)
      return (
        <Badge variant="outline" className="border-destructive/50 text-destructive">
          Low
        </Badge>
      )
    return <Badge variant="secondary">In stock</Badge>
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Stock & Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product inventory and stock levels.
          </p>
        </div>

        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
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
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
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
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-right">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.quantityInStock}
                  </TableCell>
                  <TableCell>
                    {getStockBadge(product.quantityInStock)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(product)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
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
            <DialogTitle>
              {editing ? "Edit Product" : "New Product"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the product details below."
                : "Fill in the details to add a new product."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={form.quantityInStock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantityInStock: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>
              {editing ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}