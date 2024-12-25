import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AddProductComponent {
  product = {
    name: '',
    categoryId: null,
    price: null,
    images: [] as string[],
    id: 0,
  };

  categories: any[] = [];

  constructor(private router: Router, private productService: ProductService) {

    this.categories = this.productService.getCategories();
  }

  addProduct() {
    this.product.id = this.productService.getProducts().length + 1;
    this.productService.addProduct(this.product);
    console.log(`${this.product.name} is added`, this.product);
    this.router.navigate(['/retail']);
  }


  onFileChange(event: any): void {
    const files: FileList = event.target.files;
    Array.from(files).forEach((file: File) => {
      this.product.images.push(URL.createObjectURL(file));
    });
  }


  onSubmit() {
    this.addProduct();
  }
}
