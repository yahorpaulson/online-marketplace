import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    private apiUrl = 'http://localhost:4000/api/messages';

    constructor(private http: HttpClient) { }


    getMessages(product_id: number): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiUrl}/${product_id}`);
    }


    sendMessage(message: Message): Observable<Message> {
        return this.http.post<Message>(this.apiUrl, message);
    }
}
