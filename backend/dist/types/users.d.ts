import type { Appointment } from '../types/appointments.ts';
import type { Order } from '../types/orders.ts';
import type { CartItem } from '../types/cart.ts';
import type { Address } from '../types/address.ts';
import type { PaymentMethod } from '../types/payment.ts';
export interface UserAccount {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    joinedDate: string;
    orders: Order[];
    appointments: Appointment[];
    cart: CartItem[];
    address: Address | null;
    paymentMethod: PaymentMethod | null;
}
//# sourceMappingURL=users.d.ts.map