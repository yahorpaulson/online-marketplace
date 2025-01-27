import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/Vehicle';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css'],
  imports:[CommonModule]
})
export class VehicleDetailComponent implements OnInit {
  vehicle: Vehicle | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private router:Router,
  ) {}

  ngOnInit(): void {
    this.loadVehicleDetail();
  }

  private loadVehicleDetail(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehicleService.getVehicleById(+id).subscribe({
        next: (data) => {
          this.vehicle = data;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Error loading vehicle details. Please try again later.';
          console.error('Error:', err);
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Invalid vehicle ID.';
      this.loading = false;
    }
  }
  goBack(): void {
    this.router.navigate(['/vehicles']); // Adjust the route as needed
  }
}
