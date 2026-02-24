import type { Product, Customer, Order, Sell } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5052/api"

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

// --- Stock / Products ---
export const stockApi = {
  getAll: () => fetcher<Product[]>("/stock"),
  getById: (id: number) => fetcher<Product>(`/stock/${id}`),
  create: (product: Omit<Product, "id">) =>
    fetcher<Product>("/stock", { method: "POST", body: JSON.stringify(product) }),
  update: (product: Product) =>
    fetcher<void>(`/stock/${product.id}`, { method: "PUT", body: JSON.stringify(product) }),
  delete: (id: number) =>
    fetcher<void>(`/stock/${id}`, { method: "DELETE" }),
}

// --- Customers ---
export const customersApi = {
  getAll: () => fetcher<Customer[]>("/customers"),
  getById: (id: number) => fetcher<Customer>(`/customers/${id}`),
  create: (customer: Omit<Customer, "id">) =>
    fetcher<Customer>("/customers", { method: "POST", body: JSON.stringify(customer) }),
  update: (customer: Customer) =>
    fetcher<void>(`/customers/${customer.id}`, { method: "PUT", body: JSON.stringify(customer) }),
  delete: (id: number) =>
    fetcher<void>(`/customers/${id}`, { method: "DELETE" }),
}

// --- Orders ---
export const ordersApi = {
  getAll: () => fetcher<Order[]>("/orders"),
  getById: (id: number) => fetcher<Order>(`/orders/${id}`),
  create: (order: Omit<Order, "id" | "total">) =>
    fetcher<Order>("/orders", { method: "POST", body: JSON.stringify(order) }),
  update: (order: Order) =>
    fetcher<void>(`/orders/${order.id}`, { method: "PUT", body: JSON.stringify(order) }),
  delete: (id: number) =>
    fetcher<void>(`/orders/${id}`, { method: "DELETE" }),
}

// --- Sells ---
export const sellsApi = {
  getAll: () => fetcher<Sell[]>("/sells"),
  getById: (id: number) => fetcher<Sell>(`/sells/${id}`),
  recordSale: (orderId: number) =>
    fetcher<Sell>(`/sells/record/${orderId}`, { method: "POST" }),
}
