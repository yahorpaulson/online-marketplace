import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products = [
    { id: 1, name: 'Laptop 1', price: 1000, description: 'Description of Laptop 1', images: ['/assets/laptop1.jpg'], categoryId: 3 },
    { id: 2, name: 'Desktop 1', price: 1500, description: 'Description of Desctop 1', images: ['/assets/desktop1.jpg', '/assets/desktop1_alt.jpg'], categoryId: 4 },
    { id: 3, name: 'Smartphone 1', price: 800, description: 'Description of Smartphone 1', images: ['/assets/smartphone1.jpg'], categoryId: 5 },
    { id: 4, name: 'Men Shirt', price: 50, description: 'Description of Shirt', images: ['/assets/shirt.jpg'], categoryId: 7 },
    { id: 5, name: 'Women Dress', price: 80, description: 'Description of Dress', images: ['/assets/dress.jpg'], categoryId: 8 },
  ];
  private categories = [
    { id: 1, name: 'Electronics', parentId: null },
    { id: 2, name: 'Computers', parentId: 1 },
    { id: 3, name: 'Laptops', parentId: 2 },
    { id: 4, name: 'Desktops', parentId: 2 },
    { id: 5, name: 'Smartphones', parentId: 1 },
    { id: 6, name: 'Clothing', parentId: null },
    { id: 7, name: 'Men', parentId: 6 },
    { id: 8, name: 'Women', parentId: 6 },
  ];

  constructor() { }


  getProducts() {
    return this.products;
  }

  getCategories() {
    return this.categories;
  }

  addProduct(product: any) {
    product.id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
    this.products.push(product);
  }
}
