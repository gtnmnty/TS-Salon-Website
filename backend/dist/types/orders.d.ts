export interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    deliveryType?: string;
    deliveryDays?: number;
}
export interface Order {
    id: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    total: number;
    date: string;
}
//# sourceMappingURL=orders.d.ts.map