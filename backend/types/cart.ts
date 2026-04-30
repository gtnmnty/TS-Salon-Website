export interface DeliveryOption {
  id: number
  name: string
  deliveryDays: number
  deliveryPrice: number
}

export interface CartItem {
  id: string
  name: string
  desc: string
  image: string
  price: number
  qty: number
  deliveryOptionId: number
}

export interface Order {
  orderId: string
  placedAt: string
  items: CartItem[]
  delivery: string
  estimatedArrival: string
  shippingFee: number
  itemsTotal: number
  grandTotal: number
  status: string
}