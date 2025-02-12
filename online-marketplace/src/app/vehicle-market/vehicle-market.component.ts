import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vehicle-market',
  templateUrl: './vehicle-market.component.html',
  styleUrls: ['./vehicle-market.component.css'],
  imports:[RouterModule]
})
export class VehicleMarketComponent {
  constructor(private router: Router) {}

  viewVehicles() {
    this.router.navigate(['/vehicleMarket']);  
  }

  navigateToAddVehicles() {
    this.router.navigate(['/vehicleMarket/add-vehicle']);  
  }

  /*logout() {
    // Beispiel für Logout-Logik
    console.log('User logged out');
    this.router.navigate(['/login']);
  } */
}
