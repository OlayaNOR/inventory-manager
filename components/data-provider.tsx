"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Product, Customer, Order, Sell } from "@/lib/types"
import { mockProducts, mockCustomers, mockOrders, mockSells } from "@/lib/mock-data"

interface DataContextType {
  products: Product[]
  customers: Customer[]
  orders: Order[]
  sells: Sell[]
  addProduct: (p: Omit<Product, "id">) => void
  updateProduct: (p: Product) => void
  deleteProduct: (id: number) => void
  addCustomer: (c: Omit<Customer, "id">) => void
  updateCustomer: (c: Customer) => void
  deleteCustomer: (id: number) => void
  addOrder: (o: Omit<Order, "id" | "total">) => void
  updateOrder: (o: Order) => void
  deleteOrder: (id: number) => void
  recordSale: (orderId: number) => Sell | null
}

const DataContext = createContext<DataContextType | null>(null)

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within DataProvider")
  return ctx
}

let nextProductId = mockProducts.length + 1
let nextCustomerId = mockCustomers.length + 1
let nextOrderId = mockOrders.length + 1
let nextSellId = mockSells.length + 1

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [sells, setSells] = useState<Sell[]>(mockSells)

  const addProduct = useCallback((p: Omit<Product, "id">) => {
    setProducts((prev) => [...prev, { ...p, id: nextProductId++ }])
  }, [])

  const updateProduct = useCallback((p: Product) => {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)))
  }, [])

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const addCustomer = useCallback((c: Omit<Customer, "id">) => {
    setCustomers((prev) => [...prev, { ...c, id: nextCustomerId++ }])
  }, [])

  const updateCustomer = useCallback((c: Customer) => {
    setCustomers((prev) => prev.map((x) => (x.id === c.id ? c : x)))
  }, [])

  const deleteCustomer = useCallback((id: number) => {
    setCustomers((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const addOrder = useCallback((o: Omit<Order, "id" | "total">) => {
    const total = o.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const newOrder: Order = { ...o, id: nextOrderId++, total }
    setOrders((prev) => [...prev, newOrder])
    // Reduce stock
    setProducts((prev) =>
      prev.map((p) => {
        const item = o.items.find((i) => i.productId === p.id)
        if (item) return { ...p, quantityInStock: Math.max(0, p.quantityInStock - item.quantity) }
        return p
      })
    )
  }, [])

  const updateOrder = useCallback((o: Order) => {
    setOrders((prev) => prev.map((x) => (x.id === o.id ? o : x)))
  }, [])

  const deleteOrder = useCallback((id: number) => {
    setOrders((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const recordSale = useCallback(
    (orderId: number): Sell | null => {
      const order = orders.find((o) => o.id === orderId)
      if (!order) return null
      if (sells.find((s) => s.orderId === orderId)) return null
      const sell: Sell = {
        id: nextSellId++,
        orderId,
        date: new Date().toISOString(),
        total: order.total,
      }
      setSells((prev) => [...prev, sell])
      return sell
    },
    [orders, sells]
  )

  return (
    <DataContext.Provider
      value={{
        products,
        customers,
        orders,
        sells,
        addProduct,
        updateProduct,
        deleteProduct,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addOrder,
        updateOrder,
        deleteOrder,
        recordSale,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
