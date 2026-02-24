import type { Product, Customer, Order, Sell } from "./types"

// Mock data for demo purposes when the backend is not connected

export const mockProducts: Product[] = [
  { id: 1, name: "Wireless Keyboard", price: 59.99, quantityInStock: 45 },
  { id: 2, name: "USB-C Hub", price: 34.99, quantityInStock: 120 },
  { id: 3, name: "Monitor Stand", price: 89.99, quantityInStock: 8 },
  { id: 4, name: "Mechanical Switch Set", price: 24.99, quantityInStock: 200 },
  { id: 5, name: "Desk Lamp LED", price: 42.50, quantityInStock: 0 },
  { id: 6, name: "Webcam 1080p", price: 74.99, quantityInStock: 33 },
  { id: 7, name: "Mouse Pad XL", price: 19.99, quantityInStock: 150 },
  { id: 8, name: "Laptop Riser", price: 49.99, quantityInStock: 22 },
]

export const mockCustomers: Customer[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
  { id: 3, name: "Clara Reyes", email: "clara@example.com" },
  { id: 4, name: "David Kim", email: "david@example.com" },
  { id: 5, name: "Eva Martinez", email: "eva@example.com" },
]

export const mockOrders: Order[] = [
  {
    id: 1,
    customerId: 1,
    items: [
      { productId: 1, quantity: 2, unitPrice: 59.99 },
      { productId: 2, quantity: 1, unitPrice: 34.99 },
    ],
    total: 154.97,
  },
  {
    id: 2,
    customerId: 2,
    items: [{ productId: 3, quantity: 1, unitPrice: 89.99 }],
    total: 89.99,
  },
  {
    id: 3,
    customerId: 3,
    items: [
      { productId: 4, quantity: 5, unitPrice: 24.99 },
      { productId: 7, quantity: 2, unitPrice: 19.99 },
    ],
    total: 164.93,
  },
  {
    id: 4,
    customerId: 1,
    items: [{ productId: 6, quantity: 1, unitPrice: 74.99 }],
    total: 74.99,
  },
  {
    id: 5,
    customerId: 4,
    items: [
      { productId: 8, quantity: 1, unitPrice: 49.99 },
      { productId: 2, quantity: 3, unitPrice: 34.99 },
    ],
    total: 154.96,
  },
]

export const mockSells: Sell[] = [
  { id: 1, orderId: 1, date: "2026-02-10T14:30:00Z", total: 154.97 },
  { id: 2, orderId: 2, date: "2026-02-15T09:15:00Z", total: 89.99 },
  { id: 3, orderId: 3, date: "2026-02-20T16:45:00Z", total: 164.93 },
]
