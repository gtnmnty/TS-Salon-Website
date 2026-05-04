export interface ServiceItem {
    id: number;
    name: string;
    category: string;
    price: string;
    priceNum: number;
    badge: string | null;
    desc: string;
    imgs: string[];
    info: string[];
    reviewCount: number;
    reviews: Review[];
}
export interface Review {
    name: string;
    stars: number;
    date: string;
    text: string;
}
//# sourceMappingURL=services.d.ts.map