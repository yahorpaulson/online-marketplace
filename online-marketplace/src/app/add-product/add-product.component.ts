import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { AuthserviceService } from '../authservice.service';

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
    ownerId: null as number | null
  };

  categories: any[] = [];


  constructor(private router: Router, private productService: ProductService, private authService: AuthserviceService) {

    this.categories = this.productService.getCategories();

  }

  addProduct() {

    const userId = this.authService.getUserId();
    if (userId === null) {
      alert('You need to be logged in to add a product.');
      return;
    }
    this.product.ownerId = this.authService.getUserId()

    this.productService.addProduct(this.product);;
    console.log(`${this.product.name} is added`, this.product);
    this.router.navigate(['/retail']);
  }

  onFileChange(event: any): void {
    const files: FileList = event.target.files;
    Array.from(files).forEach((file: File) => {
      this.product.images.push(URL.createObjectURL(file));
    });
  }

  getTopLevelCategories() {
    return this.categories.filter(c => !c.parentId);
  }
  isLeafCategory(categoryId: number | null): boolean {
    if (categoryId === null) {
      return false;
    }
    const childCategories = this.categories.filter((category) => category.parentId === categoryId);

    return childCategories.length === 0;
  }
  getCategoryPrefix(categoryId: number): string {
    let prefix = '';
    let currentCategory = this.categories.find(c => c.id === categoryId);

    //goes up to root category and adds a prefix before the name of each category
    while (currentCategory && currentCategory.parentId) {
      prefix += '- ';
      currentCategory = this.categories.find(c => c.id === currentCategory.parentId);
    }

    return prefix;
  }

  getSubcategories(parentId: number) {
    return this.categories.filter(c => c.parentId === parentId);
  }



  onSubmit() {
    this.addProduct();
  }
}
