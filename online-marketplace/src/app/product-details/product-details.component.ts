import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthserviceService } from '../authservice.service';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [CommonModule]
})
export class ProductDetailsComponent implements OnInit {
  product: any = {};
  isChatOpen: boolean = true;
  chatMessages: Message[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthserviceService,
    private productService: ProductService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe((product) => {
      this.product = product;
      console.log(this.product);

      setTimeout(() => {
        this.chatMessages.push({
          product_id: this.product.id,
          buyer_id: this.authService.getUserId()!,
          seller_id: this.product.owner_id,
          content: 'Hello! How can I help you?',
          sender: 'seller',
        });
      }, 1000);
    });
  }

  isProductOwner(): boolean {
    const userId = this.authService.getUserId();
    const ownerId = this.product.owner_id;

    const isSeller = this.authService.hasRole('seller');

    console.log('Current User ID:', userId);
    console.log('Product Owner ID:', ownerId);

    return isSeller && userId === ownerId;
  }

  deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.product.id).subscribe(
        () => {
          console.log(`Product with ID: ${this.product.id} deleted.`);
          alert('Product successfully deleted.');
          this.router.navigate(['/retail']);
        },
        (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again later.');
        }
      );
    }
  }

  closeChat(): void {
    this.isChatOpen = false;
    this.chatMessages = [];
  }

  sendMessage(input: HTMLInputElement): void {
    const trimmedValue = input.value.trim();

    if (!this.product.owner_id) {
      console.error('Seller ID (owner_id) is undefined');
      alert('Cannot send message: Product details are not fully loaded.');
      return;
    }

    if (trimmedValue !== '') {
      const newMessage: Message = {
        product_id: this.product.id,
        buyer_id: this.authService.getUserId()!,
        seller_id: this.product.owner_id,
        content: trimmedValue,
        sender: this.authService.getUserId() === this.product.owner_id ? 'seller' : 'buyer',
      };

      this.messageService.sendMessage(newMessage).subscribe({
        next: (savedMessage) => {
          this.chatMessages.push(savedMessage);
          input.value = '';
          console.log(this.chatMessages);
        },
        error: (err) => {
          console.error('Failed to send message:', err);
          alert('Failed to send the message. Please try again later.');
        },
      });
    } else {
      console.warn('Message is empty');
    }
  }

  goBack(): void {
    this.router.navigate(['/retail']);
  }
}
