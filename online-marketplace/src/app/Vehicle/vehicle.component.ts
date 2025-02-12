import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/Vehicle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css'],
  imports:[CommonModule, FormsModule]
})
export class VehicleComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  currentVehicleType: string | null = null;
  brands: any[] = []; // List of brands
  models: any[] = []; // List of models for selected brand

  filters = {
    searchTerm: '',
    brand: '',
    model: '',
    maxPrice: null as number | null,
    maxMileage: null as number | null,
    minYear: null as number | null,
  };

  constructor(private vehicleService: VehicleService, private router: Router,private cdRef: ChangeDetectorRef) {}
  categories: string[] = ['Car', 'Truck', 'Motorcycle', 'Caravan'];

  ngOnInit() {
    this.loadVehicles();
    this.loadBrands(); // Load available brands
  }

  /**
   * Load all vehicles from the API.
   */
  loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.filteredVehicles = [...data]; 
        this.cdRef.detectChanges(); // Manuell Angular zur Aktualisierung zwingen
        console.log('🚗 Fahrzeuge geladen:', this.filteredVehicles);
      },
      error: (err) => console.error('❌ Fehler beim Laden der Fahrzeuge:', err),
    });
  }

  /**
   * Load all brands from the API.
   */
  loadBrands() {
    this.vehicleService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => console.error('Error loading brands:', err),
    });
  }

  /**
   * Load models based on selected brand.
   */
  onBrandChange() {
    const selectedBrand = Number(this.filters.brand); // Konvertiere in Zahl
  
    if (!isNaN(selectedBrand)) { // Überprüfe, ob die Konvertierung erfolgreich war
      this.vehicleService.getModels(selectedBrand).subscribe({
        next: (data) => {
          this.models = data;
        },
        error: (err) => console.error('Error loading models:', err),
      });
    } else {
      this.models = [];
    }
  }

  selectVehicleType(type: string) {
    console.log("Selected vehicle type:", type); // Debugging
    this.currentVehicleType = type;
    this.filteredVehicles = this.vehicles.filter(v => v.category === type);
  }
  

  /**
   * Apply selected filters to the vehicle list.
   */
  applyFilters() {
    if (!this.currentVehicleType) {
      return; // Wenn kein Typ ausgewählt wurde, nichts tun
    }
  
    this.filteredVehicles = this.vehicles
      .filter((v) => v.category === this.currentVehicleType) // Nach Typ filtern
      .filter((v) => {
        const matchesSearchTerm = this.filters.searchTerm
          ? v.name?.toLowerCase().includes(this.filters.searchTerm.toLowerCase()) ||
            v.description?.toLowerCase().includes(this.filters.searchTerm.toLowerCase())
          : true;
  
        const matchesBrand = this.filters.brand
          ? v.mark?.toLowerCase().includes(this.filters.brand.toLowerCase())
          : true;
  
        const matchesModel = this.filters.model
          ? v.model?.toLowerCase().includes(this.filters.model.toLowerCase())
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
  
    // 🔥 UI-Update erzwingen, damit das letzte Fahrzeug sofort geladen wird
    this.filteredVehicles = [...this.filteredVehicles];
  
    console.log('🔍 Filter applied, updated list:', this.filteredVehicles);
  }
  
  

  /**
   * Navigate to vehicle details page.
   */
  goToDetail(vehicleId: number): void {
    this.router.navigate(['/vehicleMarket/vehicles', vehicleId]);
  }

  /**
   * Navigate back to the main vehicle marketplace.
   */
  goBack(): void {
    this.router.navigate(['/retail']);
  }
  
}
