export interface Appointment {
    id: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    service: string;
    branch: string;
    date: string;
    time: string;
    guests: number;
}
//# sourceMappingURL=appointments.d.ts.map