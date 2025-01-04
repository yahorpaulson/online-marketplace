import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  products: any[] = [];
  categories: any[] = [];
  filteredProducts: any[] = [];

  constructor(private productService: ProductService, private router: Router) {

    this.products = this.productService.getProducts();
    this.categories = this.productService.getCategories();


    this.filteredProducts = [...this.products];
  }

  updateProductList(): void {
    this.products = this.productService.getProducts();
    this.filteredProducts = [...this.products];
  }


  filterProducts(searchTerm: string) {
    console.log('Search term:', searchTerm);
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log('Filtered products:', this.filteredProducts);
  }

  navigateToDetails(product: any): void {
    this.router.navigate(['/retail/product', product.id], {
      queryParams: {
        name: product.name,
        price: product.price,
        description: product.description,
        images: product.images.join(','),
      },
    });
  }

  getTopLevelCategories() {
    return this.categories.filter((c) => !c.parentId);
  }


  hasChildCategories(categoryId: number): boolean {
    return this.categories.some((c) => c.parentId === categoryId);
  }


  getSubcategories(parentId: number) {
    return this.categories.filter((c) => c.parentId === parentId);
  }

  filterProductsByCategory(categoryId: number) {
    const allCategoryIds = this.getAllChildCategoryIds(categoryId);
    this.filteredProducts = this.products.filter((product) =>
      allCategoryIds.includes(product.categoryId)
    );
  }

  getAllChildCategoryIds(categoryId: number): number[] {
    const childIds = this.categories
      .filter((category) => category.parentId === categoryId)
      .map((category) => category.id);

    return childIds.reduce(
      (ids, id) => [...ids, id, ...this.getAllChildCategoryIds(id)],
      [categoryId]
    );
  }
}
