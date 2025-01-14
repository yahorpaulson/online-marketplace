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
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserId() || 0;
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.getUserMessages(this.currentUser.toString()).subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => console.error('Failed to load messages:', err),
    });
  }

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

  sendReply(): void {
    if (!this.replyMessage.trim()) return;

    const reply: Message = {
      product_id: this.selectedMessage?.product_id || 0,
      sender_id: this.currentUser,
      receiver_id: this.replyDestination!,
      content: this.replyMessage.trim(),
    };

    this.messageService.sendMessage(reply).subscribe({
      next: (savedMessage) => {
        this.messages.push(savedMessage);
        this.selectedMessage = undefined;
        this.replyMessage = '';
      },
      error: (err) => console.error('Failed to send reply:', err),
    });
  }

  closeReplyWindow(): void {
    this.selectedMessage = undefined;
  }
}
