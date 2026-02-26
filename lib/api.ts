import type { Product, Customer, Order, Sell } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error")
    throw new Error(text || `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T

  return res.json()
}

// --- Products (used as stock) ---
export const productsApi = {
  getAll: () => fetcher<Product[]>("/products"),
  getById: (id: number) => fetcher<Product>(`/products/${id}`),
  create: (product: Omit<Product, "id">) =>
    fetcher<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  update: (product: Product) =>
    fetcher<Product>(`/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),
  delete: (id: number) =>
    fetcher<void>(`/products/${id}`, { method: "DELETE" }),
}

// Backwards-compatible alias for existing imports
export const stockApi = productsApi

// --- Customers ---
export const customersApi = {
  getAll: () => fetcher<Customer[]>("/customers"),
  getById: (id: number) => fetcher<Customer>(`/customers/${id}`),
  create: (customer: Omit<Customer, "id">) =>
    fetcher<Customer>("/customers", {
      method: "POST",
      body: JSON.stringify(customer),
    }),
  update: (customer: Customer) =>
    fetcher<Customer>(`/customers/${customer.id}`, {
      method: "PUT",
      body: JSON.stringify(customer),
    }),
  delete: (id: number) =>
    fetcher<void>(`/customers/${id}`, { method: "DELETE" }),
}

// --- Orders with items ---
type OrderItemInput = {
  productId: number
  quantity: number
}

type CreateOrUpdateOrderInput = {
  customerId: number
  items: OrderItemInput[]
}

export const ordersApi = {
  getAll: () => fetcher<Order[]>("/orders"),
  getById: (id: number) => fetcher<Order>(`/orders/${id}`),
  create: (input: CreateOrUpdateOrderInput) =>
    fetcher<Order>("/orders", {
      method: "POST",
      body: JSON.stringify({
        customer: { id: input.customerId },
        items: input.items.map((i) => ({
          product: { id: i.productId },
          quantity: i.quantity,
        })),
      }),
    }),
  update: (id: number, input: CreateOrUpdateOrderInput) =>
    fetcher<Order>(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        customer: { id: input.customerId },
        items: input.items.map((i) => ({
          product: { id: i.productId },
          quantity: i.quantity,
        })),
      }),
    }),
  delete: (id: number) =>
    fetcher<void>(`/orders/${id}`, { method: "DELETE" }),
}

// --- Sales linked to orders ---
export const sellsApi = {
  getAll: () => fetcher<Sell[]>("/sales"),
  getById: (id: number) => fetcher<Sell>(`/sales/${id}`),
  recordSale: (orderId: number) =>
    fetcher<Sell>(`/sales/record/${orderId}`, { method: "POST" }),
}
