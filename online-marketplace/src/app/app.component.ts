import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet],
})
export class AppComponent {


  constructor(private router: Router) { }



  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return token !== null;
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

  goToRetail() {
    this.router.navigate(['/retail']);
  }

  goToVehicleMarket() {
    this.router.navigate(['/vehicleMarket']);
  }


}
