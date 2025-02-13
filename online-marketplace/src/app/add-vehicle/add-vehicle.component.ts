import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { VehicleService } from '../services/vehicle.service';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder, private vehicleService: VehicleService) {
    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required], // Neue Kategorieauswahl
      brand: ['', Validators.required],
      model: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      mileage: [0, [Validators.required, Validators.min(0)]],
      firstRegistration: ['', Validators.required],
      fuelType: ['', Validators.required],
      power: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      image: [''],
      isSold: [false],
      sellerId: [0, Validators.required],
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
    this.loadFirstRegistrationYears();
    this.generatePowerOptions();
  }

  generatePowerOptions() {
    for (let i = 50; i <= 150; i += 10) {
      this.powerOptions.push(i);
    }
  }
  // Lade alle Marken aus der DB
  loadBrands() {
    this.vehicleService.getBrands().subscribe({
      next: (data) => {
        console.log('✅ Alle Marken geladen:', data);
        this.allBrands = data;
      },
      error: (err) => console.error('❌ Fehler beim Laden der Marken:', err),
    });
  }

  // Lade Modelle für eine bestimmte Marke aus der DB
loadModels(brandId: number) {
  if (!brandId) {
    this.models = []; // Falls keine Marke ausgewählt ist, setze die Modelle zurück
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

loadFirstRegistrationYears() {
  this.vehicleService.getFirstRegistrationYears().subscribe({
    next: (data) => this.firstRegistrationYears = data,
    error: (err) => console.error('Error loading first registration years:', err)
  });
}


  // Filtere Marken basierend auf der gewählten Kategorie
  onCategoryChange() {
    const selectedCategory = this.vehicleForm.get('category')?.value;
    this.brands = this.allBrands.filter((brand) => brand.category === selectedCategory);
    this.models = []; // Modelle zurücksetzen
    this.vehicleForm.get('brand')?.setValue('');
    this.vehicleForm.get('model')?.setValue('');
  }

  // Filtere Modelle basierend auf der gewählten Marke
  onBrandChange() {
    const selectedBrandId = this.vehicleForm.get('brand')?.value;
    console.log('📌 Gewählte Marke ID:', selectedBrandId);
  
    this.loadModels(selectedBrandId); // Lade Modelle für diese Marke
  }
  

  onSubmit() {
    if (this.vehicleForm.valid) {
      let formData = this.vehicleForm.value;

      console.log('📤 Sende Formulardaten:', formData);

      this.vehicleService.addVehicle(formData).subscribe({
        next: (response) => {
          console.log('✅ Fahrzeug hinzugefügt:', response);
          alert('Fahrzeug erfolgreich hinzugefügt!');
          this.vehicleForm.reset();
        },
        error: (err) => {
          console.error('❌ Fehler beim Hinzufügen:', err);
          alert(`Fehler beim Hinzufügen: ${err.message}`);
        },
      });
    } else {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.');
    }
  }
}
