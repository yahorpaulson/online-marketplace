import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  //temporary
  products = [
    { id: 1, name: 'Laptop 1', price: 1000, description: 'Description of Laptop 1', images: ['/assets/laptop1.jpg'], categoryId: 3 },
    { id: 2, name: 'Desktop 1', price: 1500, description: 'Description of Desctop 1', images: ['/assets/desktop1.jpg', '/assets/desktop1_alt.jpg'], categoryId: 4 },
    { id: 3, name: 'Smartphone 1', price: 800, description: 'Description of Smartphone 1', images: ['/assets/smartphone1.jpg'], categoryId: 5 },
    { id: 4, name: 'Men Shirt', price: 50, description: 'Description of Shirt', images: ['/assets/shirt.jpg'], categoryId: 7 },
    { id: 5, name: 'Women Dress', price: 80, description: 'Description of Dress', images: ['/assets/dress.jpg'], categoryId: 8 },
  ];
  categories = [
    { id: 1, name: 'Electronics', parentId: null },
    { id: 2, name: 'Computers', parentId: 1 },
    { id: 3, name: 'Laptops', parentId: 2 },
    { id: 4, name: 'Desktops', parentId: 2 },
    { id: 5, name: 'Smartphones', parentId: 1 },
    { id: 6, name: 'Clothing', parentId: null },
    { id: 7, name: 'Men', parentId: 6 },
    { id: 8, name: 'Women', parentId: 6 },
  ];




  constructor(private router: Router) { }

  filteredProducts = [...this.products];


  filterProducts(searchTerm: string) {
    console.log('Search term:', searchTerm);
    console.log('Before filter:', this.products);
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
        images: product.images.join(',')
      },
    });
  }

  getTopLevelCategories() {
    return this.categories.filter(c => !c.parentId);
  }

  hasChildCategories(categoryId: number): boolean {
    return this.categories.some(c => c.parentId === categoryId);
  }

  getSubcategories(parentId: number) {
    return this.categories.filter(c => c.parentId === parentId);
  }

  filterProductsByCategory(categoryId: number) {
    const allCategoryIds = this.getAllChildCategoryIds(categoryId);
    this.filteredProducts = this.products.filter(product =>
      allCategoryIds.includes(product.categoryId)
    );
  }

  getAllChildCategoryIds(categoryId: number): number[] {
    const childIds = this.categories
      .filter(category => category.parentId === categoryId)
      .map(category => category.id);

    return childIds.reduce(
      (ids, id) => [...ids, id, ...this.getAllChildCategoryIds(id)],
      [categoryId]
    );






  }
}
