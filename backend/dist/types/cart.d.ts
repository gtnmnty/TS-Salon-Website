export interface DeliveryOption {
    id: number;
    name: string;
    deliveryDays: number;
    deliveryPrice: number;
}
export interface CartItem {
    id: string;
    name: string;
    desc: string;
    image: string;
    price: number;
    qty: number;
    deliveryOptionId: number;
}
//# sourceMappingURL=cart.d.ts.map