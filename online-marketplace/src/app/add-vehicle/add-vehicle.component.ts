import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { VehicleService } from '../services/vehicle.service';
import { CommonModule } from '@angular/common';
import { AuthserviceService } from '../authservice.service';
import { SanitizationService } from '../services/sanitization.service';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css'],
  imports: [CommonModule,ReactiveFormsModule]
})
export class AddVehicleComponent implements OnInit {
  vehicleForm: FormGroup;
  categories = ['Car', 'Truck', 'Motorcycle', 'Caravan']; // Fahrzeugkategorien
  brands: any[] = []; // Gefilterte Marken
  models: any[] = []; // Gefilterte Modelle
  allBrands: any[] = []; // Alle Marken
  allModels: any[] = []; // Alle Modelle
  firstRegistrationYears: number[] = [];
  fuelTypes: string[] = ['Diesel', 'Benzin', 'Gas']; // Treibstoffarten
  powerOptions: number[] = [];
  activeVehicles:any[]=[];
  soldVehicles:any[]=[];
  


  constructor(private fb: FormBuilder, private vehicleService: VehicleService, private authService:AuthserviceService, private sanitizationService:SanitizationService) {
    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      mileage: [0, [Validators.required, Validators.min(0)]],
      firstRegistration: ['', Validators.required],
      fuelType: ['', Validators.required],
      power: [0],
      description: ['', Validators.required],
      image: [''],
      isSold: [false], 
      sellerId: [this.authService.getUserId()], 
      location: [''],
      doors: [4],
      seats: [5],
      vehicleType: [''],
      condition: [''],
      warranty: [false],
      transmission: [''],
      drive: [''],
      color: [''],
      batteryCapacity: [null],
      range: [null],
    });
    
  }

  ngOnInit() {
    this.loadBrands();
    this.generateFirstRegistrationYears();
    this.generatePowerOptions();
    this.loadUserVehicles();
  }

  generatePowerOptions() {
    for (let i = 50; i <= 150; i += 10) {
      this.powerOptions.push(i);
    }
  }

  loadBrands() {
    this.vehicleService.getBrands().subscribe({
      next: (data) => {
        console.log('Alle Marken geladen:', data);
        this.allBrands = data;
      },
      error: (err) => console.error('Fehler beim Laden der Marken:', err),
    });
  }

 
loadModels(brandId: number) {
  if (!brandId) {
    this.models = []; 
    return;
  }

  this.vehicleService.getModels(brandId).subscribe({
    next: (data) => {
      console.log(`Modelle für Marke ${brandId} geladen:`, data);
      this.models = data;
    },
    error: (err) => console.error('Fehler beim Laden der Modelle:', err),
  });
}

generateFirstRegistrationYears() {
  const startYear = 1990;
  const endYear = new Date().getFullYear(); // Aktuelles Jahr
  this.firstRegistrationYears = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
}
 
onCategoryChange() {
  const selectedCategory = this.vehicleForm.get('category')?.value;
  if (!selectedCategory) return;

  this.brands = this.allBrands.filter((brand) => brand.category === selectedCategory);
  this.vehicleForm.patchValue({ brand: '', model: '' });
  this.models = [];
}

onBrandChange() {
  const selectedBrandId = this.vehicleForm.get('brand')?.value;
  if (!selectedBrandId) return;

  this.loadModels(selectedBrandId);
}

  

onSubmit() {
  if (!this.vehicleForm.valid) {
    alert('Please fill out all required fields.');
    return;
  }

  // 🧹 Sanitize user input
  let { brand, model, firstRegistration, power, name, description, ...formData } = this.vehicleForm.value;

  name = this.sanitizationService.sanitizeInput(name);
  description = this.sanitizationService.sanitizeInput(description);

  // 🏷️ Brand & Model validieren
  const selectedBrand = this.allBrands.find(b => b.id === Number(brand));
  const selectedModel = this.models.find(m => m.id === Number(model));

  if (!selectedBrand || !selectedModel) {
    alert("Invalid brand or model selection.");
    return;
  }

  const vehicleData = {
    ...formData,
    name,
    description,
    brandId: selectedBrand.id,
    brand: selectedBrand.name,
    modelId: selectedModel.id,
    model: selectedModel.name,
    firstRegistration: firstRegistration ? Number(firstRegistration) : null,
    power: power ? Number(power) : 0, // Falls power null ist, setze 0
  };

  console.log('🚀 Sending vehicle data:', vehicleData);

  this.vehicleService.addVehicle(vehicleData).subscribe({
    next: (response) => {
      console.log('✅ Vehicle added:', response);
      alert('Vehicle successfully added!');
      this.vehicleForm.reset();
      this.loadUserVehicles();
    },
    error: (err) => {
      console.error('❌ Error adding vehicle:', err);
      alert(`Error adding vehicle: ${err.message}`);
    },
  });
}


  

  loadUserVehicles(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error("User ID is null. Cannot fetch user vehicles.");
      return;
    }
  
    this.vehicleService.getUserVehicles(userId).subscribe({
      next: (vehicles) => {
        this.activeVehicles = vehicles.filter(v => !v.isSold);
        this.soldVehicles = vehicles.filter(v => v.isSold);
      },
      error: (err) => console.error("Error fetching user vehicles:", err),
    });
  }
  

onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.type)) {
    alert("Only JPG and PNG images are allowed.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.vehicleForm.patchValue({ image: e.target.result });
    console.log('Selected Image:', e.target.result);
  };

  reader.readAsDataURL(file);
}

editVehicle(vehicle: any): void {
  this.vehicleForm.patchValue(vehicle);
  window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

deleteVehicle(vehicleId: number, event: Event): void {
  event.stopPropagation(); // Verhindert das Öffnen der Bearbeitungsfunktion
  if (confirm("Are you sure you want to delete this vehicle?")) {
    this.vehicleService.deleteVehicle(vehicleId).subscribe({
      next: () => {
        console.log(`Vehicle ${vehicleId} deleted.`);
        this.loadUserVehicles(); // Aktualisiert die Liste
      },
      error: (err) => console.error("Error deleting vehicle:", err),
    });
  }
}



}
