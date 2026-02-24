// Models matching the C# backend

export interface Product {
  id: number
  name: string
  price: number
  quantityInStock: number
}

export interface Customer {
  id: number
  name: string
  email: string
}

export interface OrderItem {
  productId: number
  quantity: number
  unitPrice: number
}

export interface Order {
  id: number
  customerId: number
  items: OrderItem[]
  total: number
}

export interface Sell {
  id: number
  orderId: number
  date: string
  total: number
}

export interface Stock {
  productId: number
  quantity: number
}
