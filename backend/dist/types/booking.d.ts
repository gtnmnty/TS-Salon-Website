export interface BookingForm {
    name: string;
    phone: string;
    email: string;
    serviceType: 'salon' | 'home';
    date: string;
    time: string;
    branch?: string;
    street?: string;
    barangay?: string;
    city?: string;
    zipcode?: string;
    service: string;
    guests: number;
    notes?: string;
}
//# sourceMappingURL=booking.d.ts.map