import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthserviceService } from '../authservice.service';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message.model';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ProductDetailsComponent implements OnInit {
  product: any = {};
  isChatOpen: boolean = true;
  chatMessages: Message[] = [];
  currentUser!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthserviceService,
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserId()!;
    
    if (!this.currentUser) {
      console.error('User ID is not defined');
      return;
    }

    const productId = +this.route.snapshot.paramMap.get('id')!;
    if (!productId) {
      console.error('Invalid product ID');
      return;
    }

    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        console.log('Product loaded:', this.product);

        setTimeout(() => {
          if (this.product.owner_id) {
            const welcomeMessage: Message = {
              product_id: this.product.id,
              sender_id: this.product.owner_id,
              receiver_id: this.currentUser,
              content: 'Hello! How can I help you?',
              message_type: 'product'
            };
            this.chatMessages.push(welcomeMessage);
          }
        }, 1000);
      },
      error: (err) => {
        console.error('Error loading product:', err);
      }
    });
  }

  isProductOwner(): boolean {
    return this.currentUser === this.product?.owner_id;
  }

  onStatusChange(event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value;

    this.productService.updateProductStatus(this.product.id, newStatus).subscribe({
      next: (response) => {
        console.log('Status updated:', response);
        alert(`Product status changed to ${newStatus}`);
      },
      error: (error) => {
        console.error('Error updating status:', error);
        alert('Failed to change product status. Try again.');
      }
    });
  }

  deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          console.log(`Product with ID: ${this.product.id} deleted.`);
          alert('Product successfully deleted.');
          this.router.navigate(['/retail']);
        },
        error: (error) => {
          console.error(' Error deleting product:', error);
          alert('Failed to delete product. Please try again later.');
        }
      });
    }
  }

  closeChat(): void {
    this.isChatOpen = false;
    this.chatMessages = [];
  }

  sendMessage(input: HTMLInputElement): void {
    const trimmedValue = input.value.trim();

    if (!trimmedValue) {
      console.warn('Message is empty!');
      return;
    }

    if (!this.product?.owner_id) {
      console.error('Seller ID is undefined');
      alert('Cannot send message: Product details are not fully loaded.');
      return;
    }

    const newMessage: Message = {
      product_id: this.product.id,
      sender_id: this.currentUser,
      receiver_id: this.product.owner_id,
      content: trimmedValue,
      message_type: 'product'  
    };

    this.messageService.sendMessage(newMessage).subscribe({
      next: (savedMessage) => {
        this.chatMessages.push(savedMessage);
        input.value = '';
        console.log('Message sent:', savedMessage);
          alert("Message sent. Check your income messages");
          this.closeChat();

      },
      error: (err) => {
        console.error('Failed to send message:', err);
        alert('Failed to send the message. Please try again later.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/retail']);
  }
}
