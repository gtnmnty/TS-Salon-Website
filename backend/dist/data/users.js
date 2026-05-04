"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
exports.users = [
    {
        id: 'USR-00001',
        fullName: 'Jon Snow',
        email: 'dncntthtll@gmail.com',
        phone: '09271234567',
        joinedDate: '2024-01-15',
        appointments: [
            {
                id: 'APT-00042',
                status: 'upcoming',
                service: 'Signature Facial Treatment',
                branch: 'Quezon City',
                date: '03-21-26',
                time: '8:00 – 9:00 AM',
                guests: 2
            },
            {
                id: 'APT-00038',
                status: 'completed',
                service: 'Deep Tissue Massage',
                branch: 'BGC, Taguig',
                date: '02-10-26',
                time: '2:00 – 3:30 PM',
                guests: 1
            }
        ],
        orders: [
            {
                id: 'ORD-00001',
                status: 'delivered',
                date: '2026-03-01',
                total: 1850,
                items: [
                    { productId: 'PRD-001', name: 'Rose Glow Serum', quantity: 1, price: 1200 },
                    { productId: 'PRD-002', name: 'Velvet Lip Tint', quantity: 2, price: 325 }
                ]
            }
        ],
        cart: [
            {
                id: 'PRD-003',
                name: 'Gold Facial Mask',
                desc: 'A brightening facial mask with gold extract for a polished glow.',
                image: '',
                price: 950,
                qty: 1,
                deliveryOptionId: 1
            }
        ],
        address: {
            label: 'Home',
            street: '35G Liberty Avenue',
            barangay: 'Cubao',
            city: 'Quezon City',
            zipcode: '1109',
            country: 'Philippines',
            isDefault: true
        },
        paymentMethod: {
            type: 'card',
            label: '•••• 4242',
            isDefault: true
        },
    },
];
//# sourceMappingURL=users.js.map