import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../models/message.model';
import { MessageService } from '../services/message.service';
import { CommonModule } from '@angular/common';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
  imports: [CommonModule]
})
export class MessageListComponent implements OnInit {

  messages: Message[] = [];


  constructor(private messageService: MessageService, private authService: AuthserviceService) { }

  userId!: any;

  ngOnInit(): void {
    console.log('MessageListComponent initialized');
    this.userId! = this.authService.getUserId();
    console.log(this.userId + ' is current User Id')
    this.loadMessages();
  }

  loadMessages(): void {
    if (!this.userId) {
      console.error('User ID is not defined');
      return;
    }

    this.messageService.getUserMessages(this.userId).subscribe({
      next: (data) => {
        console.log('Messages for user loaded:', data);
        this.messages = data;
      },
      error: (err) => {
        console.error('Failed to load messages:', err);
      },
    });
  }
}
