import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from '../product-list/product-list.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-retail',
  imports: [RouterModule, FormsModule, ProductListComponent],
  templateUrl: './retail.component.html',
  styleUrl: './retail.component.css',
  standalone: true,
})

export class RetailComponent {

  searchTerm: string = '';


  @ViewChild(ProductListComponent) productListComponent!: ProductListComponent;


  filterProducts() {
    this.productListComponent.filterProducts(this.searchTerm);
  }

}
