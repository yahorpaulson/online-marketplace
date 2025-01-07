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
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  addProduct(product: Product): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product);
  }
  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}`);
  }


}
