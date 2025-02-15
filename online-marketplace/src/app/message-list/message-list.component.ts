import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message.model';
import { MessageService } from '../services/message.service';
import { AuthserviceService } from '../authservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
  imports: [CommonModule, FormsModule]
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];
  currentUser!: number;
  selectedMessage?: Message;
  replyMessage: string = '';
  replyDestination?: number;
  replyToUsername?: string;

  constructor(
    private messageService: MessageService,
    private authService: AuthserviceService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserId() || 0;
    this.loadMessages();
  }

  /**
   * Lädt alle Nachrichten für den aktuellen Benutzer.
   */
  loadMessages(): void {
    this.messageService.getUserMessages(this.currentUser.toString()).subscribe({
      next: (data) => {
        console.log('✅ Messages loaded:', data);
        this.messages = data;
      },
      error: (err) => console.error('❌ Failed to load messages:', err),
    });
  }

  /**
   * Wählt eine Nachricht aus und öffnet das Antwort-Fenster.
   * @param message - Die Nachricht, die beantwortet wird.
   */
  selectMessage(message: Message): void {
    this.selectedMessage = message;
    this.replyMessage = '';
    this.replyDestination =
      this.currentUser === message.sender_id
        ? message.receiver_id
        : message.sender_id;
    this.replyToUsername =
      this.currentUser === message.sender_id
        ? message.receiver_username
        : message.sender_username;
  }

  /**
   * Sendet eine Antwort auf eine ausgewählte Nachricht.
   */
  sendReply(): void {
    if (!this.replyMessage.trim() || !this.selectedMessage) return;

    const reply: Message = {
      sender_id: this.currentUser,
      receiver_id: this.replyDestination!,
      content: this.replyMessage.trim(),
      message_type: this.selectedMessage.message_type, // Wichtig: Nachrichtentyp beibehalten
    };

    // Falls es eine Produktnachricht ist, `product_id` setzen
    if (this.selectedMessage.message_type === 'product') {
      reply.product_id = this.selectedMessage.product_id;
    }
    // Falls es eine Fahrzeugnachricht ist, `vehicle_id` setzen
    else if (this.selectedMessage.message_type === 'vehicle') {
      reply.vehicle_id = this.selectedMessage.vehicle_id;
    }

    this.messageService.sendMessage(reply).subscribe({
      next: (savedMessage) => {
        console.log('✅ Reply sent:', savedMessage);
        this.messages.push(savedMessage);
        this.selectedMessage = undefined;
        this.replyMessage = '';
      },
      error: (err) => console.error('❌ Failed to send reply:', err),
    });
  }

  /**
   * Schließt das Antwortfenster.
   */
  closeReplyWindow(): void {
    this.selectedMessage = undefined;
  }
}
