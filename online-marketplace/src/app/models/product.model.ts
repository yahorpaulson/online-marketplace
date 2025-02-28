export interface Product {
    id: number | null;
    name: string;
    price: number | null;
    description: string;
    images: string[];
    categoryId: number | null;
    ownerId: number | null;
    status: string;
}
export interface Category {
    id: number;
    name: string;
    parentId: number;
}