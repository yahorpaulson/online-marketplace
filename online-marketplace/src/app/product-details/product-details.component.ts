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

  constructor(private route: ActivatedRoute,
    private router: Router,
    public authService: AuthserviceService,
    private productService: ProductService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe((product) => {
      this.product = product;
      console.log(this.product);

      setTimeout(() => {
        this.chatMessages.push({
          product_id: this.product.id,
          buyer_id: this.authService.getUserId()!,
          seller_id: this.product.ownerId,
          content: 'Hello! How can I help you?',
        });
      }, 1000);
    });
  }

  isProductOwner(): boolean {
    const userId = this.authService.getUserId();
    const ownerId = this.product.owner_id;
    console.log('Current User ID:', userId);
    console.log('Product Owner ID:', ownerId);
    return userId === ownerId;
  }


  deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.product.id);
      console.log(`Product with ID: ${this.product.id}  deleted.`);
      this.router.navigate(['/retail']);
    }
  }

  closeChat() {
    this.isChatOpen = false;
    this.chatMessages = [];
  }

  sendMessage(input: HTMLInputElement): void {
    if (input.value.trim() !== '') {
      const newMessage: Message = {
        product_id: this.product.id,
        buyer_id: this.authService.getUserId()!,
        seller_id: this.product.ownerId,
        content: input.value.trim(),
      };

      this.messageService.sendMessage(newMessage).subscribe((savedMessage) => {
        this.chatMessages.push(savedMessage);
        input.value = '';
      });
    }
  }


  goBack(): void {

    this.router.navigate(['/retail']);
  }


}
