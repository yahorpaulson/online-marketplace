import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class ProductService {


  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }


  getProducts(): Observable<Product[]> {
    console.log('Fetching products from API...');
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      tap((products) => console.log('Products fetched:', products)),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(error);
      })
    );

  }

  getProductById(productId: number): Observable<Product> {
    console.log(`Fetching product with ID: ${productId}`);
    return this.http.get<Product>(`${this.apiUrl}/products/${productId}`).pipe(
      tap((product) => console.log('Product fetched:', product)),
      catchError((error) => {
        console.error('Error getting product by ID:', error);
        return throwError(error);
      })
    )
  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  addProduct(product: Product): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product);
  }
  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}`);
  }

  updateProductStatus(productId: number, status: string): Observable<Product> {
    console.log("Update the status here");
    return this.http.patch<Product>(`${this.apiUrl}/products/${productId}/status`, { status });

  }
}
