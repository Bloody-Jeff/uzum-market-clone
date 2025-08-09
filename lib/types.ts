export interface Product {
  id: string | number
  title: string
  description: string
  colors: string[]
  rating: number
  price: number
  isBlackFriday: boolean
  salePercentage: number
  media: string[]
  type: string
  dioganal?: string[] // for TVs
}

export interface CartItem extends Product {
  quantity: number
}
