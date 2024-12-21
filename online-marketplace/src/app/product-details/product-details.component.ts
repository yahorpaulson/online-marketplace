import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [CommonModule]
})
export class ProductDetailsComponent implements OnInit {
  product: any = {};
  isChatOpen: boolean = true;
  chatMessages: string[] = [];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.product = {
        id: +this.route.snapshot.paramMap.get('id')!,
        name: params['name'],
        price: params['price'],
        description: params['description'],
        images: params['images'] ? params['images'].split(',') : []
      };
      console.log(this.product);
    });
    setTimeout(() => {
      this.chatMessages.push("Hello! How can I help you?");
    }, 1000);

  }

  closeChat() {
    this.isChatOpen = false;
    this.chatMessages = [];
  }

  sendMessage(input: HTMLInputElement) {
    if (input.value.trim() !== "") {
      this.chatMessages.push(input.value.trim());
      input.value = "";
    }
  }

  goBack(): void {

    this.router.navigate(['/retail']);
  }
}
