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

  // Methode zur Ansicht aller Fahrzeuge
  viewVehicles() {
    this.router.navigate(['/vehicles']);
  }

  // Methode zum Navigieren zur Fahrzeug-Hinzufügenseite
  navigateToAddVehicles() {
    this.router.navigate(['/add-vehicle']);
  }

  /*logout() {
    // Beispiel für Logout-Logik
    console.log('User logged out');
    this.router.navigate(['/login']);
  } */
}
