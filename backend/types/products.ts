export interface ProductItem {
    id: number;
    name: string;
    brand: string;
    category: string
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