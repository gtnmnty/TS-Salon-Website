export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;                       
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  date: string;
}