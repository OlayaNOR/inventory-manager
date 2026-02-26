export interface Product {
  id: number
  name: string
  price: number
  quantityInStock: number
  description?: string
}

export interface Customer {
  id: number
  name: string
  email: string
}

export interface OrderItem {
  id: number
  product: Product
  quantity: number
  unitPrice: number
}

export interface Order {
  id: number
  customer: Customer
  items: OrderItem[]
  totalAmount: number
}

export interface Sell {
  id: number
  orderId: number
  date: string
  total: number
}
