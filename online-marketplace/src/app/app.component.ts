import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, FormsModule, CommonModule],
})
export class AppComponent {
  showMainPage = true;

  constructor(private router: Router) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        this.showMainPage = event.url === '/' || event.url === '/login' || event.url === '/register';
      }
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

  goToRetail() {
    if (this.isAuthenticated()) {
      this.router.navigate(['/retail']);
    } else {
      alert('Please login first!');
    }
  }

  goToVehicleMarket() {
    if (this.isAuthenticated()) {
      this.router.navigate(['/vehicleMarket']);
    } else {
      alert('Please login first!');
    }
  }
}
