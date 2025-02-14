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
  ) { }

  ngOnInit(): void {

    this.currentUser = this.authService.getUserId()!;
    if (!this.currentUser) {
      console.error('User ID is not defined');
      return;
    }


    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe((product) => {
      this.product = product;
      console.log(this.product);
    });
  }



  isProductOwner(): boolean {
    const ownerId = this.product.owner_id;
    return this.currentUser === ownerId;
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
      },
    });
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
        sender_id: this.currentUser,
        receiver_id: this.product.owner_id,
        content: trimmedValue,
      };

      this.messageService.sendMessage(newMessage).subscribe({
        next: (savedMessage) => {
          this.chatMessages.push(savedMessage);
          input.value = '';
          console.log(this.chatMessages);
          alert("Message sent. Check your income messages");
          this.closeChat();

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
