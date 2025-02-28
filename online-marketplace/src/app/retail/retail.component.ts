import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from '../product-list/product-list.component';
import { FormsModule } from '@angular/forms';
import { AuthserviceService } from '../authservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductfilterService } from '../productfilter.service';



@Component({
  selector: 'app-retail',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './retail.component.html',
  styleUrl: './retail.component.css',
  standalone: true,
})

export class RetailComponent {

  searchTerm: string = '';


  constructor(private authService: AuthserviceService, private router: Router, private productFilterService: ProductfilterService) { }


  ngOnInit(): void {

  }

  navigateToAddProduct(): void {
    this.router.navigate(['/retail/add-product']);
  }

  @ViewChild(ProductListComponent) productListComponent!: ProductListComponent;


  filterProducts(): void {
    this.productFilterService.updateSearchTerm(this.searchTerm);
  }

  backToMainPage(): void {
    this.filterProducts();
    this.router.navigate(['/retail']);

  }


  goMessages(): void {
    this.router.navigate(['/retail/messages']);
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  viewVehicles() {
    this.router.navigate(['/vehicleMarket']);  
  }
}
