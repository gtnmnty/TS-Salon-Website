import type { DeliveryOption } from '../types/cart.ts';

export const deliveryOpts: DeliveryOption[] = [
  {
    id: 1,
    name: "Standard Delivery",
    deliveryDays: 5,
    deliveryPrice: 0,
  },
  {
    id: 2,
    name: "Express Delivery",
    deliveryDays: 2,
    deliveryPrice: 40,
  },
  {
    id: 3,
    name: "Next-Day Delivery",
    deliveryDays: 1,
    deliveryPrice: 80,
  },
  {
    id: 4,
    name: "Same Day Delivery",
    deliveryDays: 0,
    deliveryPrice: 120,
  },
  {
    id: 5,
    name: "Pick Up",
    deliveryDays: 0,
    deliveryPrice: 0,
  }
];

