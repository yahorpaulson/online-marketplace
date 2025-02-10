import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Category, Product } from '../models/product.model';
import { ProductfilterService } from '../productfilter.service';
import { AuthserviceService } from '../authservice.service';


@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],


})
export class ProductListComponent {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  categoryTree: any[] = [];


  constructor(private productService: ProductService,
    private router: Router,
    private productFilterService: ProductfilterService,
    private authService: AuthserviceService) {


  }
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.productFilterService.searchTerm$.subscribe(term => {
      this.filterProducts(term);
    });
  }
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products: any[]) => {
        console.log('Raw products loaded:', products);


        this.products = products
          .map((product) => ({
            ...product,
            categoryId: product.category_id,
            ownerId: product.owner_id
          }))
          .filter((product) => product.status !== 'sold');  //hide sold products 

        this.filteredProducts = [...this.products];
        console.log('Products after filtering and mapping:', this.products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }


  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories: any[]) => {
        console.log('Raw categories loaded:', categories);


        this.categories = categories.map((category) => ({
          ...category,
          parentId: category.parent_id,
        }));


        this.categoryTree = this.buildCategoryTree(this.categories);

        console.log('Processed Category Tree:', this.categoryTree);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }


  updateUserProducts(): void {
    const userId = this.authService.getUserId();
    console.log('User ID:', userId);



    if (userId !== null) {
      this.filteredProducts = this.products.filter((product) => {

        console.log(`Comparing: product.ownerId=${product.ownerId}, userId=${userId}`);
        return product.ownerId === userId;
      });

      console.log('Filtered Products:', this.filteredProducts);
    } else {
      console.error('User ID is null. Cannot filter products.');
      this.filteredProducts = [];
    }
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
        images: product.images ? product.images.join(',') : '',
      },
    });
  }

  getTopLevelCategories() {
    return this.categories.filter((c) => !c.parentId);
  }


  hasChildCategories(categoryId: number): boolean {
    return this.categories.some((c) => c.parentId === categoryId);
  }
  buildCategoryTree(categories: Category[]): any[] {
    const categoryMap: { [key: number]: any } = {};


    categories.forEach((category) => {
      categoryMap[category.id] = { ...category, children: [] };
    });

    const tree: any[] = [];


    categories.forEach((category) => {
      if (category.parentId) {

        if (categoryMap[category.parentId]) {
          categoryMap[category.parentId].children.push(categoryMap[category.id]);
        }
      } else {

        tree.push(categoryMap[category.id]);
      }
    });

    return tree;
  }



  getSubcategories(parentId: number) {
    return this.categories.filter((c) => c.parentId === parentId);
  }

  filterProductsByCategory(categoryId: number): void {
    console.log('Category clicked:', categoryId);

    const allCategoryIds = this.getAllChildCategoryIds(categoryId);
    console.log('All category IDs for filtering:', allCategoryIds);
    console.log('Products before filtering by category' + this.products)
    this.filteredProducts = this.products.filter((product) =>
      allCategoryIds.includes(product.categoryId!)
    );
    console.log('Filtered products:', this.filteredProducts);
  }

  getAllChildCategoryIds(categoryId: number): number[] {
    const childIds = this.categories
      .filter((category) => category.parentId === categoryId)
      .map((category) => category.id)
      .filter((id): id is number => id !== null);

    return childIds.reduce<number[]>(
      (ids, id) => [...ids, id, ...this.getAllChildCategoryIds(id)],
      [categoryId]
    );
  }


}
