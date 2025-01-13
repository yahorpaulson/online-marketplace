import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from '../product-list/product-list.component';
import { FormsModule } from '@angular/forms';
import { AuthserviceService } from '../authservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-retail',
  imports: [RouterModule, FormsModule, CommonModule, ProductListComponent],
  templateUrl: './retail.component.html',
  styleUrl: './retail.component.css',
  standalone: true,
})

export class RetailComponent {

  searchTerm: string = '';
  showAddProductButton: boolean = false;

  constructor(private authService: AuthserviceService, private router: Router) { }


  ngOnInit(): void {
    this.showAddProductButton = this.authService.hasRole('seller');
    console.log("CAN I ADD A PRODUCT? :" + this.showAddProductButton);
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/retail/add-product']);
  }



  @ViewChild(ProductListComponent) productListComponent!: ProductListComponent;




  filterProducts() {
    this.productListComponent.filterProducts(this.searchTerm);
  }




  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
