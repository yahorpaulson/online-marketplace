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
  firstRegistrationYears: number[] = []; 

  filters = {
    searchTerm: '',
    brand: 0,
    model: 0,
    maxPrice: null as number | null,
    maxMileage: null as number | null,
    minYear: null as number | null,
  };

  constructor(private vehicleService: VehicleService, private router: Router,private cdRef: ChangeDetectorRef) {}
  categories: string[] = ['Car', 'Truck', 'Motorcycle', 'Caravan'];

  ngOnInit() {
    this.loadVehicles();
    this.loadBrands(); 
    this.generateFirstRegistrationYears();
  }

  /**
   * Load all vehicles from the API.
   */
  loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        console.log('🚗 RAW VEHICLE DATA FROM API:', data);
        this.vehicles = data;
        this.filteredVehicles = [...data]; 
        console.log('🚗 Vehicles stored in component:', this.vehicles);
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

  generateFirstRegistrationYears() {
    const startYear = 1990;
    const endYear = new Date().getFullYear(); // Aktuelles Jahr
    this.firstRegistrationYears = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }
  

  /**
   * Apply selected filters to the vehicle list.
   */
  applyFilters() {
    if (!this.currentVehicleType) return;

    console.log('🔍 Applying Filters...');
    console.log('Selected Vehicle Type:', this.currentVehicleType);
    console.log('Filters:', this.filters);

    this.filteredVehicles = this.vehicles.filter(v => {
      console.log('Checking vehicle:', v); // Debugging
      
      const matchesCategory = v.category === this.currentVehicleType;
      const matchesSearchTerm = this.filters.searchTerm
        ? v.name.toLowerCase().includes(this.filters.searchTerm.toLowerCase()) ||
          v.description.toLowerCase().includes(this.filters.searchTerm.toLowerCase())
        : true;

      const matchesBrand = this.filters.brand
        ? Number(v.brandId) === Number(this.filters.brand)
        : true;

      const matchesModel = this.filters.model
        ? Number(v.modelId) === Number(this.filters.model)
        : true;

      const matchesPrice = this.filters.maxPrice ? v.price <= this.filters.maxPrice : true;
      const matchesMileage = this.filters.maxMileage ? v.mileage <= this.filters.maxMileage : true;
      const matchesYear = this.filters.minYear ? Number(v.firstRegistration) >= Number(this.filters.minYear) : true;

      return matchesCategory && matchesSearchTerm && matchesBrand && matchesModel && matchesPrice && matchesMileage && matchesYear;
    });

    console.log('🔍 Filter applied, updated list:', this.filteredVehicles);

    this.cdRef.detectChanges(); // 🔥 Manuelle Aktualisierung erzwingen!
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