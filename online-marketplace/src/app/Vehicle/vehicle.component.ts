import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/Vehicle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css'],
  imports:[CommonModule,FormsModule]
})
export class VehicleComponent implements OnInit {
  vehicles: Vehicle[] = []; // Alle Fahrzeuge
  filteredVehicles: Vehicle[] = []; // Gefilterte Fahrzeuge
  currentVehicleType: string | null = null; // Aktueller Fahrzeugtyp
  filters = {
    searchTerm: '',
    brand: '',
    model: '',
    maxPrice: null as number | null,
    maxMileage: null as number | null,
    minYear: null as number | null,
  };

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    // Fahrzeuge beim Laden der Komponente abrufen
    this.loadVehicles();
  }

  /**
   * Lädt alle Fahrzeuge von der API
   */
  loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.filteredVehicles = data; // Initial keine Filter
      },
      error: (err) => console.error('Fehler beim Laden der Fahrzeuge:', err),
    });
  }

  /**
   * Setzt den aktuellen Fahrzeugtyp und filtert die Daten entsprechend.
   * @param type Fahrzeugtyp (z.B. "Car", "Truck", etc.)
   */
  selectVehicleType(type: string) {
    this.currentVehicleType = type;
    this.filteredVehicles = this.vehicles.filter(v => v.category === type);
  }

  /**
   * Wendet die Filter auf die Fahrzeuge an.
   */
  applyFilters() {
    if (!this.currentVehicleType) {
      return;
    }
    this.filteredVehicles = this.vehicles
      .filter((v) => v.category === this.currentVehicleType) // Nach Typ filtern
      .filter((v) => {
        const matchesSearchTerm = this.filters.searchTerm
          ? v.name.toLowerCase().includes(this.filters.searchTerm.toLowerCase()) ||
            v.description.toLowerCase().includes(this.filters.searchTerm.toLowerCase())
          : true;

        const matchesBrand = this.filters.brand
          ? v.mark.toLowerCase().includes(this.filters.brand.toLowerCase())
          : true;

        const matchesModel = this.filters.model
          ? v.model.toLowerCase().includes(this.filters.model.toLowerCase())
          : true;

        const matchesPrice = this.filters.maxPrice
          ? v.price <= this.filters.maxPrice
          : true;

        const matchesMileage = this.filters.maxMileage
          ? v.mileage <= this.filters.maxMileage
          : true;

        const matchesYear = this.filters.minYear
          ? new Date(v.firstRegistration).getFullYear() >= this.filters.minYear
          : true;

        return (
          matchesSearchTerm &&
          matchesBrand &&
          matchesModel &&
          matchesPrice &&
          matchesMileage &&
          matchesYear
        );
      });
  }
}
