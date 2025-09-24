interface Car {
    patent: string;
    make: string;
    model: string;
    year: number;
    price: number;
    kilometers: number;
    fuel: string;
    transmission: string;
    color: string;
    description?: string;
    image?: string;
    publishStatus?: {
        platform: string;
        status: string;
    }[];
}