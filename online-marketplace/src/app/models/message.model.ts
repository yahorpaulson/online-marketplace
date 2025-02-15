export interface Message {
    id?: number;
    product_id?: number; 
    vehicle_id?: number; 
    sender_id: number;
    receiver_id: number;
    sender_username?: string;
    receiver_username?: string;
    content: string;
    created_at?: Date;
    product_name?: string; 
    vehicle_name?: string; 
    message_type: 'product' | 'vehicle'; 
}