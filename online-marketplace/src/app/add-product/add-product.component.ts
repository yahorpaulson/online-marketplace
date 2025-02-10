import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { AuthserviceService } from '../authservice.service';
import { Category, Product } from '../models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AddProductComponent implements OnInit {
  product: Product = {
    name: '',
    categoryId: null,
    price: null,
    images: [],
    id: 0,
    ownerId: null,
    description: '',
    status: ''
  };

  categories: Category[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private authService: AuthserviceService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }


  loadCategories(): void {
    this.productService.getCategories().subscribe(
      (data: any[]) => {
        this.categories = data.map((category) => ({
          ...category,
          parentId: category.parent_id,
        }));
        console.log('Categories:', this.categories);
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }


  addProduct(): void {
    const userId = this.authService.getUserId();
    if (userId === null) {
      alert('Login to add a product.');
      return;
    }

    this.product.ownerId = userId;

    this.productService.addProduct(this.product).subscribe(
      () => {
        console.log(`${this.product.name} added`, this.product);
        this.router.navigate(['/retail']);
      },
      (error) => {
        alert(`Failed to add product: ${error.error?.message || error.message}`);
        console.error('Error while addition a product:', error);

      }
    );
  }


  onFileChange(event: any): void {
    const files: FileList = event.target.files;
    Array.from(files).forEach((file: File) => {
      this.product.images.push(URL.createObjectURL(file));
    });
  }

  getTopLevelCategories(): Category[] {
    return this.categories.filter((c) => !c.parentId);
  }


  isLeafCategory(categoryId: number | null): boolean {
    if (categoryId === null) {
      return false;
    }
    console.log(`Checking if category ${categoryId} is a leaf.`);

    console.log('Current category ID:', categoryId);
    console.log('All categories:', this.categories);

    const childCategories = this.categories.filter((category) => category.parentId === categoryId);

    console.log(`Child categories for ${categoryId}:`, childCategories);
    console.log(`Category ID: ${categoryId}, has children: ${childCategories.length > 0}`);
    return childCategories.length === 0;
  }




  getCategoryPrefix(categoryId: number | null): string {
    if (categoryId === null) {
      return '';
    }

    let prefix = '';
    let currentCategory = this.categories.find((c) => c.id === categoryId);


    while (currentCategory && currentCategory.parentId) {
      prefix += '- ';
      currentCategory = this.categories.find((c) => c.id === currentCategory!.parentId);
    }

    return prefix;
  }


  getSubcategories(parentId: number): Category[] {
    return this.categories.filter((c) => c.parentId === parentId);
  }


  onSubmit(): void {
    this.addProduct();
  }
}
