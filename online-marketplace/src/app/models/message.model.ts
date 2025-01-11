export interface Message {
    id?: number;
    product_id: number;
    buyer_id: number;
    seller_id: number;
    content: string;
    created_at?: Date;
}
