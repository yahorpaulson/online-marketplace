import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-vehicle-market',
  templateUrl: './vehicle-market.component.html',
  styleUrls: ['./vehicle-market.component.css'],
  imports:[RouterModule]
})
export class VehicleMarketComponent {
  constructor(private router: Router,private authService: AuthserviceService) {}

  viewVehicles() {
    this.router.navigate(['/vehicleMarket']);  
  }

  navigateToAddVehicles() {
    this.router.navigate(['/vehicleMarket/add-vehicle']);  
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

    goMessages(): void {
      this.router.navigate(['/retail/messages']);
    }

    backToMainPage(): void {
      this.router.navigate(['/retail']);
    }
}
