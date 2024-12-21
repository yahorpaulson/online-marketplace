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
  products = [
    { id: 1, name: 'Product 1', price: 100, description: 'Description of Product 1', images: ['/assets/product1.jpg'] },
    { id: 2, name: 'Product 2', price: 200, description: 'Description of Product 2', images: ['/assets/product2.jpg', '/assets/product2_alt.jpg'] },
    { id: 3, name: 'Product 3', price: 300, description: 'Description of Product 3', images: ['/assets/product3.jpg'] },
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




}
