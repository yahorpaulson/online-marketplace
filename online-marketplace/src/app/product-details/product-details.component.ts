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
    this.route.queryParams.subscribe((params) => {
      this.product = {
        id: +this.route.snapshot.paramMap.get('id')!,
        name: params['name'],
        price: params['price'],
        description: params['description'],
        images: params['images'] ? params['images'].split(',') : [],
        ownerId: params['ownerId']
      };
      console.log(this.product);
    });
    setTimeout(() => {
      this.chatMessages.push({
        product_id: this.product.id,
        buyer_id: 0,
        seller_id: this.product.owner_id,
        content: "Hello! How can I help you?",
      });
    }, 1000);

    console.log(this.product.images);

  }
  isProductOwner(): boolean {
    console.log(this.authService.getUserId());
    //return this.authService.getUserId() === this.product.ownerId;
    return true;
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
